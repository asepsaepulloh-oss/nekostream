# 🐾 NekoStream — Modern Neumorphism Anime Streaming

NekoStream adalah aplikasi website streaming anime modern berdesain **Neumorphism / Soft UI** yang terintegrasi langsung dengan live REST API streaming anime. Dibangun menggunakan Next.js App Router, TypeScript, Tailwind CSS, dan HLS.js.

![NekoStream Preview](https://s4.anilist.co/file/anilistcdn/media/anime/banner/185874-IdGyh1EBG91I.jpg)

---

## ✨ Fitur Utama

- **🎨 Neumorphic Design System (Soft UI)**: Efek timbul dan cekung elegan dengan dual-tone shadows, tactile buttons, dan dark/light mode toggle.
- **🚀 Live Anime REST API Integration**: Terhubung ke endpoint live `https://api.louiv.me/api` untuk spotlight, trending, top airing, ranking, jadwal rilis, dan metadata anime.
- **🎬 Cinematic Video Player**:
  - Dukungan streaming HLS (`.m3u8`) via **HLS.js**.
  - Fallback aman ke embed player responsif jika direct HLS dibatasi sumber.
  - Multi-server switcher (HD-1, HD-2, Vidstream, dll).
  - Pilihan subtitle (**SUB**) dan dubbing (**DUB**).
- **🔍 Real-time Search & Autocomplete**: Pencarian cepat dengan dropdown saran dan pagination.
- **🎯 Explore & Advanced Filter**: Filter berdasarkan Genre (Action, Romance, Isekai, dll), Tipe (TV, Movie, OVA), dan Status penayangan.
- **📅 Release Schedule**: Jadwal tayang episode anime berdasarkan tanggal harian.
- **🔀 Surprise Me / Random Anime**: Jelajahi anime secara acak dengan satu klik.
- **📚 LocalStorage Persistence**: Riwayat tontonan (*Watch History*) dan daftar simpan (*My List*) tersimpan aman di browser tanpa perlu registrasi akun.
- **📱 Fully Responsive**: Tampilan adaptif untuk desktop, tablet, dan handphone (dengan bottom navigation & mobile drawer).

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Streaming**: [HLS.js](https://github.com/video-dev/hls.js/)

---

## 🚀 Memulai (Local Development)

### 1. Clone Repository

```bash
git clone https://github.com/asepsaepulloh-oss/nekostream.git
cd nekostream
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Salin `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Isi default:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.louiv.me/api
NEXT_PUBLIC_SITE_NAME=NekoStream
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📦 Build Production & Deployment (Vercel)

Project ini siap langsung di-deploy ke **Vercel** dalam 1 klik:

1. Push project ke GitHub Anda.
2. Buka dashboard [Vercel](https://vercel.com) dan pilih **Add New Project**.
3. Import repository **nekostream**.
4. Masukkan Environment Variable:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://api.louiv.me/api`
5. Klik **Deploy**!

Untuk build manual:
```bash
npm run build
npm start
```

---

## 📄 Lisensi

MIT License © 2026 [Asep Saepulloh](https://github.com/asepsaepulloh-oss)
