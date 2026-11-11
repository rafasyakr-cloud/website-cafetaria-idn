import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface SaveFileResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export async function saveFile(file: File): Promise<SaveFileResult> {
  try {
    // 1. Validasi Tipe File
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Format file tidak didukung. Harap unggah gambar JPG, PNG, atau WEBP.",
      };
    }

    // 2. Validasi Ukuran File
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: "Ukuran file terlalu besar. Maksimal 5 MB.",
      };
    }

    // 3. Buat Folder Jika Belum Ada
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // 4. Buat Nama File Unik dan Aman
    const fileExt = path.extname(file.name).toLowerCase() || ".jpg";
    const uniqueName = `upload-${Date.now()}-${crypto.randomBytes(6).toString("hex")}${fileExt}`;
    const destination = path.join(UPLOAD_DIR, uniqueName);

    // 5. Simpan Buffer File
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(destination, buffer);

    const publicPath = `/uploads/${uniqueName}`;
    return {
      success: true,
      filePath: publicPath,
    };
  } catch (error: any) {
    console.error("Gagal menyimpan file upload:", error);
    return {
      success: false,
      error: error.message || "Terjadi kesalahan saat menyimpan media.",
    };
  }
}

export async function deleteFile(publicPath: string): Promise<boolean> {
  try {
    if (!publicPath || !publicPath.startsWith("/uploads/")) {
      return false;
    }
    const filename = path.basename(publicPath);
    const fullPath = path.join(UPLOAD_DIR, filename);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Gagal menghapus file:", error);
    return false;
  }
}

