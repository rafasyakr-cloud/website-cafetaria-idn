"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function DashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "roles" | "news" | "orders" | "password">("overview");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Orders Management State
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState<string>("");
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null);
  const [rejectingOrder, setRejectingOrder] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // User Management State
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserForRole, setSelectedUserForRole] = useState<any>(null);
  const [newRoleId, setNewRoleId] = useState("");

  // Role Management State
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  // News CRUD State
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail_path: "/images/menu/v60-gayo.jpg",
    status: "published",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<any>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{ type: "user" | "news" | "role"; id: string; name: string } | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [meRes, usersRes, rolesRes, newsRes, ordersRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/admin/users"),
        fetch("/api/admin/roles"),
        fetch("/api/admin/news"),
        fetch("/api/admin/orders"),
      ]);

      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData.roles || []);
      }
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData.news || []);
      }
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  // User Actions
  const handleToggleUserStatus = async (user: any) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setUsers(users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
      showNotification(`Status ${user.name} berhasil diubah menjadi ${newStatus}.`);
    } catch (err: any) {
      showNotification(err.message, "error");
    }
  };

  const handleUpdateUserRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForRole || !newRoleId) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUserForRole.id, role_id: newRoleId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      const targetRole = roles.find((r) => r.id === newRoleId);
      setUsers(
        users.map((u) =>
          u.id === selectedUserForRole.id
            ? { ...u, role_id: newRoleId, role_name: targetRole?.name || u.role_name }
            : u
        )
      );
      setSelectedUserForRole(null);
      showNotification(`Role ${selectedUserForRole.name} berhasil diperbarui.`);
    } catch (err: any) {
      showNotification(err.message, "error");
    }
  };

  // Role Actions
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newRoleName.trim(),
          description: newRoleDesc.trim(),
          permissions: ["general.view"],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setRoles([...roles, data.role]);
      setNewRoleName("");
      setNewRoleDesc("");
      showNotification(`Role baru "${data.role.name}" berhasil dibuat.`);
    } catch (err: any) {
      showNotification(err.message, "error");
    }
  };

  // News Actions
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setNewsForm({ ...newsForm, thumbnail_path: data.filePath });
      showNotification("Gambar berhasil diunggah ke penyimpanan lokal.");
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingNews ? `/api/admin/news/${editingNews.id}` : "/api/admin/news";
      const method = editingNews ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      if (editingNews) {
        setNews(news.map((n) => (n.id === editingNews.id ? data.article : n)));
        showNotification("Berita berhasil diperbarui.");
      } else {
        setNews([data.article, ...news]);
        showNotification("Berita baru berhasil ditambahkan.");
      }

      setShowNewsModal(false);
      setEditingNews(null);
      setNewsForm({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        thumbnail_path: "/images/menu/v60-gayo.jpg",
        status: "published",
      });
    } catch (err: any) {
      showNotification(err.message, "error");
    }
  };

  const handleToggleNewsStatus = async (item: any) => {
    const newStatus = item.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/news/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setNews(news.map((n) => (n.id === item.id ? { ...n, status: newStatus } : n)));
      showNotification(`Status artikel berhasil diubah ke ${newStatus}.`);
    } catch (err: any) {
      showNotification(err.message, "error");
    }
  };

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    const { type, id } = deleteModal;

    try {
      let url = "";
      if (type === "user") url = `/api/admin/users?id=${id}`;
      else if (type === "news") url = `/api/admin/news/${id}`;
      else if (type === "role") url = `/api/admin/roles?id=${id}`;

      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      if (type === "user") setUsers(users.filter((u) => u.id !== id));
      else if (type === "news") setNews(news.filter((n) => n.id !== id));
      else if (type === "role") setRoles(roles.filter((r) => r.id !== id));

      showNotification(`Data ${deleteModal.name} berhasil dihapus.`);
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setDeleteModal(null);
    }
  };

  // Password Change Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification("Konfirmasi kata sandi baru tidak cocok.", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      showNotification("Password admin berhasil diubah! Simpan password baru Anda.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, reason?: string) => {
    setStatusUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejection_reason: reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status, rejection_reason: reason } : o)));
      if (selectedOrderDetail && selectedOrderDetail.id === orderId) {
        setSelectedOrderDetail({ ...selectedOrderDetail, status, rejection_reason: reason });
      }
      showNotification(`Status pesanan berhasil diubah menjadi "${status}".`);
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setStatusUpdatingId(null);
      setRejectingOrder(null);
      setRejectionReason("");
    }
  };

  const getWhatsAppLink = (order: any) => {
    const cleanPhone = (order.whatsapp || "").replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;
    const text = encodeURIComponent(
      `Halo Kak ${order.customer_name}, kami dari tim Cafetaria IDN Senopati mengenai pesanan Anda #${order.order_code}.`
    );
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  const pendingOrdersCount = orders.filter((o) => o.status === "menunggu_konfirmasi").length;

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === "all" || o.status === orderFilter;
    const matchesSearch =
      o.order_code.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.whatsapp.includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role_name.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-container-low/70 flex flex-col font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Toast Notification */}
      {message && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-3 animate-bounce ${
            message.type === "success"
              ? "bg-secondary-espresso text-on-secondary border border-primary-crema/40"
              : "bg-red-900 text-white border border-red-500"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {message.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/40 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative h-8 w-28 flex items-center">
              <Image src="/images/logo.png" alt={siteConfig.name} fill className="object-contain" priority />
            </Link>
            <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              Admin Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-on-surface-variant hover:text-primary font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">visibility</span>
              <span className="hidden sm:inline">Pratinjau Website</span>
            </Link>

            <div className="h-4 w-px bg-outline-variant/60" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-on-surface leading-tight">
                  {currentUser?.name || "Administrator"}
                </p>
                <p className="text-[10px] text-on-surface-variant font-mono">
                  {currentUser?.email || "admin@gmail.com"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-outline hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Keluar Akun"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Security Warning Banner (Admin Default Password Warning) */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-amber-900">
          <span className="material-symbols-outlined text-amber-700 text-base">warning</span>
          <span>
            <strong>Peringatan Keamanan:</strong> Kredensial bawaan admin publik (<code className="font-mono bg-amber-200/60 px-1 rounded">admin@gmail.com / 123456</code>). Harap ubah password sebelum mempublikasikan website!
          </span>
          <button
            onClick={() => setActiveTab("password")}
            className="text-primary underline font-bold hover:text-primary-hover whitespace-nowrap"
          >
            Ganti Password Sekarang
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex-1 w-full space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-outline-variant/30">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span>Ringkasan</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "users"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-lg">group</span>
            <span>Manajemen User</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-container-high text-on-surface font-mono">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("roles")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "roles"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            <span>Manajemen Role</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-container-high text-on-surface font-mono">
              {roles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "news"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-lg">article</span>
            <span>CRUD Berita & Konten</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-container-high text-on-surface font-mono">
              {news.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-lg">receipt_long</span>
            <span>Manajemen Pesanan</span>
            {pendingOrdersCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-600 text-white font-mono font-bold animate-pulse">
                {pendingOrdersCount} Baru
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-container-high text-on-surface font-mono">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "password"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-lg">key</span>
            <span>Ganti Password</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm space-y-2">
                <div className="flex items-center justify-between text-outline">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Pesanan</span>
                  <span className="material-symbols-outlined text-primary text-2xl">receipt_long</span>
                </div>
                <p className="text-3xl font-extrabold text-on-surface">{orders.length}</p>
                <p className="text-[11px] text-on-surface-variant">
                  {orders.filter((o) => o.status === "dikonfirmasi" || o.status === "selesai").length} pesanan terkonfirmasi
                </p>
              </div>

              <div className={`p-6 rounded-2xl border shadow-warm space-y-2 ${
                pendingOrdersCount > 0
                  ? "bg-amber-50/80 border-amber-300"
                  : "bg-surface-container-lowest border-outline-variant/40"
              }`}>
                <div className="flex items-center justify-between text-outline">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">Menunggu Verifikasi</span>
                  <span className="material-symbols-outlined text-amber-700 text-2xl animate-pulse">hourglass_top</span>
                </div>
                <p className="text-3xl font-extrabold text-amber-950">{pendingOrdersCount}</p>
                <p className="text-[11px] text-amber-800">Tiket perlu dicek kasir</p>
              </div>

              <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm space-y-2">
                <div className="flex items-center justify-between text-outline">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Pengguna</span>
                  <span className="material-symbols-outlined text-primary text-2xl">people</span>
                </div>
                <p className="text-3xl font-extrabold text-on-surface">{users.length}</p>
                <p className="text-[11px] text-on-surface-variant">
                  {users.filter((u) => u.status === "active").length} akun aktif
                </p>
              </div>

              <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm space-y-2">
                <div className="flex items-center justify-between text-outline">
                  <span className="text-xs font-semibold uppercase tracking-wider">Berita & Cerita</span>
                  <span className="material-symbols-outlined text-primary text-2xl">feed</span>
                </div>
                <p className="text-3xl font-extrabold text-on-surface">{news.length}</p>
                <p className="text-[11px] text-on-surface-variant">
                  {news.filter((n) => n.status === "published").length} tayang di landing page
                </p>
              </div>

              <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm space-y-2">
                <div className="flex items-center justify-between text-outline">
                  <span className="text-xs font-semibold uppercase tracking-wider">Role Terdaftar</span>
                  <span className="material-symbols-outlined text-primary text-2xl">security</span>
                </div>
                <p className="text-3xl font-extrabold text-on-surface">{roles.length}</p>
                <p className="text-[11px] text-on-surface-variant">2 role sistem (admin & user)</p>
              </div>

              <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm space-y-2">
                <div className="flex items-center justify-between text-outline">
                  <span className="text-xs font-semibold uppercase tracking-wider">Status Database</span>
                  <span className="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
                </div>
                <p className="text-lg font-bold text-emerald-700">Terhubung & Siap</p>
                <p className="text-[11px] text-on-surface-variant">Spreadsheet / Local Store Engine</p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm space-y-4">
              <h3 className="text-lg font-bold text-on-surface">Pintasan Cepat Administrator</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setEditingNews(null);
                    setNewsForm({
                      title: "",
                      slug: "",
                      excerpt: "",
                      content: "",
                      thumbnail_path: "/images/menu/v60-gayo.jpg",
                      status: "published",
                    });
                    setShowNewsModal(true);
                  }}
                  className="p-4 rounded-xl border border-outline-variant/40 hover:border-primary bg-surface flex items-center gap-3 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-2xl text-primary">add_circle</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Buat Artikel Baru</p>
                    <p className="text-[11px] text-on-surface-variant">Publikasikan cerita kopi & kabar gerai</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className="p-4 rounded-xl border border-outline-variant/40 hover:border-primary bg-surface flex items-center gap-3 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-2xl text-primary">manage_accounts</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Kelola Role & Pengguna</p>
                    <p className="text-[11px] text-on-surface-variant">Lihat daftar atau ubah izin akses akun</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("password")}
                  className="p-4 rounded-xl border border-outline-variant/40 hover:border-primary bg-surface flex items-center gap-3 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-2xl text-primary">lock_reset</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Perbarui Password Admin</p>
                    <p className="text-[11px] text-on-surface-variant">Tingkatkan keamanan akun utama</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Daftar Pengguna Terdaftar</h3>
                <p className="text-xs text-on-surface-variant">
                  Cari, aktifkan/nonaktifkan akun, atau ubah role pengguna
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari nama, email, role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container/60 text-on-surface-variant uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Pengguna</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Terdaftar</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-outline">
                        Tidak ada pengguna yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-surface/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-on-surface">{u.name}</p>
                          <p className="text-[11px] text-on-surface-variant font-mono">{u.email}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role_name === "admin"
                                ? "bg-primary-fixed text-on-primary-fixed"
                                : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            {u.role_name}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              u.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {u.status === "active" ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant text-[11px]">
                          {new Date(u.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                          {/* Tombol Ubah Role */}
                          <button
                            onClick={() => {
                              setSelectedUserForRole(u);
                              setNewRoleId(u.role_id);
                            }}
                            className="px-2.5 py-1 rounded-lg border border-outline-variant/60 hover:border-primary text-on-surface hover:text-primary text-[11px] font-semibold transition-colors"
                          >
                            Ubah Role
                          </button>

                          {/* Tombol Toggle Status */}
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            disabled={u.id === currentUser?.id}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                              u.id === currentUser?.id
                                ? "opacity-40 cursor-not-allowed text-outline border border-outline-variant/30"
                                : u.status === "active"
                                ? "border border-amber-300 text-amber-800 hover:bg-amber-50"
                                : "border border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                            }`}
                          >
                            {u.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                          </button>

                          {/* Tombol Hapus */}
                          <button
                            onClick={() => setDeleteModal({ type: "user", id: u.id, name: u.name })}
                            disabled={u.id === currentUser?.id}
                            className="p-1 rounded-lg text-outline hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Hapus Pengguna"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ROLE MANAGEMENT */}
        {activeTab === "roles" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Role List */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Daftar Role Akses</h3>
                <p className="text-xs text-on-surface-variant">
                  Role bawaan sistem tidak dapat dihapus untuk menjamin integritas aplikasi
                </p>
              </div>

              <div className="space-y-3">
                {roles.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl border border-outline-variant/40 bg-surface flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface">{r.name}</span>
                        {r.is_system && (
                          <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                            Role Sistem
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant">{r.description || "-"}</p>
                    </div>

                    {!r.is_system && (
                      <button
                        onClick={() => setDeleteModal({ type: "role", id: r.id, name: r.name })}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Create Custom Role */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Tambah Role Kustom</h3>
                <p className="text-xs text-on-surface-variant">Buat role baru sesuai struktur tim Anda</p>
              </div>

              <form onSubmit={handleCreateRole} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-on-surface">Nama Role (Huruf Kecil)</label>
                  <input
                    type="text"
                    required
                    placeholder="contoh: barista, supervisor"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-on-surface">Deskripsi Peran</label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan cakupan tanggung jawab role ini..."
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-semibold text-xs transition-transform active:scale-95"
                >
                  Simpan Role Baru
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: CRUD NEWS & STORIES */}
        {activeTab === "news" && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Manajemen Artikel & Berita</h3>
                <p className="text-xs text-on-surface-variant">
                  Artikel berstatus &apos;Published&apos; akan langsung tampil di Beranda dan halaman warta kopi
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingNews(null);
                  setNewsForm({
                    title: "",
                    slug: "",
                    excerpt: "",
                    content: "",
                    thumbnail_path: "/images/menu/v60-gayo.jpg",
                    status: "published",
                  });
                  setShowNewsModal(true);
                }}
                className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-bold text-xs shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Tulis Berita Baru</span>
              </button>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-outline-variant/40 overflow-hidden bg-surface flex flex-col justify-between group shadow-xs hover:shadow-warm transition-all"
                >
                  <div>
                    <div className="relative h-44 w-full bg-surface-container overflow-hidden">
                      <Image
                        src={item.thumbnail_path || "/images/menu/v60-gayo.jpg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "published"
                            ? "bg-emerald-700 text-white"
                            : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <p className="text-[11px] text-outline">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <h4 className="font-bold text-sm text-on-surface line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-outline-variant/20 pt-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPreviewArticle(item)}
                        className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container"
                        title="Pratinjau"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingNews(item);
                          setNewsForm({
                            title: item.title,
                            slug: item.slug,
                            excerpt: item.excerpt,
                            content: item.content,
                            thumbnail_path: item.thumbnail_path,
                            status: item.status,
                          });
                          setShowNewsModal(true);
                        }}
                        className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container"
                        title="Edit Berita"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteModal({ type: "news", id: item.id, name: item.title })}
                        className="p-1.5 rounded-lg text-outline hover:text-red-700 hover:bg-red-50"
                        title="Hapus Berita"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleToggleNewsStatus(item)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                        item.status === "published"
                          ? "border border-amber-300 text-amber-800 hover:bg-amber-50"
                          : "border border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                      }`}
                    >
                      {item.status === "published" ? "Jadikan Draft" : "Publikasikan"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: MANAJEMEN PESANAN (ORDERS) */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Manajemen Pesanan Masuk & QRIS</h3>
                <p className="text-xs text-on-surface-variant">
                  Verifikasi pembayaran tiket pesanan QRIS, konfirmasi kesiapan sajian, dan hubungi pelanggan via WhatsApp.
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
                {[
                  { id: "all", label: "Semua", count: orders.length },
                  { id: "menunggu_konfirmasi", label: "Menunggu Konfirmasi", count: orders.filter((o) => o.status === "menunggu_konfirmasi").length, alert: true },
                  { id: "dikonfirmasi", label: "Dikonfirmasi", count: orders.filter((o) => o.status === "dikonfirmasi").length },
                  { id: "selesai", label: "Selesai", count: orders.filter((o) => o.status === "selesai").length },
                  { id: "ditolak", label: "Ditolak / Batal", count: orders.filter((o) => o.status === "ditolak").length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      orderFilter === tab.id
                        ? "bg-primary text-on-primary shadow-xs"
                        : "bg-surface hover:bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      tab.alert && tab.count > 0 && orderFilter !== tab.id ? "bg-red-600 text-white" : "bg-black/10"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-base">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari kode / nama / WA..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* Table of Orders */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-outline-variant/40 bg-surface-container-low/50 text-outline uppercase tracking-wider text-[11px] font-bold">
                      <th className="py-3 px-4">Tiket & Waktu</th>
                      <th className="py-3 px-4">Pemesan & WhatsApp</th>
                      <th className="py-3 px-4">Tipe & Tagihan</th>
                      <th className="py-3 px-4">Bukti QRIS</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi Kasir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-outline">
                          Tidak ada data pesanan yang sesuai dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        let parsed: any = {};
                        try { parsed = JSON.parse(ord.items_json); } catch(e) {}
                        const fnbCount = Array.isArray(parsed.fnbItems) ? parsed.fnbItems.length : 0;
                        const hasRes = Boolean(parsed.reservationDetails);

                        return (
                          <tr key={ord.id} className="hover:bg-surface-container/30 transition-colors">
                            <td className="py-3 px-4 font-mono">
                              <span className="font-bold text-primary block">#{ord.order_code}</span>
                              <span className="text-[10px] text-outline">
                                {new Date(ord.created_at).toLocaleDateString("id-ID", {
                                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                                })}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-on-surface block">{ord.customer_name}</span>
                              <a
                                href={getWhatsAppLink(ord)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-[#25D366] hover:underline font-semibold"
                              >
                                <span className="material-symbols-outlined text-xs">chat</span>
                                <span>{ord.whatsapp}</span>
                              </a>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-extrabold text-on-surface block">
                                Rp {Number(ord.total_amount).toLocaleString("id-ID")}
                              </span>
                              <span className="text-[10px] text-outline">
                                {fnbCount > 0 ? `${fnbCount} item F&B` : ""}
                                {fnbCount > 0 && hasRes ? " + " : ""}
                                {hasRes ? "Reservasi" : ""}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              {ord.payment_proof_path ? (
                                <a
                                  href={ord.payment_proof_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold"
                                >
                                  <span className="material-symbols-outlined text-sm">attachment</span>
                                  <span>Lihat Struk</span>
                                </a>
                              ) : (
                                <span className="text-[11px] text-outline italic">Tanpa struk</span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                ord.status === "menunggu_konfirmasi"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : ord.status === "dikonfirmasi"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : ord.status === "selesai"
                                  ? "bg-blue-50 text-blue-800 border-blue-300"
                                  : "bg-red-50 text-red-800 border-red-300"
                              }`}>
                                <span className="material-symbols-outlined text-xs">
                                  {ord.status === "menunggu_konfirmasi" ? "hourglass_top" : ord.status === "dikonfirmasi" ? "check_circle" : ord.status === "selesai" ? "task_alt" : "cancel"}
                                </span>
                                <span>{ord.status.replace(/_/g, " ")}</span>
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderDetail(ord)}
                                  className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container"
                                  title="Lihat Rincian Pesanan"
                                >
                                  <span className="material-symbols-outlined text-base">visibility</span>
                                </button>

                                {ord.status === "menunggu_konfirmasi" && (
                                  <>
                                    <button
                                      type="button"
                                      disabled={statusUpdatingId === ord.id}
                                      onClick={() => handleUpdateOrderStatus(ord.id, "dikonfirmasi")}
                                      className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-transform active:scale-95 flex items-center gap-1"
                                      title="Konfirmasi Pembayaran"
                                    >
                                      <span className="material-symbols-outlined text-xs">check</span>
                                      <span>Konfirmasi</span>
                                    </button>
                                    <button
                                      type="button"
                                      disabled={statusUpdatingId === ord.id}
                                      onClick={() => {
                                        setRejectingOrder(ord);
                                        setRejectionReason("");
                                      }}
                                      className="px-2 py-1 rounded-full border border-red-300 text-red-700 hover:bg-red-50 text-[11px] font-semibold"
                                      title="Tolak Pesanan"
                                    >
                                      Tolak
                                    </button>
                                  </>
                                )}

                                {ord.status === "dikonfirmasi" && (
                                  <button
                                    type="button"
                                    disabled={statusUpdatingId === ord.id}
                                    onClick={() => handleUpdateOrderStatus(ord.id, "selesai")}
                                    className="px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1"
                                    title="Selesaikan Pesanan"
                                  >
                                    <span className="material-symbols-outlined text-xs">done_all</span>
                                    <span>Selesaikan</span>
                                  </button>
                                )}

                                <a
                                  href={getWhatsAppLink(ord)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg text-[#25D366] hover:bg-emerald-50"
                                  title="Chat WhatsApp Pemesan"
                                >
                                  <span className="material-symbols-outlined text-base">chat</span>
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GANTI PASSWORD ADMIN */}
        {activeTab === "password" && (
          <div className="max-w-xl mx-auto bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Ganti Kata Sandi Administrator</h3>
              <p className="text-xs text-on-surface-variant">
                Demi keamanan sistem, jangan gunakan password yang mudah ditebak
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password saat ini (bawaan: 123456)"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface">Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-3 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-semibold text-xs transition-transform active:scale-95 disabled:opacity-60"
              >
                {passwordLoading ? "Memperbarui..." : "Perbarui Kata Sandi"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL 1: Role Assignment Modal */}
      {selectedUserForRole && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl border border-outline-variant/50 p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-on-surface">
              Ubah Role: {selectedUserForRole.name}
            </h4>
            <form onSubmit={handleUpdateUserRole} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs text-on-surface-variant">Pilih Role Akses Baru:</label>
                <select
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.is_system ? "(Sistem)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForRole(null)}
                  className="px-4 py-2 rounded-full border border-outline-variant/60 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create / Edit News Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-2xl border border-outline-variant/50 p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-on-surface">
                {editingNews ? "Edit Berita" : "Tambah Berita Baru"}
              </h4>
              <button
                onClick={() => setShowNewsModal(false)}
                className="text-outline hover:text-on-surface text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface">Judul Berita</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rahasia Seduhan V60 Kintamani"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface">Ringkasan Singkat (Excerpt)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface">Konten Artikel Lengkap</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan isi cerita, resep, atau ulasan lengkap..."
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Upload Foto Lokal */}
              <div className="space-y-1.5 p-4 rounded-xl bg-surface-container/40 border border-outline-variant/40">
                <label className="block text-xs font-semibold text-on-surface">Upload Thumbnail Gambar</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    className="text-xs text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary-hover"
                  />
                  {uploadingImage && (
                    <span className="text-xs text-primary font-medium animate-pulse">Mengunggah...</span>
                  )}
                </div>
                <p className="text-[10px] text-on-surface-variant">
                  File disimpan lokal di folder <code className="font-mono">public/uploads/</code>
                </p>
                {newsForm.thumbnail_path && (
                  <p className="text-[11px] text-outline font-mono truncate">
                    Path aktif: {newsForm.thumbnail_path}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface">Status Tayang</label>
                <select
                  value={newsForm.status}
                  onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="published">Published (Langsung Tayang di Website)</option>
                  <option value="draft">Draft (Simpan Sementara)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setShowNewsModal(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant/60 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold"
                >
                  {editingNews ? "Simpan Perubahan" : "Terbitkan Berita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Preview Article Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl border border-outline-variant/50 p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Pratinjau Artikel
              </span>
              <button onClick={() => setPreviewArticle(null)} className="text-outline text-lg">
                ✕
              </button>
            </div>

            <div className="relative h-48 w-full rounded-xl overflow-hidden bg-surface-container">
              <Image
                src={previewArticle.thumbnail_path || "/images/menu/v60-gayo.jpg"}
                alt={previewArticle.title}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-lg font-bold text-on-surface">{previewArticle.title}</h3>
            <p className="text-xs text-on-surface-variant font-medium italic border-l-2 border-primary pl-3">
              {previewArticle.excerpt}
            </p>
            <div className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap">
              {previewArticle.content}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setPreviewArticle(null)}
                className="px-4 py-1.5 rounded-full bg-surface-container text-xs font-bold"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl border border-outline-variant/50 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h4 className="text-base font-bold">Konfirmasi Hapus</h4>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Apakah Anda yakin ingin menghapus data <strong>&quot;{deleteModal.name}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-full border border-outline-variant/60 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 5: Order Detail Modal */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-3xl border border-outline-variant/50 p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-outline">Detail Tiket Pesanan</span>
                <h3 className="text-xl font-bold text-primary font-mono">
                  #{selectedOrderDetail.order_code}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {new Date(selectedOrderDetail.created_at).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetail(null)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface"
              >
                ✕
              </button>
            </div>

            {/* Pemesan & WhatsApp */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-surface p-4 rounded-2xl border border-outline-variant/40">
              <div>
                <span className="text-[10px] text-outline uppercase font-semibold block">Nama Pemesan</span>
                <span className="font-bold text-on-surface text-sm">{selectedOrderDetail.customer_name}</span>
              </div>
              <div>
                <span className="text-[10px] text-outline uppercase font-semibold block">WhatsApp</span>
                <a
                  href={getWhatsAppLink(selectedOrderDetail)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#25D366] hover:underline inline-flex items-center gap-1 text-sm"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  <span>{selectedOrderDetail.whatsapp}</span>
                </a>
              </div>
            </div>

            {/* Rincian Items */}
            {(() => {
              let parsed: any = {};
              try { parsed = JSON.parse(selectedOrderDetail.items_json); } catch(e) {}
              const fnbList = Array.isArray(parsed.fnbItems) ? parsed.fnbItems : [];
              const res = parsed.reservationDetails;

              return (
                <div className="space-y-4 text-xs">
                  {fnbList.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-on-surface uppercase tracking-wider text-[11px] text-outline">
                        Menu Minuman & Makanan:
                      </h4>
                      <div className="divide-y divide-outline-variant/20 bg-surface p-4 rounded-2xl border border-outline-variant/30">
                        {fnbList.map((item: any, idx: number) => (
                          <div key={idx} className="py-2 flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-on-surface">{item.name}</p>
                              <p className="text-[10px] text-outline">@ Rp {item.price.toLocaleString("id-ID")} x {item.quantity}</p>
                            </div>
                            <span className="font-bold text-on-surface">
                              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {res && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-on-surface uppercase tracking-wider text-[11px] text-outline">
                        Reservasi Meja / Ruang:
                      </h4>
                      <div className="p-4 rounded-2xl bg-secondary-container/20 border border-secondary-container/40 space-y-1">
                        <p className="font-bold text-secondary text-sm">{res.zoneName}</p>
                        <p className="text-on-surface-variant">
                          Jadwal: {res.date} ({res.timeSlot}) • {res.guestCount} Orang Tamu
                        </p>
                        {res.specialRequest && (
                          <p className="text-outline italic text-[11px]">
                            Permintaan khusus: &ldquo;{res.specialRequest}&rdquo;
                          </p>
                        )}
                        <p className="font-bold text-primary pt-1">
                          Deposit Komitmen: Rp {Number(res.downPayment).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {selectedOrderDetail.notes && (
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-xs">
                <span className="font-bold text-on-surface block mb-1">Catatan Tambahan Pelanggan:</span>
                <p className="text-on-surface-variant italic">&ldquo;{selectedOrderDetail.notes}&rdquo;</p>
              </div>
            )}

            {/* Bukti Transfer */}
            {selectedOrderDetail.payment_proof_path && (
              <div className="space-y-2">
                <span className="font-bold text-xs text-on-surface block">Bukti Transfer Pelanggan:</span>
                <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-outline-variant/60 bg-surface-container">
                  <Image
                    src={selectedOrderDetail.payment_proof_path}
                    alt="Bukti Transfer"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Total Pembayaran & Status */}
            <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline block">Total Tagihan QRIS:</span>
                <span className="text-xl font-extrabold text-primary">
                  Rp {Number(selectedOrderDetail.total_amount).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedOrderDetail.status === "menunggu_konfirmasi" && (
                  <>
                    <button
                      type="button"
                      disabled={statusUpdatingId === selectedOrderDetail.id}
                      onClick={() => handleUpdateOrderStatus(selectedOrderDetail.id, "dikonfirmasi")}
                      className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>Konfirmasi Pembayaran</span>
                    </button>
                    <button
                      type="button"
                      disabled={statusUpdatingId === selectedOrderDetail.id}
                      onClick={() => {
                        setRejectingOrder(selectedOrderDetail);
                        setRejectionReason("");
                      }}
                      className="px-3.5 py-2 rounded-full border border-red-300 text-red-700 hover:bg-red-50 font-semibold text-xs"
                    >
                      Tolak
                    </button>
                  </>
                )}

                {selectedOrderDetail.status === "dikonfirmasi" && (
                  <button
                    type="button"
                    disabled={statusUpdatingId === selectedOrderDetail.id}
                    onClick={() => handleUpdateOrderStatus(selectedOrderDetail.id, "selesai")}
                    className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">done_all</span>
                    <span>Selesaikan Pesanan</span>
                  </button>
                )}

                <a
                  href={getWhatsAppLink(selectedOrderDetail)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  <span>WhatsApp Pelanggan</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Rejection Reason Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl border border-outline-variant/50 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-600">
              <span className="material-symbols-outlined text-xl">cancel</span>
              <h4 className="text-base font-bold">Tolak Tiket #{rejectingOrder.order_code}</h4>
            </div>

            <p className="text-xs text-on-surface-variant">
              Masukkan alasan penolakan agar pelanggan dapat melihat penjelasannya di halaman &ldquo;Pesanan Anda&rdquo;:
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Contoh: Bukti transfer tidak terbaca / nominal tidak sesuai / slot meja telah terisi penuh."
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/60 text-xs focus:ring-2 focus:ring-primary outline-none resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 rounded-full border border-outline-variant/60 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUpdateOrderStatus(
                    rejectingOrder.id,
                    "ditolak",
                    rejectionReason || "Pesanan tidak dapat diproses."
                  )
                }
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Tolak Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

