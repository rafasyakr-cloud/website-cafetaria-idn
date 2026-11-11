import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string[] | string;
  is_system: boolean;
  created_at: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface NewsRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "draft" | "published";
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderRecord {
  id: string;
  order_code: string;
  user_id: string;
  customer_name: string;
  whatsapp: string;
  order_type: string;
  items_json: string;
  total_amount: number;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "ditolak" | "selesai";
  payment_proof_path?: string;
  notes?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET;

// Path penyimpanan database lokal
const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Default hash bcrypt untuk "123456"
const DEFAULT_ADMIN_PASSWORD_HASH =
  "$2a$10$HQ5uheMv3PCWj6bExokFm.5edgTQZI5byn9fNxFJhKXpYeMQXqIRO";

function getInitialData() {
  const now = new Date().toISOString();
  return {
    Roles: [
      {
        id: "role-admin",
        name: "admin",
        description: "Administrator sistem dengan akses penuh ke dashboard, user, dan konten.",
        permissions: ["users.manage", "roles.manage", "news.manage", "orders.manage", "settings.manage"],
        is_system: true,
        created_at: now,
      },
      {
        id: "role-user",
        name: "user",
        description: "Pengguna terdaftar pelanggan Cafetaria IDN.",
        permissions: ["orders.create", "orders.view_own", "profile.edit"],
        is_system: true,
        created_at: now,
      },
    ],
    Users: [
      {
        id: "user-admin-default",
        name: "Administrator Cafetaria IDN",
        email: "admin@gmail.com",
        password_hash: DEFAULT_ADMIN_PASSWORD_HASH,
        role_id: "role-admin",
        status: "active",
        created_at: now,
        updated_at: now,
      },
    ],
    News: [
      {
        id: "news-1",
        title: "Rahasia Menyeduh Pour Over V60 Sempurna di Rumah Menggunakan Biji Gayo",
        slug: "rahasia-menyeduh-pour-over-v60-biji-gayo",
        excerpt:
          "Memahami rasio seduhan 1:15, suhu air ideal 92°C, dan teknik pouring bertahap agar nada rasa rempah serta dark chocolate dari biji Gayo terekstrak maksimal.",
        content:
          "Pour Over V60 adalah salah satu metode manual brew paling populer di kalangan pecinta kopi specialty dunia. Kunci dari seduhan yang seimbang terletak pada tiga faktor utama: ukuran gilingan (medium-fine), rasio seduh (1 gram kopi untuk 15 gram air), dan suhu air yang stabil di 92-94 derajat Celcius. Pada biji Gayo proses washed, blooming selama 45 detik dengan 40ml air pertama akan melepas gas karbondioksida alami, memungkinkan aroma teh hitam dan jeruk bergamot terekstraksi bersih tanpa rasa pahit berlebih.",
        thumbnail_path: "/images/menu/v60-gayo.jpg",
        status: "published",
        author_id: "user-admin-default",
        created_at: now,
        updated_at: now,
      },
      {
        id: "news-2",
        title: "Program Kemitraan Adil: Mendukung Masa Depan Petani Kopi di Dataran Kintamani",
        slug: "program-kemitraan-adil-petani-kintamani",
        excerpt:
          "Bagaimana skema direct-purchase premium kami memberikan dampak nyata bagi peremajaan kebun, fasilitas pengolahan pascapanen, dan kesejahteraan keluarga petani.",
        content:
          "Melalui program kemitraan langsung (direct trade) yang diprakarsai oleh Raffasya sejak 2021, Cafetaria IDN membeli biji kopi specialty grade langsung dari kelompok tani di Kintamani dengan harga 30% di atas harga pasar komersial. Dampak nyata dari program ini mencakup pembangunan greenhouse penjemuran terpal higienis serta pendampingan uji skor cupping berkala.",
        thumbnail_path: "/images/menu/bali-kintamani.jpg",
        status: "published",
        author_id: "user-admin-default",
        created_at: now,
        updated_at: now,
      },
      {
        id: "news-3",
        title: "Koleksi Pastry Segar: Eksplorasi Croissant Pandan & Sourdough Artisan",
        slug: "koleksi-pastry-musim-dingin-croissant-pandan",
        excerpt:
          "Perpaduan keahlian lamination Prancis klasik dengan esensi aroma daun pandan Suji asli dan fermentasi lambat ragi liar untuk sarapan yang menghangatkan hati.",
        content:
          "Setiap pukul 06.00 pagi, dapur bakery Cafetaria IDN mulai memanggang viennoiserie segar menggunakan French butter grade A. Truffle Klepon Croissant kami menjadi menu signature berkat kombinasi lapisan kulit luar yang renyah berongga dan isian unti kelapa gula aren pandan wangi yang meleleh lembut di mulut.",
        thumbnail_path: "/images/menu/klepon-croissant.jpg",
        status: "published",
        author_id: "user-admin-default",
        created_at: now,
        updated_at: now,
      },
    ],
    Orders: [],
  };
}

function readLocalDb(): Record<string, any[]> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Gagal membaca database lokal:", err);
    return getInitialData();
  }
}

function writeLocalDb(data: Record<string, any[]>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Gagal menulis database lokal:", err);
  }
}

function hasValidAppsScriptConfig(): boolean {
  if (!APPS_SCRIPT_URL || !APPS_SCRIPT_SECRET) return false;
  const trimmed = APPS_SCRIPT_URL.trim();
  if (trimmed.includes("...") || trimmed.includes("AKfycbx") || !trimmed.startsWith("https://script.google.com/")) {
    return false;
  }
  return true;
}

// Remote Google Apps Script Caller
async function callAppsScript(payload: any) {
  if (!hasValidAppsScriptConfig()) {
    throw new Error("APPS_SCRIPT_URL belum disetel dengan URL yang valid.");
  }
  const response = await fetch(APPS_SCRIPT_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: APPS_SCRIPT_SECRET,
      ...payload,
    }),
  });

  const resJson = await response.json();
  if (!resJson.success) {
    throw new Error(resJson.error || "Gagal memanggil Apps Script Web App.");
  }
  return resJson.data;
}

export const db = {
  async list<T = any>(table: string): Promise<T[]> {
    if (hasValidAppsScriptConfig()) {
      try {
        return await callAppsScript({ action: "list", table });
      } catch (err) {
        console.warn("Koneksi Apps Script gagal, beralih ke penyimpanan lokal:", err);
      }
    }
    const local = readLocalDb();
    return (local[table] || []) as T[];
  },

  async find<T = any>(table: string, query: Record<string, any>): Promise<T[]> {
    if (hasValidAppsScriptConfig()) {
      try {
        return await callAppsScript({ action: "find", table, query });
      } catch (err) {
        console.warn("Koneksi Apps Script gagal, beralih ke penyimpanan lokal:", err);
      }
    }
    const local = readLocalDb();
    const rows = (local[table] || []) as any[];
    return rows.filter((row) => {
      for (const key in query) {
        if (String(row[key]) !== String(query[key])) {
          return false;
        }
      }
      return true;
    }) as T[];
  },

  async get<T = any>(table: string, id: string): Promise<T | null> {
    const results = await this.find<T>(table, { id });
    return results.length > 0 ? results[0] : null;
  },

  async insert<T = any>(table: string, item: any): Promise<T> {
    const id = item.id || `${table.toLowerCase()}-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const record = {
      ...item,
      id,
      created_at: item.created_at || now,
      updated_at: item.updated_at || now,
    };

    if (hasValidAppsScriptConfig()) {
      try {
        return await callAppsScript({ action: "insert", table, data: record });
      } catch (err) {
        console.warn("Koneksi Apps Script gagal, beralih ke penyimpanan lokal:", err);
      }
    }

    const local = readLocalDb();
    if (!local[table]) local[table] = [];
    local[table].push(record);
    writeLocalDb(local);
    return record as T;
  },

  async update<T = any>(table: string, id: string, updates: any): Promise<T | null> {
    if (hasValidAppsScriptConfig()) {
      try {
        return await callAppsScript({ action: "update", table, id, data: updates });
      } catch (err) {
        console.warn("Koneksi Apps Script gagal, beralih ke penyimpanan lokal:", err);
      }
    }

    const local = readLocalDb();
    if (!local[table]) return null;
    const index = local[table].findIndex((item: any) => String(item.id) === String(id));
    if (index === -1) return null;

    const updated = {
      ...local[table][index],
      ...updates,
      id, // Preserve ID
      created_at: local[table][index].created_at, // Preserve creation timestamp
      updated_at: new Date().toISOString(),
    };
    local[table][index] = updated;
    writeLocalDb(local);
    return updated as T;
  },

  async delete(table: string, id: string): Promise<boolean> {
    if (hasValidAppsScriptConfig()) {
      try {
        await callAppsScript({ action: "delete", table, id });
        return true;
      } catch (err) {
        console.warn("Koneksi Apps Script gagal, beralih ke penyimpanan lokal:", err);
      }
    }

    const local = readLocalDb();
    if (!local[table]) return false;
    const initialLen = local[table].length;
    local[table] = local[table].filter((item: any) => String(item.id) !== String(id));
    writeLocalDb(local);
    return local[table].length < initialLen;
  },
};

