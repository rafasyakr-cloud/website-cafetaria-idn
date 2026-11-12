export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
}

export interface ArticleItem {
  id: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: "signature" | "manual-brew" | "espresso" | "pastry" | "makanan" | "bundling";
  price: number;
  formattedPrice: string;
  description: string;
  tastingNotes: string[];
  badge?: string;
  isBestSeller?: boolean;
  image: string;
}

export interface SpaceItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  capacity: string;
  atmosphere: string;
  features: string[];
  image: string;
  badge: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  category: string;
  owner: {
    name: string;
    title: string;
    quote: string;
  };
  logo: {
    text: string;
    imagePath?: string;
  };
  contact: {
    address: string;
    branchName: string;
    phone: string;
    whatsapp: string;
    whatsappFormatted: string;
    email: string;
    corporateEmail: string;
    operatingHours: string;
    mapsLink: string;
    mapsEmbedUrl: string;
  };
  navItems: NavItem[];
  services: ServiceItem[];
  menuCategories: { id: string; label: string }[];
  menuItems: MenuItem[];
  spaces: SpaceItem[];
  articles: ArticleItem[];
  stats: {
    rating: string;
    reviewsCount: string;
    branchesCount: string;
    branchesList: string;
  };
  social: {
    instagram: string;
    tiktok: string;
    youtube: string;
    linkedin: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "IDN Cafetaria",
  tagline: "Menghadirkan Seni Kopi Nusantara & Kenyamanan Ruang Terbaik",
  description:
    "Perusahaan cafe shop modern yang didirikan oleh Raffasya, menyediakan tempat aesthetic, elegan, profesional, dan ramah Gen Z. Menghadirkan biji kopi pilihan petani nusantara dengan kenyamanan ruang kerja dan bersantai.",
  category: "Cafe Shop & Artisan Roastery",
  owner: {
    name: "Raffasya",
    title: "Founder & Pemilik Cafetaria IDN",
    quote:
      "Kopi bukan sekadar minuman penghalau kantuk, melainkan medium penghubung jiwa para petani dengan para pencipta gagasan yang duduk di meja kami.",
  },
  logo: {
    text: "CAFETARIA IDN",
    imagePath: "/images/logo.png",
  },
  contact: {
    branchName: "Gerai Flagship Senopati",
    address: "Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan, 12190",
    phone: "+62 878-6408-1772",
    whatsapp: "+6287864081772",
    whatsappFormatted: "+62 878-6408-1772",
    email: "hello@cafetariaidn.com",
    corporateEmail: "corporate@cafetariaidn.com",
    operatingHours: "Senin – Minggu: 07.00 – 22.00 WIB",
    mapsLink: "https://maps.app.goo.gl/u6UETqg1WQm4dqPY9",
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2415715873236!2d106.80499!3d-6.23188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1505c066919%3A0x6b1429813be6a72e!2sJl.%20Senopati%2C%20Kby.%20Baru%2C%20Kota%20Jakarta%20Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
  },
  stats: {
    rating: "4.9 / 5",
    reviewsCount: "10.000+ Pecinta Kopi di Jakarta",
    branchesCount: "3 Gerai Utama",
    branchesList: "Senopati • Menteng • BSD City",
  },
  navItems: [
    { label: "Home", href: "/#home" },
    { label: "Menu & Kuliner", href: "/menu" },
    { label: "Suasana & Tempat", href: "/tempat" },
    { label: "Tentang Kami", href: "/#tentang-kami" },
    { label: "Layanan", href: "/#layanan" },
    { label: "Berita & Cerita", href: "/#berita" },
    { label: "Hubungi Kami", href: "/#kontak" },
  ],
  services: [
    {
      id: "dine-in",
      icon: "restaurant",
      title: "Dine-in & Artisan Cafe",
      description:
        "Nikmati seduhan manual brew V60, Japanese drip, espresso-based murni, signature botanical mocktails, dan aneka menu brunch lezat di gerai kami yang nyaman dan estetik.",
      badge: "Buka Setiap Hari",
    },
    {
      id: "catering",
      icon: "room_service",
      title: "Corporate & Event Catering",
      description:
        "Paket coffee break premium, lunch box artisanal bernutrisi, dan mobile espresso bar lengkap dengan barista untuk seminar, pameran, maupun resepsi istimewa.",
      badge: "Kapasitas 20 – 500 Pax",
    },
    {
      id: "space-rental",
      icon: "meeting_room",
      title: "Sewa Ruang & Private Event",
      description:
        "Tempat private meeting, workshop komunitas kreatif, peluncuran produk, atau gathering keluarga hangat dengan fasilitas proyektor 4K & sound system profesional.",
      badge: "Hourly & Full Day",
    },
    {
      id: "wholesale",
      icon: "inventory_2",
      title: "Coffee Beans Wholesale & Roasting",
      description:
        "Suplai biji kopi roasted beans untuk cafe partner, Horeca, perkantoran, dan langganan eceran. Layanan custom blend dan roast profile sesuai selera brand Anda.",
      badge: "Pilihan 1kg & Grosir",
    },
  ],
  menuCategories: [
    { id: "all", label: "Semua Menu" },
    { id: "signature", label: "Kopi Signature" },
    { id: "manual-brew", label: "Manual Brew Single Origin" },
    { id: "espresso", label: "Espresso & Latte" },
    { id: "pastry", label: "Artisan Bakery & Pastry" },
    { id: "makanan", label: "Main Course Nusantara" },
    { id: "bundling", label: "Paket Combo & WFC" },
  ],
  menuItems: [
    {
      id: "menu-1",
      name: "Es Kopi Susu Aren Gayo",
      category: "signature",
      price: 38000,
      formattedPrice: "Rp 38.000",
      description:
        "Double shot espresso Arabika Gayo Takengon, susu segar murni peternakan lokal, dan karamelisasi gula aren organik asli Singkawang.",
      tastingNotes: ["Dark Chocolate", "Brown Sugar", "Floral Hint"],
      badge: "Chef's Choice",
      isBestSeller: true,
      image: "/images/menu/es-kopi-aren.jpg",
    },
    {
      id: "menu-2",
      name: "Truffle Klepon Croissant",
      category: "pastry",
      price: 42000,
      formattedPrice: "Rp 42.000",
      description:
        "Pastry mentega Prancis Normandy 82% yang renyah dengan isian lelehan unti kelapa pandan suji, hint white truffle oil, & taburan kelapa parut sangrai.",
      tastingNotes: ["Buttery & Flaky", "Pandan Wangi", "Mild Truffle"],
      badge: "Freshly Baked",
      isBestSeller: true,
      image: "/images/menu/klepon-croissant.jpg",
    },
    {
      id: "menu-3",
      name: "Nasi Goreng Kecombrang Wagyu",
      category: "makanan",
      price: 78000,
      formattedPrice: "Rp 78.000",
      description:
        "Beras organik dimasak wok dengan irisan bunga kecombrang wangi, potongan daging Wagyu MB5 juicy, telur mata sapi renyah, dan kerupuk emping.",
      tastingNotes: ["Smoky Umami", "Citrus Floral", "Pedas Gurih"],
      badge: "Chef's Signature",
      isBestSeller: true,
      image: "/images/menu/nasgor-wagyu.jpg",
    },
    {
      id: "menu-4",
      name: "V60 Gayo Wine Fermentation",
      category: "manual-brew",
      price: 45000,
      formattedPrice: "Rp 45.000",
      description:
        "Metode seduh manual V60. Biji kopi fermentasi anaerobik Aceh Takengon dengan aroma anggur alami dan keasaman manis buah tropis yang bersih.",
      tastingNotes: ["Black Grape", "Dried Raisin", "Clean Acidity"],
      badge: "Single Origin",
      image: "/images/menu/v60-gayo.jpg",
    },
    {
      id: "menu-5",
      name: "Bali Kintamani Citrus Honey",
      category: "manual-brew",
      price: 42000,
      formattedPrice: "Rp 42.000",
      description:
        "Proses Honey alami dari dataran tinggi Ulian Kintamani. Cita rasa cerah jeruk mandarin berpadu manisnya madu hutan pegunungan.",
      tastingNotes: ["Orange Blossom", "Forest Honey", "Light Body"],
      badge: "Kalita Wave",
      image: "/images/menu/bali-kintamani.jpg",
    },
    {
      id: "menu-6",
      name: "Cafetaria Flat White",
      category: "espresso",
      price: 36000,
      formattedPrice: "Rp 36.000",
      description:
        "Double ristretto dari house blend Flores Bajawa & Toraja Sapan, dipadu micro-foam susu lembut velvety yang seimbang dan nikmat.",
      tastingNotes: ["Toasted Hazelnut", "Caramelized", "Velvety"],
      badge: "House Favorite",
      image: "/images/menu/flat-white.jpg",
    },
    {
      id: "menu-7",
      name: "Iced Spanish Aren Latte",
      category: "espresso",
      price: 39000,
      formattedPrice: "Rp 39.000",
      description:
        "Perpaduan creamy condensed milk, rempah kayu manis Kerinci, gula aren bakar, dan espresso pekat Flores dengan foam susu dingin.",
      tastingNotes: ["Sweet Cinnamon", "Milky Cream", "Rich Coffee"],
      badge: "Customer Fav",
      image: "/images/menu/spanish-latte.jpg",
    },
    {
      id: "menu-8",
      name: "Artisan Almond Croissant",
      category: "pastry",
      price: 42000,
      formattedPrice: "Rp 42.000",
      description:
        "Lapisan butter renyah dengan isian frangipane almond cream lembut, taburan irisan almond panggang, dan taburan gula salju.",
      tastingNotes: ["French Butter", "Nutty Fragrant", "Golden Crisp"],
      badge: "Fresh Oven",
      image: "/images/menu/almond-croissant.jpg",
    },
    {
      id: "menu-9",
      name: "Nasi Campur Bali Sukawati",
      category: "makanan",
      price: 68000,
      formattedPrice: "Rp 68.000",
      description:
        "Nasi kuning rempah kunyit wangi, ayam betutu suwir bumbu genep, sate lilit tuna serai, urap lawar kacang panjang, dan sambal matah kecombrang segar.",
      tastingNotes: ["Rempah Tradisional", "Sambal Matah", "Sate Lilit"],
      badge: "Authentic Bali",
      image: "/images/menu/nasi-campur.jpg",
    },
    {
      id: "menu-10",
      name: "Toraja Sapan Honey Aeropress",
      category: "manual-brew",
      price: 48000,
      formattedPrice: "Rp 48.000",
      description:
        "Metode Aeropress ekstraksi tebal dengan spektrum rasa plum merah matang, gula merah Jawa, dan aroma rempah cengkeh yang menghangatkan.",
      tastingNotes: ["Red Plum", "Javanese Palm", "Syrupy Body"],
      badge: "Aeropress",
      image: "/images/menu/toraja-aeropress.jpg",
    },
    {
      id: "menu-11",
      name: "Paket Morning Productivity Boost",
      category: "bundling",
      price: 65000,
      formattedPrice: "Rp 65.000",
      description:
        "Kombinasi sarapan favorit WFC: 1 Hot Flat White / Americano + 1 Fresh Butter Croissant / Pain au Chocolat pilihan barista.",
      tastingNotes: ["Coffee + Pastry", "Hemat 20%", "Energy Booster"],
      badge: "Pagi Hemat (07.00 - 11.00)",
      isBestSeller: true,
      image: "/images/menu/morning-bundle.jpg",
    },
  ],
  spaces: [
    {
      id: "space-1",
      name: "Roastery Sanctuary & Bar Utama",
      tagline: "Pusat Ritual Seduh Artisan & Interaksi Kopi",
      description:
        "Area indoor utama dengan langit-langit kayu tinggi bernuansa modern minimalis, konter bar terrazzo elegan, dan display biji kopi sangrai nusantara. Cocok untuk menikmati secangkir kopi segar sambil berbincang hangat.",
      capacity: "Kapasitas 45 Kursi",
      atmosphere: "Hangat, Elegan, Aromatik",
      features: [
        "Interactive Slow Bar",
        "Pencahayaan Alami & Warm Ambient",
        "Barista Direct Storytelling",
        "Full AC & Bebas Asap Rokok",
      ],
      image: "/images/hero-interior.png",
      badge: "Spot Favorit",
    },
    {
      id: "space-2",
      name: "Productive WFC Lounge",
      tagline: "Dirancang Ergonomis untuk Kreator & Gen Z",
      description:
        "Area hening yang didedikasikan bagi Anda yang ingin bekerja santai (WFC), meeting online, atau menyelesaikan tugas. Setiap meja dilengkapi colokan listrik independen dan pencahayaan yang ramah mata.",
      capacity: "Kapasitas 35 Kursi",
      atmosphere: "Tenang, Kondusif, Fokus",
      features: [
        "Wi-Fi Serat Optik 200 Mbps",
        "Colokan Listrik di Setiap Meja",
        "Kursi Ergonomis Busa Nyaman",
        "Zona Akustik Hening (Low Noise)",
      ],
      image: "/images/spaces/space-wfc.jpg",
      badge: "WFC-Ready",
    },
    {
      id: "space-3",
      name: "Glasshouse & Tropical Garden",
      tagline: "Keasrian Alami di Tengah Dinamika Kota",
      description:
        "Ruang semi-outdoor dengan dinding kaca transparan bermandikan sinar matahari alami dan tanaman tropis rimbun. Tempat yang sangat estetik untuk foto konten media sosial, nongkrong sore, atau santai akhir pekan.",
      capacity: "Kapasitas 30 Kursi",
      atmosphere: "Segar, Asri, Instagrammable",
      features: [
        "Ventilasi Alami & Sirkulasi Sejuk",
        "Pencahayaan Alami Estetik",
        "Smoking Area Ramah & Terpisah",
        "Pet-Friendly di Area Taman",
      ],
      image: "/images/barista-pour.png",
      badge: "Outdoor Asri",
    },
    {
      id: "space-4",
      name: "Private Mezzanine & Meeting Studio",
      tagline: "Ruang Eksklusif untuk Rapat, Presentasi & Workshop",
      description:
        "Lantai mezzanine privat ber-AC dengan proyektor 4K ultra-bright, sound system wireless, whiteboard, serta layanan custom coffee break & snack box untuk tim Anda.",
      capacity: "Kapasitas 15 - 35 Orang",
      atmosphere: "Privat, Profesional, Eksklusif",
      features: [
        "Smart Screen 4K & Sound System",
        "Whiteboard & Peralatan Presentasi",
        "Pintu Kedap Suara & Partisi Fleksibel",
        "Paket Katering Khusus Korporat",
      ],
      image: "/images/spaces/space-mezzanine.jpg",
      badge: "Bisa Dipesan",
    },
  ],
  articles: [
    {
      id: "1",
      slug: "rahasia-menyeduh-pour-over-v60-biji-gayo",
      category: "Kopi & Budaya",
      date: "18 Oktober 2024",
      readTime: "4 mnt baca",
      title: "Rahasia Menyeduh Pour Over V60 Sempurna di Rumah Menggunakan Biji Gayo",
      excerpt:
        "Memahami rasio seduhan 1:15, suhu air ideal 92°C, dan teknik pouring bertahap agar nada rasa rempah serta dark chocolate dari biji Gayo terekstrak maksimal.",
      image: "/images/article-1.webp",
    },
    {
      id: "2",
      slug: "program-kemitraan-adil-petani-kintamani",
      category: "Sustainability",
      date: "05 November 2024",
      readTime: "6 mnt baca",
      title: "Program Kemitraan Adil: Mendukung Masa Depan Petani Kopi di Dataran Kintamani",
      excerpt:
        "Bagaimana skema direct-purchase premium kami memberikan dampak nyata bagi peremajaan kebun, fasilitas pengolahan pascapanen, dan kesejahteraan keluarga petani.",
      image: "/images/article-2.webp",
    },
    {
      id: "3",
      slug: "koleksi-pastry-musim-dingin-croissant-pandan",
      category: "Kuliner",
      date: "12 Desember 2024",
      readTime: "3 mnt baca",
      title: "Koleksi Pastry Segar: Eksplorasi Croissant Pandan & Sourdough Artisan",
      excerpt:
        "Perpaduan keahlian lamination Prancis klasik dengan esensi aroma daun pandan Suji asli dan fermentasi lambat ragi liar untuk sarapan yang menghangatkan hati.",
      image: "/images/article-3.webp",
    },
  ],
  social: {
    instagram: "https://instagram.com/cafetariaidn",
    tiktok: "https://tiktok.com/@cafetariaidn",
    youtube: "https://youtube.com/@cafetariaidn",
    linkedin: "https://linkedin.com/company/cafetariaidn",
  },
};
