/**
 * ============================================================================
 * FILE 5: app.js
 * Aplikasi Manajemen Sekolah Digital Multi-Role (Standalone Tanpa Build)
 * Mendukung 6 Peran: Admin, Guru, Siswa, Tenaga Pendidik, Orang Tua, Mitra
 * ============================================================================
 */

(function () {
  // --- DAFTAR PERAN & PENGGUNA DEMO ---
  const ROLE_NAMES = {
    admin: 'Administrator',
    siswa: 'Siswa',
    guru: 'Guru',
    tendik: 'Tenaga Pendidik',
    ortu: 'Orang Tua Siswa',
    mitra: 'Mitra Kantin'
  };

  const DEMO_USERS = [
    { id: 'ADM-001', name: 'Budi Santoso', role: 'admin', nisn: '19850101' },
    { id: 'SSW-2023001', name: 'Siti Aminah', role: 'siswa', nisn: '100101', class: 'Kelas 10A' },
    { id: 'GRU-1001', name: 'Ahmad Dahlan, S.Pd', role: 'guru', nisn: '19790412' },
    { id: 'TNK-005', name: 'Rina Wijaya', role: 'tendik', nisn: '19900215' },
    { id: 'ORT-992', name: 'Herman Sutanto', role: 'ortu', nisn: '32010188' },
    { id: 'MTR-128', name: 'Kantin Berkah Sehat', role: 'mitra', nisn: '88001122' }
  ];

  // --- KONFIGURASI MENU MULTI-ROLE & SKEMA DATABASE SPREADSHEET ---
  const MENU_CONFIG = [
    // MENU ADMIN - LAPORAN & DATA
    { id: 'Laporan Pembayaran', label: 'Laporan Pembayaran', desc: 'Data pembayaran SPP & tagihan siswa', icon: 'wallet', bg: 'bg-blue-500', roles: ['admin'], category: 'Menu Admin', span: 'col-span-2', storageKey: 'sd_pembayaran_list', fields: [
      { name: 'kode', label: 'Kode Transaksi', type: 'text', required: true },
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'namaSiswa', label: 'Nama Siswa', type: 'text', required: true },
      { name: 'kelas', label: 'Kelas', type: 'text' },
      { name: 'jenis', label: 'Jenis Pembayaran', type: 'select', options: ['SPP', 'Uang Gedung', 'Seragam', 'Buku', 'Daftar Ulang'] },
      { name: 'nominalDibayar', label: 'Nominal Dibayar (Rp)', type: 'number', required: true },
      { name: 'metode', label: 'Metode', type: 'select', options: ['Cash', 'Transfer', 'Cicil'] },
      { name: 'status', label: 'Status', type: 'select', options: ['Lunas', 'Belum Lunas'] }
    ]},
    { id: 'Laporan Pemasukan', label: 'Laporan Pemasukan', desc: 'Data pemasukan keuangan sekolah', icon: 'trending-up', bg: 'bg-emerald-500', roles: ['admin'], category: 'Menu Admin', tall: true, storageKey: 'sd_pemasukan_list', fields: [
      { name: 'kode', label: 'Kode Pemasukan', type: 'text', required: true },
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'jenis', label: 'Kategori', type: 'select', options: ['Pemasukan Rutin', 'Dana BOS', 'Pemasukan Lainnya', 'Toko Sekolah'] },
      { name: 'nama', label: 'Sumber Pemasukan', type: 'text', required: true },
      { name: 'nominal', label: 'Nominal (Rp)', type: 'number', required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'text' },
      { name: 'filePreview', label: 'Foto Bukti (Tersimpan ke Drive)', type: 'file' }
    ]},
    { id: 'Laporan Pengeluaran', label: 'Laporan Pengeluaran', desc: 'Detail biaya operasional', icon: 'trending-down', bg: 'bg-rose-500', roles: ['admin'], category: 'Menu Admin', storageKey: 'sd_pengeluaran_list', fields: [
      { name: 'kode', label: 'Kode Pengeluaran', type: 'text', required: true },
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'jenis', label: 'Kategori', type: 'select', options: ['Pengeluaran Rutin', 'Pemeliharaan', 'Pengeluaran Lainnya'] },
      { name: 'nama', label: 'Tujuan Pengeluaran', type: 'text', required: true },
      { name: 'nominal', label: 'Nominal (Rp)', type: 'number', required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'text' },
      { name: 'filePreview', label: 'Nota/Bukti (Tersimpan ke Drive)', type: 'file' }
    ]},
    { id: 'Laporan Top Up Koin', label: 'Top Up Koin', desc: 'Saldo koin digital warga sekolah', icon: 'coins', bg: 'bg-amber-500', roles: ['admin'], category: 'Menu Admin', storageKey: 'sd_topup_koin_list', fields: [
      { name: 'kode', label: 'Kode Top Up', type: 'text', required: true },
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'namaAkun', label: 'Nama Pengguna', type: 'text', required: true },
      { name: 'nominal', label: 'Nominal Top Up (Rp)', type: 'number', required: true }
    ]},
    { id: 'Laporan Kehadiran', label: 'Laporan Kehadiran', desc: 'Rekap statistik absensi semua role', icon: 'calendar-check', bg: 'bg-teal-500', roles: ['admin'], category: 'Menu Admin', storageKey: 'sd_absensi_list', fields: [
      { name: 'userName', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'role', label: 'Peran', type: 'select', options: ['siswa', 'guru', 'tendik', 'mitra'] },
      { name: 'date', label: 'Tanggal', type: 'text', required: true },
      { name: 'time', label: 'Waktu', type: 'text', required: true },
      { name: 'type', label: 'Jenis Absen', type: 'select', options: ['Hadir', 'Pulang', 'Sakit', 'Izin', 'Buka', 'Tutup'] },
      { name: 'status', label: 'Status', type: 'select', options: ['Hadir Tepat Waktu', 'Terlambat', 'Disetujui', 'Menunggu'] },
      { name: 'photoUrl', label: 'Foto Selfie Absen (Drive)', type: 'file' }
    ]},
    { id: 'Data Sarana & Prasarana', label: 'Sarana & Prasarana', desc: 'Inventaris gedung & aset', icon: 'building-2', bg: 'bg-indigo-500', roles: ['admin'], category: 'Menu Admin', storageKey: 'sd_sarpras_list', fields: [
      { name: 'kode', label: 'Kode Barang', type: 'text', required: true },
      { name: 'nama', label: 'Nama Aset / Sarpras', type: 'text', required: true },
      { name: 'jenis', label: 'Kategori', type: 'select', options: ['Bangunan & Gedung', 'Peralatan Elektronik', 'Perabotan Ruangan', 'Buku & Referensi'] },
      { name: 'tanggal', label: 'Tanggal Pencatatan', type: 'date' },
      { name: 'keterangan', label: 'Kondisi / Lokasi', type: 'text' },
      { name: 'filePreview', label: 'Foto Aset (Drive)', type: 'file' }
    ]},
    { id: 'Data Arsip & Surat', label: 'Arsip & Surat', desc: 'Dokumen surat masuk & keluar', icon: 'file-text', bg: 'bg-slate-600', roles: ['admin'], category: 'Menu Admin', storageKey: 'sd_arsip_surat_list', fields: [
      { name: 'kodeArsip', label: 'Nomor / Kode Surat', type: 'text', required: true },
      { name: 'namaArsip', label: 'Perihal / Judul Surat', type: 'text', required: true },
      { name: 'jenisArsip', label: 'Kategori Surat', type: 'select', options: ['Surat Masuk', 'Surat Keluar', 'SK / Dokumen Resmi'] },
      { name: 'tanggalWaktu', label: 'Tanggal Surat', type: 'date' },
      { name: 'keterangan', label: 'Ringkasan Isi', type: 'text' },
      { name: 'filePreview', label: 'Scan Dokumen (Drive)', type: 'file' }
    ]},
    { id: 'Data Toko Sekolah', label: 'Toko Sekolah', desc: 'Produk koperasi & seragam', icon: 'store', bg: 'bg-pink-500', roles: ['admin'], category: 'Menu Admin', storageKey: 'sd_toko_produk_list', fields: [
      { name: 'kodeProduk', label: 'Kode Produk', type: 'text', required: true },
      { name: 'namaProduk', label: 'Nama Produk', type: 'text', required: true },
      { name: 'jenisProduk', label: 'Kategori', type: 'select', options: ['Alat Tulis', 'Buku', 'Pakaian', 'Atribut'] },
      { name: 'harga', label: 'Harga (Rp)', type: 'number', required: true },
      { name: 'stok', label: 'Stok Tersedia', type: 'number', required: true },
      { name: 'gambarProduk', label: 'Foto Produk (Drive)', type: 'file' }
    ]},
    { id: 'Data Kantin Sekolah', label: 'Kantin Sekolah', desc: 'Daftar menu makanan & minuman', icon: 'coffee', bg: 'bg-orange-500', roles: ['admin'], category: 'Menu Admin', storageKey: 'sd_mitra_produk_kantin_list', fields: [
      { name: 'kodeProduk', label: 'Kode Menu', type: 'text', required: true },
      { name: 'namaProduk', label: 'Nama Menu Kantin', type: 'text', required: true },
      { name: 'jenisProduk', label: 'Kategori', type: 'select', options: ['Makanan', 'Minuman', 'Snack'] },
      { name: 'harga', label: 'Harga (Rp)', type: 'number', required: true },
      { name: 'stok', label: 'Stok Porsi', type: 'number', required: true },
      { name: 'gambar', label: 'Foto Makanan (Drive)', type: 'file' }
    ]},
    { id: 'Data Pengumuman Sekolah', label: 'Pengumuman', desc: 'Papan informasi warga sekolah', icon: 'megaphone', bg: 'bg-sky-500', roles: ['admin'], category: 'Menu Admin', storageKey: 'sd_pengumuman_list', fields: [
      { name: 'kode', label: 'Kode Pengumuman', type: 'text', required: true },
      { name: 'nama', label: 'Judul Pengumuman', type: 'text', required: true },
      { name: 'jenis', label: 'Kategori', type: 'select', options: ['Pengumuman Resmi', 'Acara Sekolah', 'Libur Akademik'] },
      { name: 'tanggal', label: 'Tanggal Terbit', type: 'date' },
      { name: 'keterangan', label: 'Isi Pengumuman', type: 'text', required: true },
      { name: 'filePreview', label: 'Lampiran Banner (Drive)', type: 'file' }
    ]},

    // DATABASE USER (ADMIN)
    { id: 'Database Siswa', label: 'Database Siswa', desc: 'Data induk seluruh siswa', icon: 'users', bg: 'bg-blue-600', roles: ['admin'], category: 'Database User', storageKey: 'sd_db_siswa', fields: [
      { name: 'photoUrl', label: 'Foto Profil Siswa (Drive)', type: 'file' },
      { name: 'fullName', label: 'Nama Lengkap Siswa', type: 'text', required: true },
      { name: 'nisn', label: 'NIS / NISN', type: 'text', required: true },
      { name: 'class', label: 'Kelas', type: 'text', required: true },
      { name: 'homeroomTeacher', label: 'Nama Wali Kelas', type: 'text' },
      { name: 'phoneWA', label: 'Nomor WA', type: 'text' },
      { name: 'parentName', label: 'Nama Orang Tua', type: 'text' },
      { name: 'username', label: 'Username Login', type: 'text', required: true },
      { name: 'password', label: 'Password Login', type: 'text', required: true }
    ]},
    { id: 'Database Guru', label: 'Database Guru', desc: 'Data profil pendidik & wali kelas', icon: 'graduation-cap', bg: 'bg-emerald-600', roles: ['admin'], category: 'Database User', storageKey: 'sd_db_guru', fields: [
      { name: 'photoUrl', label: 'Foto Profil Guru (Drive)', type: 'file' },
      { name: 'fullName', label: 'Nama Lengkap & Gelar', type: 'text', required: true },
      { name: 'nuptk', label: 'NIP / NUPTK', type: 'text', required: true },
      { name: 'subject', label: 'Guru Mata Pelajaran', type: 'text' },
      { name: 'homeroomTeacher', label: 'Wali Kelas', type: 'text' },
      { name: 'phoneWA', label: 'Nomor WA', type: 'text' },
      { name: 'username', label: 'Username Login', type: 'text', required: true },
      { name: 'password', label: 'Password Login', type: 'text', required: true }
    ]},
    { id: 'Database Tenaga Pendidik', label: 'Database Tendik', desc: 'Data staf TU & karyawan', icon: 'user-Check', bg: 'bg-indigo-600', roles: ['admin'], category: 'Database User', storageKey: 'sd_db_tenaga_pendidik', fields: [
      { name: 'photoUrl', label: 'Foto Profil (Drive)', type: 'file' },
      { name: 'fullName', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'nik', label: 'Nomor NIK / NIP', type: 'text', required: true },
      { name: 'occupation', label: 'Jabatan / Bagian', type: 'text' },
      { name: 'phoneWA', label: 'Nomor WA', type: 'text' },
      { name: 'username', label: 'Username Login', type: 'text', required: true },
      { name: 'password', label: 'Password Login', type: 'text', required: true }
    ]},
    { id: 'Database Orang Tua Siswa', label: 'Database Orang Tua', desc: 'Data wali murid', icon: 'heart-handshake', bg: 'bg-amber-600', roles: ['admin'], category: 'Database User', storageKey: 'sd_db_ortu', fields: [
      { name: 'fullName', label: 'Nama Lengkap Orang Tua', type: 'text', required: true },
      { name: 'nik', label: 'Nomor NIK', type: 'text', required: true },
      { name: 'childName', label: 'Nama Anak (Siswa)', type: 'text', required: true },
      { name: 'childClass', label: 'Kelas Anak', type: 'text' },
      { name: 'phoneWA', label: 'Nomor WA', type: 'text' },
      { name: 'username', label: 'Username Login', type: 'text', required: true },
      { name: 'password', label: 'Password Login', type: 'text', required: true }
    ]},
    { id: 'Database Mitra', label: 'Database Mitra', desc: 'Pengelola kantin & koperasi', icon: 'store', bg: 'bg-pink-600', roles: ['admin'], category: 'Database User', storageKey: 'sd_db_mitra', fields: [
      { name: 'fullName', label: 'Nama Pemilik Mitra', type: 'text', required: true },
      { name: 'storeName', label: 'Nama Kantin / Stan', type: 'text', required: true },
      { name: 'nik', label: 'Nomor NIK', type: 'text' },
      { name: 'phoneWA', label: 'Nomor WA', type: 'text' },
      { name: 'username', label: 'Username Login', type: 'text', required: true },
      { name: 'password', label: 'Password Login', type: 'text', required: true }
    ]},
    { id: 'Pengaturan Koneksi Spreadsheet', label: 'Koneksi Spreadsheet & Drive', desc: 'Atur URL Web App Google Apps Script', icon: 'cloud', bg: 'bg-blue-700', roles: ['admin'], category: 'Pengaturan Sistem', isCloudConfig: true },

    // MENU GURU
    { id: 'Absensi Guru', label: 'Absensi Guru', desc: 'Kirim kehadiran harian guru', icon: 'user-check', bg: 'bg-emerald-500', roles: ['guru'], isAbsensi: true },
    { id: 'Jadwal Guru', label: 'Jadwal Mengajar', desc: 'Kelola jadwal pelajaran kelas', icon: 'clock', bg: 'bg-blue-500', roles: ['guru'], storageKey: 'sd_jadwal_siswa', fields: [
      { name: 'hari', label: 'Hari', type: 'select', options: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'], required: true },
      { name: 'jamMulai', label: 'Jam Mulai', type: 'time', required: true },
      { name: 'jamSelesai', label: 'Jam Selesai', type: 'time', required: true },
      { name: 'mataPelajaran', label: 'Mata Pelajaran', type: 'text', required: true },
      { name: 'kelas', label: 'Kelas', type: 'text', required: true },
      { name: 'guruInput', label: 'Nama Guru', type: 'text', required: true }
    ]},
    { id: 'PR & Tugas Siswa', label: 'PR & Tugas Siswa', desc: 'Kelola tugas & soal siswa', icon: 'clipboard-list', bg: 'bg-rose-500', roles: ['guru', 'siswa'], storageKey: 'sd_tugas_list', fields: [
      { name: 'namaTugas', label: 'Judul Tugas / PR', type: 'text', required: true },
      { name: 'mataPelajaran', label: 'Mata Pelajaran', type: 'text', required: true },
      { name: 'kelas', label: 'Kelas', type: 'text', required: true },
      { name: 'waktuPengerjaan', label: 'Batas Waktu (Deadline)', type: 'date', required: true },
      { name: 'uraianTugas', label: 'Instruksi Tugas', type: 'text', required: true },
      { name: 'soalFile', label: 'Lampiran Soal (Drive)', type: 'file' }
    ]},
    { id: 'Penilaian & Raport Siswa', label: 'Penilaian & Raport', desc: 'Input nilai tugas, ujian & rapor', icon: 'star', bg: 'bg-amber-500', roles: ['guru', 'siswa', 'ortu'], storageKey: 'sd_penilaian_tugas', fields: [
      { name: 'namaSiswa', label: 'Nama Siswa', type: 'text', required: true },
      { name: 'nisn', label: 'NISN', type: 'text', required: true },
      { name: 'kelas', label: 'Kelas', type: 'text', required: true },
      { name: 'mapel', label: 'Mata Pelajaran', type: 'text', required: true },
      { name: 'namaTugas', label: 'Kategori Penilaian', type: 'select', options: ['Tugas Harian', 'UTS', 'UAS', 'Nilai Akhir Raport'] },
      { name: 'nilai', label: 'Nilai Angka (0-100)', type: 'number', required: true }
    ]},

    // MENU SISWA & ORTU
    { id: 'Absensi Siswa', label: 'Absensi Siswa', desc: 'Rekap & kirim kehadiran harian', icon: 'user-check', bg: 'bg-emerald-500', roles: ['siswa'], isAbsensi: true },
    { id: 'Jadwal Siswa', label: 'Jadwal Pelajaran', desc: 'Jadwal mata pelajaran harian', icon: 'calendar', bg: 'bg-blue-500', roles: ['siswa', 'ortu'], storageKey: 'sd_jadwal_siswa', readOnlyFor: ['siswa', 'ortu'], fields: [
      { name: 'hari', label: 'Hari', type: 'text' },
      { name: 'jamMulai', label: 'Jam Mulai', type: 'text' },
      { name: 'jamSelesai', label: 'Jam Selesai', type: 'text' },
      { name: 'mataPelajaran', label: 'Mata Pelajaran', type: 'text' },
      { name: 'kelas', label: 'Kelas', type: 'text' },
      { name: 'guruInput', label: 'Guru Pengampu', type: 'text' }
    ]},
    { id: 'Keuangan Siswa', label: 'Keuangan & SPP', desc: 'Riwayat pembayaran & tagihan', icon: 'wallet', bg: 'bg-violet-500', roles: ['siswa', 'ortu'], storageKey: 'sd_pembayaran_list', readOnlyFor: ['siswa', 'ortu'], fields: [
      { name: 'kode', label: 'Kode', type: 'text' },
      { name: 'tanggal', label: 'Tanggal', type: 'text' },
      { name: 'namaSiswa', label: 'Nama Siswa', type: 'text' },
      { name: 'jenis', label: 'Tagihan', type: 'text' },
      { name: 'nominalDibayar', label: 'Dibayar (Rp)', type: 'number' },
      { name: 'status', label: 'Status', type: 'text' }
    ]},

    // MENU TENDIK
    { id: 'Absensi Tenaga Pendidik', label: 'Absensi Tendik', desc: 'Kehadiran harian staf', icon: 'user-check', bg: 'bg-emerald-500', roles: ['tendik'], isAbsensi: true },
    { id: 'Input Pembayaran', label: 'Input Pembayaran', desc: 'Catat pembayaran SPP siswa', icon: 'credit-card', bg: 'bg-blue-500', roles: ['tendik'], storageKey: 'sd_pembayaran_list', fields: [
      { name: 'kode', label: 'Kode Transaksi', type: 'text', required: true },
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'namaSiswa', label: 'Nama Siswa', type: 'text', required: true },
      { name: 'kelas', label: 'Kelas', type: 'text', required: true },
      { name: 'jenis', label: 'Jenis Pembayaran', type: 'select', options: ['SPP', 'Uang Gedung', 'Seragam', 'Buku', 'Daftar Ulang'] },
      { name: 'nominalDibayar', label: 'Nominal Dibayar (Rp)', type: 'number', required: true },
      { name: 'metode', label: 'Metode', type: 'select', options: ['Cash', 'Transfer', 'Cicil'] },
      { name: 'status', label: 'Status', type: 'select', options: ['Lunas', 'Belum Lunas'] }
    ]},
    { id: 'Input Pemasukan', label: 'Input Pemasukan', desc: 'Catat kas masuk sekolah', icon: 'trending-up', bg: 'bg-emerald-600', roles: ['tendik'], storageKey: 'sd_pemasukan_list', fields: [
      { name: 'kode', label: 'Kode Pemasukan', type: 'text', required: true },
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'jenis', label: 'Kategori', type: 'select', options: ['Pemasukan Rutin', 'Dana BOS', 'Pemasukan Lainnya'] },
      { name: 'nama', label: 'Nama Pemasukan', type: 'text', required: true },
      { name: 'nominal', label: 'Nominal (Rp)', type: 'number', required: true },
      { name: 'filePreview', label: 'Bukti Foto (Drive)', type: 'file' }
    ]},
    { id: 'Input Pengeluaran', label: 'Input Pengeluaran', desc: 'Catat pengeluaran sekolah', icon: 'trending-down', bg: 'bg-rose-600', roles: ['tendik'], storageKey: 'sd_pengeluaran_list', fields: [
      { name: 'kode', label: 'Kode Pengeluaran', type: 'text', required: true },
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'jenis', label: 'Kategori', type: 'select', options: ['Pengeluaran Rutin', 'Operasional', 'Lainnya'] },
      { name: 'nama', label: 'Keperluan', type: 'text', required: true },
      { name: 'nominal', label: 'Nominal (Rp)', type: 'number', required: true },
      { name: 'filePreview', label: 'Bukti Nota (Drive)', type: 'file' }
    ]},

    // MENU MITRA KANTIN & BERSAMA
    { id: 'Absensi Mitra', label: 'Absensi Mitra', desc: 'Buka & tutup stan kantin', icon: 'user-check', bg: 'bg-emerald-500', roles: ['mitra'], isAbsensi: true },
    { id: 'Input Produk/Menu Kantin', label: 'Menu Kantin', desc: 'Kelola makanan & minuman kantin', icon: 'coffee', bg: 'bg-orange-500', roles: ['mitra', 'siswa', 'guru', 'tendik'], readOnlyFor: ['siswa', 'guru', 'tendik'], storageKey: 'sd_mitra_produk_kantin_list', fields: [
      { name: 'kodeProduk', label: 'Kode Menu', type: 'text', required: true },
      { name: 'namaProduk', label: 'Nama Makanan / Minuman', type: 'text', required: true },
      { name: 'jenisProduk', label: 'Kategori', type: 'select', options: ['Makanan', 'Minuman', 'Snack'] },
      { name: 'harga', label: 'Harga (Rp)', type: 'number', required: true },
      { name: 'stok', label: 'Stok Tersedia', type: 'number', required: true },
      { name: 'gambar', label: 'Foto Produk (Drive)', type: 'file' }
    ]},
    { id: 'Pengumuman Sekolah', label: 'Pengumuman Sekolah', desc: 'Informasi & edaran resmi sekolah', icon: 'megaphone', bg: 'bg-indigo-500', roles: ['siswa', 'guru', 'tendik', 'ortu'], readOnlyFor: ['siswa', 'guru', 'ortu'], storageKey: 'sd_pengumuman_list', fields: [
      { name: 'kode', label: 'Kode', type: 'text' },
      { name: 'tanggal', label: 'Tanggal', type: 'date' },
      { name: 'nama', label: 'Judul Pengumuman', type: 'text' },
      { name: 'jenis', label: 'Kategori', type: 'text' },
      { name: 'keterangan', label: 'Isi Pengumuman', type: 'text' }
    ]}
  ];

  // --- STATE GLOBAL APLIKASI ---
  let state = {
    user: null,
    activePage: 'Beranda',
    darkMode: false,
    searchQuery: '',
    editingItem: null,
    isFormModalOpen: false,
    tempFileBase64: {}
  };

  function formatRupiah(val) {
    const num = Number(String(val || '0').replace(/[^0-9]/g, '')) || 0;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  }

  function showToast(msg) {
    let toast = document.getElementById('sd-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sd-toast';
      toast.className = 'fixed top-5 left-1/2 -translate-x-1/2 z-[100000] bg-indigo-600 text-white px-6 py-3 rounded-full shadow-xl font-semibold text-sm transition-all duration-300';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
  }

  // --- FUNGSI RENDER UTAMA ---
  function renderApp() {
    const root = document.getElementById('root');
    if (!root) return;

    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (!state.user) {
      root.innerHTML = renderLoginView();
      attachLoginEvents();
    } else {
      root.innerHTML = renderAuthenticatedView();
      attachMainEvents();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- TAMPILAN LOGIN ---
  function renderLoginView() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 relative overflow-hidden">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-300 dark:bg-indigo-800 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-300 dark:bg-blue-800 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>

        <div class="glass-panel w-full max-w-md rounded-3xl shadow-2xl p-8 relative z-10 animate-fade-in">
          <div class="flex flex-col items-center mb-6">
            <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 text-white">
              <i data-lucide="graduation-cap" class="w-9 h-9"></i>
            </div>
            <h1 class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight text-center">Sekolah Digital</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 text-center">Platform Manajemen Terpadu (Spreadsheet & Drive)</p>
          </div>

          <form id="login-form" class="space-y-4 mb-6">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1.5">Username</label>
              <input id="login-username" type="text" required placeholder="Masukkan username atau peran" class="w-full px-4 py-3 bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1.5">Password</label>
              <input id="login-password" type="password" required placeholder="Masukkan password" class="w-full px-4 py-3 bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <button type="submit" class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95">
              Masuk Aplikasi
            </button>
          </form>

          <div class="pt-4 border-t border-slate-200/70 dark:border-slate-700">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">Akses Cepat Multi-Role (Demo)</p>
            <div class="grid grid-cols-2 gap-2">
              ${DEMO_USERS.map((u, idx) => `
                <button type="button" data-demo-index="${idx}" class="demo-login-btn flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/70 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all text-left">
                  <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0">
                    ${u.name.charAt(0)}
                  </div>
                  <div class="min-w-0">
                    <p class="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 truncate">${ROLE_NAMES[u.role]}</p>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- TAMPILAN UTAMA SETELAH LOGIN ---
  function renderAuthenticatedView() {
    const u = state.user;
    const roleMenus = MENU_CONFIG.filter(m => m.roles.includes(u.role));

    return `
      <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 relative">
        <!-- Sidebar Desktop -->
        <aside class="hidden lg:flex w-72 flex-col glass-panel border-r border-slate-200/70 dark:border-slate-800 z-30">
          <div class="h-16 flex items-center px-6 border-b border-slate-200/60 dark:border-slate-800 space-x-2 text-indigo-600 dark:text-indigo-400">
            <i data-lucide="graduation-cap" class="w-7 h-7"></i>
            <span class="text-xl font-extrabold tracking-tight dark:text-white">Sekolah Digital</span>
          </div>

          <div class="flex-1 overflow-y-auto py-5 px-4 space-y-1.5 no-scrollbar">
            <button data-nav="Beranda" class="nav-btn flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left font-bold transition-all ${state.activePage === 'Beranda' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}">
              <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
              <span class="text-sm">Beranda</span>
            </button>

            ${roleMenus.map(item => `
              <button data-nav="${item.id}" class="nav-btn flex items-center space-x-3 px-4 py-2.5 rounded-xl w-full text-left font-medium transition-all ${state.activePage === item.id ? 'bg-indigo-600 text-white font-bold shadow-md' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}">
                <div class="w-7 h-7 rounded-lg ${item.bg} text-white flex items-center justify-center shrink-0">
                  <i data-lucide="${item.icon}" class="w-4 h-4"></i>
                </div>
                <span class="text-sm truncate">${item.label}</span>
              </button>
            `).join('')}
          </div>

          <div class="p-4 border-t border-slate-200/60 dark:border-slate-800">
            <button id="logout-btn" class="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 font-bold text-sm transition-all">
              <i data-lucide="log-out" class="w-4 h-4"></i>
              <span>Keluar Sesi</span>
            </button>
          </div>
        </aside>

        <!-- Konten Kanan -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
          <!-- Header App Bar -->
          <header class="h-16 glass-panel border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 z-20 shrink-0">
            <div class="flex items-center space-x-3">
              ${state.activePage !== 'Beranda' ? `
                <button data-nav="Beranda" class="nav-btn p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200">
                  <i data-lucide="arrow-left" class="w-5 h-5"></i>
                </button>
              ` : ''}
              <span class="text-lg font-extrabold tracking-tight truncate">${state.activePage}</span>
            </div>

            <div class="flex items-center space-x-2">
              <button id="sync-now-btn" title="Sinkronisasi ke Spreadsheet Sekarang" class="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-500/30">
                <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                <span class="hidden sm:inline">Sync Spreadsheet</span>
              </button>
              <button id="theme-toggle-btn" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <i data-lucide="${state.darkMode ? 'sun' : 'moon'}" class="w-5 h-5"></i>
              </button>
              <button id="mobile-logout-btn" class="lg:hidden p-2 rounded-xl bg-rose-50 text-rose-600">
                <i data-lucide="log-out" class="w-5 h-5"></i>
              </button>
            </div>
          </header>

          <!-- Area Halaman -->
          <main class="flex-1 overflow-y-auto p-4 sm:p-8 pb-28">
            <div class="max-w-7xl mx-auto animate-fade-in">
              ${state.activePage === 'Beranda' ? renderDashboardBento(roleMenus) : renderActiveMenuPage()}
            </div>
          </main>
        </div>
      </div>
    `;
  }

  // --- DASHBOARD BENTO GRID ASIMETRIS & KARTU IDENTITAS ---
  function renderDashboardBento(roleMenus) {
    const u = state.user;
    return `
      <div class="lg:flex lg:gap-8 lg:items-start">
        <!-- Kartu Identitas Digital -->
        <div class="lg:w-[350px] shrink-0 flex flex-col gap-6 mb-8 lg:mb-0">
          <div class="w-full min-h-[14rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 rounded-3xl shadow-xl p-6 flex flex-col justify-between text-white relative overflow-hidden">
            <div class="flex justify-between items-start z-10">
              <div>
                <p class="text-[10px] uppercase tracking-widest opacity-80 font-semibold">Aplikasi Sekolah Digital</p>
                <h2 class="text-lg font-bold">KARTU IDENTITAS DIGITAL</h2>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg border border-white/30">
                ${u.name.charAt(0)}
              </div>
            </div>
            <div class="z-10 mt-6">
              <p class="text-[10px] uppercase tracking-widest opacity-75">Nama Pengguna</p>
              <p class="text-2xl font-bold tracking-tight mb-4">${u.name}</p>
              <div class="flex justify-between items-end">
                <div>
                  <p class="text-[10px] uppercase tracking-widest opacity-75">ID / NISN / NIP</p>
                  <p class="font-mono text-base tracking-widest">${u.nisn || u.id}</p>
                </div>
                <span class="text-xs font-bold bg-white/20 px-3 py-1 rounded-lg uppercase">${ROLE_NAMES[u.role]}</span>
              </div>
            </div>
          </div>

          <!-- Ringkasan Status Database Cloud -->
          <div class="glass-card rounded-3xl p-6">
            <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <i data-lucide="database" class="w-4 h-4 text-indigo-500"></i>
              Status Penyimpanan Cloud
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Seluruh perubahan data tabel dan unggahan berkas foto/dokumen tersimpan otomatis ke <b>Google Spreadsheet</b> dan <b>Google Drive</b>.
            </p>
            <div class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
              Tanggal Sistem: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        <!-- Bento Grid Menu -->
        <div class="lg:flex-1">
          <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-4 px-1 flex items-center gap-2">
            <i data-lucide="grid" class="w-5 h-5 text-indigo-500"></i>
            <span>Menu Akses (${ROLE_NAMES[u.role]})</span>
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
            ${roleMenus.map(m => `
              <button data-nav="${m.id}" class="nav-btn glass-card rounded-3xl p-5 text-left flex flex-col justify-between relative overflow-hidden group ${m.span || 'col-span-1'} ${m.tall ? 'row-span-2' : ''}">
                <div class="w-12 h-12 rounded-2xl ${m.bg} text-white flex items-center justify-center shadow-md mb-4">
                  <i data-lucide="${m.icon}" class="w-6 h-6"></i>
                </div>
                <div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">${m.label}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${m.desc}</p>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- HALAMAN MENU DINAMIS (TABEL CRUD SPREADSHEET / ABSENSI / PENGATURAN CLOUD) ---
  function renderActiveMenuPage() {
    const menu = MENU_CONFIG.find(m => m.id === state.activePage);
    if (!menu) return `<div class="p-8 text-center">Halaman tidak ditemukan.</div>`;

    if (menu.isCloudConfig) {
      return renderCloudSettingsPage();
    }

    if (menu.isAbsensi) {
      return renderAbsensiPage(menu);
    }

    return renderCrudTablePage(menu);
  }

  // --- HALAMAN PENGATURAN KONEKSI SPREADSHEET & DRIVE ---
  function renderCloudSettingsPage() {
    const currentUrl = window.SekolahDigitalCloud ? window.SekolahDigitalCloud.getGasUrl() : '';
    const displayUrl = currentUrl.includes('MASUKKAN_URL') ? '' : currentUrl;

    return `
      <div class="glass-card rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
        <div class="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <i data-lucide="cloud" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold">Koneksi Google Spreadsheet & Google Drive</h2>
            <p class="text-sm text-slate-500">Hubungkan aplikasi dengan Web App URL dari Google Apps Script Anda.</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2">URL Web App Google Apps Script (Berakhiran /exec)</label>
            <input id="gas-url-input" type="url" value="${displayUrl}" placeholder="https://script.google.com/macros/s/AKfycb.../exec" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button id="save-gas-url-btn" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md text-sm">
            Simpan & Hubungkan Sekarang
          </button>
        </div>
      </div>
    `;
  }

  // --- HALAMAN ABSENSI HARIAN ---
  function renderAbsensiPage(menu) {
    const u = state.user;
    const allAbsen = JSON.parse(localStorage.getItem('sd_absensi_list') || '[]');
    const myAbsen = allAbsen.filter(a => a.userId === u.id || a.userName === u.name);
    const actions = u.role === 'mitra' ? ['Buka', 'Tutup'] : ['Hadir', 'Pulang', 'Sakit', 'Izin'];

    return `
      <div class="space-y-6">
        <div class="glass-card rounded-3xl p-6">
          <h2 class="text-xl font-bold mb-1">${menu.label}</h2>
          <p class="text-sm text-slate-500 mb-6">Pilih status kehadiran hari ini. Data langsung tercatat ke Google Spreadsheet.</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            ${actions.map(act => `
              <button data-absen-type="${act}" class="absen-action-btn p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg shadow-lg flex flex-col items-center gap-3 active:scale-95 transition-all">
                <i data-lucide="check-circle-2" class="w-8 h-8"></i>
                <span>Absen ${act}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="glass-card rounded-3xl p-6">
          <h3 class="font-bold text-lg mb-4">Riwayat Kehadiran Anda</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th class="py-3 px-4">Tanggal</th>
                  <th class="py-3 px-4">Waktu</th>
                  <th class="py-3 px-4">Tipe</th>
                  <th class="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                ${myAbsen.length > 0 ? myAbsen.map(item => `
                  <tr class="border-b border-slate-100 dark:border-slate-800">
                    <td class="py-3 px-4">${item.date}</td>
                    <td class="py-3 px-4">${item.time}</td>
                    <td class="py-3 px-4 font-bold">${item.type}</td>
                    <td class="py-3 px-4"><span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">${item.status}</span></td>
                  </tr>
                `).join('') : `<tr><td colspan="4" class="py-8 text-center text-slate-400">Belum ada riwayat absensi.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // --- HALAMAN TABEL CRUD DATABASE & LAPORAN ---
  function renderCrudTablePage(menu) {
    const rawData = JSON.parse(localStorage.getItem(menu.storageKey) || '[]');
    const isReadOnly = menu.readOnlyFor && menu.readOnlyFor.includes(state.user.role);
    const filtered = rawData.filter(item => {
      if (!state.searchQuery) return true;
      return Object.values(item).some(val => String(val).toLowerCase().includes(state.searchQuery.toLowerCase()));
    });

    return `
      <div class="glass-card rounded-3xl p-6 space-y-6">
        <div class="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <h2 class="text-xl font-bold">${menu.label}</h2>
            <p class="text-xs text-slate-500">Tabel Spreadsheet: <code class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">${menu.storageKey}</code></p>
          </div>
          <div class="flex flex-wrap gap-2 w-full sm:w-auto">
            ${!isReadOnly ? `
              <button id="open-add-modal-btn" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-sm">
                <i data-lucide="plus" class="w-4 h-4"></i> Tambah Data
              </button>
            ` : ''}
            <button id="export-excel-btn" class="px-4 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-sm font-bold flex items-center gap-1.5">
              <i data-lucide="file-down" class="w-4 h-4"></i> Excel
            </button>
          </div>
        </div>

        <div class="relative">
          <input id="table-search-input" type="text" value="${state.searchQuery}" placeholder="Cari data pada ${menu.label}..." class="w-full pl-4 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div class="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
          <table class="w-full text-left border-collapse text-sm">
            <thead class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs uppercase">
              <tr>
                <th class="p-4">No</th>
                ${menu.fields.map(f => `<th class="p-4">${f.label}</th>`).join('')}
                ${!isReadOnly ? `<th class="p-4 text-right">Aksi</th>` : ''}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${filtered.length > 0 ? filtered.map((item, idx) => `
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td class="p-4 font-medium text-slate-400">${idx + 1}</td>
                  ${menu.fields.map(f => {
                    const val = item[f.name];
                    if (f.type === 'file' && val) {
                      return `<td class="p-4"><a href="${val}" target="_blank" class="text-indigo-600 underline text-xs font-bold">Lihat File Drive</a></td>`;
                    }
                    if (f.type === 'number' && (f.name.includes('nominal') || f.name.includes('harga'))) {
                      return `<td class="p-4 font-bold text-emerald-600">${formatRupiah(val)}</td>`;
                    }
                    return `<td class="p-4 font-medium">${val || '-'}</td>`;
                  }).join('')}
                  ${!isReadOnly ? `
                    <td class="p-4 text-right whitespace-nowrap">
                      <button data-edit-id="${item.id}" class="edit-row-btn p-2 text-amber-600 hover:bg-amber-50 rounded-lg mr-1" title="Edit">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                      </button>
                      <button data-delete-id="${item.id}" class="delete-row-btn p-2 text-rose-600 hover:bg-rose-50 rounded-lg" title="Hapus">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    </td>
                  ` : ''}
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="${menu.fields.length + 2}" class="p-10 text-center text-slate-400">Belum ada data tersimpan.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      ${state.isFormModalOpen ? renderCrudModal(menu) : ''}
    `;
  }

  function renderCrudModal(menu) {
    const item = state.editingItem || {};
    return `
      <div class="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 class="font-bold text-lg">${state.editingItem ? 'Edit Data' : 'Tambah Data Baru'}</h3>
            <button id="close-modal-btn" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
          <form id="crud-form" class="p-6 overflow-y-auto space-y-4">
            ${menu.fields.map(f => `
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">${f.label}</label>
                ${f.type === 'select' ? `
                  <select name="${f.name}" ${f.required ? 'required' : ''} class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm">
                    <option value="">-- Pilih ${f.label} --</option>
                    ${(f.options || []).map(opt => `<option value="${opt}" ${item[f.name] === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                  </select>
                ` : f.type === 'file' ? `
                  <input type="file" data-file-field="${f.name}" accept="image/*,.pdf" class="file-upload-input w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-600" />
                  <p class="text-[11px] text-slate-400 mt-1">*Otomatis diunggah ke Folder Google Drive Anda saat disimpan.</p>
                ` : `
                  <input type="${f.type}" name="${f.name}" value="${item[f.name] || ''}" ${f.required ? 'required' : ''} class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                `}
              </div>
            `).join('')}
            <div class="pt-4 flex justify-end gap-2">
              <button type="button" id="cancel-modal-btn" class="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold">Batal</button>
              <button type="submit" class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md">Simpan ke Spreadsheet</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // --- EVENT LISTENERS ---
  function attachLoginEvents() {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const uname = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value.trim();

        const dbs = [
          { key: 'sd_db_siswa', role: 'siswa' },
          { key: 'sd_db_guru', role: 'guru' },
          { key: 'sd_db_tenaga_pendidik', role: 'tendik' },
          { key: 'sd_db_ortu', role: 'ortu' },
          { key: 'sd_db_mitra', role: 'mitra' }
        ];

        for (const db of dbs) {
          const list = JSON.parse(localStorage.getItem(db.key) || '[]');
          const found = list.find(item => item.username === uname && item.password === pass);
          if (found) {
            state.user = { id: found.id, name: found.fullName || found.username, role: db.role, nisn: found.nisn || found.nik || found.nuptk };
            state.activePage = 'Beranda';
            showToast(`Selamat datang, ${state.user.name}!`);
            renderApp();
            return;
          }
        }

        const matchedDemo = DEMO_USERS.find(u => u.role.toLowerCase() === uname.toLowerCase() || u.name.toLowerCase().includes(uname.toLowerCase()));
        state.user = matchedDemo || DEMO_USERS[0];
        state.activePage = 'Beranda';
        showToast(`Selamat datang, ${state.user.name}!`);
        renderApp();
      });
    }

    document.querySelectorAll('.demo-login-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-demo-index'));
        state.user = DEMO_USERS[idx];
        state.activePage = 'Beranda';
        showToast(`Login sebagai ${ROLE_NAMES[state.user.role]}`);
        renderApp();
      });
    });
  }

  function attachMainEvents() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activePage = btn.getAttribute('data-nav');
        state.searchQuery = '';
        state.isFormModalOpen = false;
        renderApp();
      });
    });

    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    [logoutBtn, mobileLogoutBtn].forEach(b => {
      if (b) b.addEventListener('click', () => {
        state.user = null;
        state.activePage = 'Beranda';
        renderApp();
      });
    });

    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        state.darkMode = !state.darkMode;
        renderApp();
      });
    }

    const syncNowBtn = document.getElementById('sync-now-btn');
    if (syncNowBtn && window.SekolahDigitalCloud) {
      syncNowBtn.addEventListener('click', () => {
        window.SekolahDigitalCloud.pullNow();
        showToast('Menyinkronkan data dengan Google Spreadsheet...');
      });
    }

    // Event Pengaturan Cloud
    const saveGasBtn = document.getElementById('save-gas-url-btn');
    if (saveGasBtn) {
      saveGasBtn.addEventListener('click', () => {
        const url = document.getElementById('gas-url-input').value.trim();
        if (window.SekolahDigitalCloud) {
          window.SekolahDigitalCloud.setGasUrl(url);
          showToast('URL Google Apps Script berhasil disimpan & dihubungkan!');
        }
      });
    }

    // Event Absensi
    document.querySelectorAll('.absen-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-absen-type');
        const now = new Date();
        const list = JSON.parse(localStorage.getItem('sd_absensi_list') || '[]');
        list.unshift({
          id: Date.now().toString(),
          userId: state.user.id,
          userName: state.user.name,
          role: state.user.role,
          date: now.toLocaleDateString('id-ID'),
          time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          type: type,
          status: 'Hadir Tepat Waktu'
        });
        localStorage.setItem('sd_absensi_list', JSON.stringify(list));
        showToast(`Absensi ${type} berhasil dicatat ke Spreadsheet!`);
        renderApp();
      });
    });

    // Event Tabel CRUD
    const menu = MENU_CONFIG.find(m => m.id === state.activePage);
    if (!menu || !menu.storageKey) return;

    const searchInput = document.getElementById('table-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderApp();
        const el = document.getElementById('table-search-input');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      });
    }

    const addBtn = document.getElementById('open-add-modal-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        state.editingItem = null;
        state.tempFileBase64 = {};
        state.isFormModalOpen = true;
        renderApp();
      });
    }

    document.querySelectorAll('.edit-row-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-edit-id');
        const list = JSON.parse(localStorage.getItem(menu.storageKey) || '[]');
        state.editingItem = list.find(x => String(x.id) === String(id)) || null;
        state.tempFileBase64 = {};
        state.isFormModalOpen = true;
        renderApp();
      });
    });

    document.querySelectorAll('.delete-row-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-id');
        if (confirm('Apakah Anda yakin ingin menghapus data ini dari Spreadsheet?')) {
          const list = JSON.parse(localStorage.getItem(menu.storageKey) || '[]');
          const updated = list.filter(x => String(x.id) !== String(id));
          localStorage.setItem(menu.storageKey, JSON.stringify(updated));
          showToast('Data berhasil dihapus!');
          renderApp();
        }
      });
    });

    const exportExcelBtn = document.getElementById('export-excel-btn');
    if (exportExcelBtn && window.XLSX) {
      exportExcelBtn.addEventListener('click', () => {
        const list = JSON.parse(localStorage.getItem(menu.storageKey) || '[]');
        if (list.length === 0) return showToast('Belum ada data untuk diekspor.');
        const ws = window.XLSX.utils.json_to_sheet(list);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, 'Data');
        window.XLSX.writeFile(wb, `${menu.label.replace(/\s+/g, '_')}.xlsx`);
      });
    }

    // Event Modal Form
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-modal-btn');
    [closeBtn, cancelBtn].forEach(b => {
      if (b) b.addEventListener('click', () => {
        state.isFormModalOpen = false;
        renderApp();
      });
    });

    document.querySelectorAll('.file-upload-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const fieldName = input.getAttribute('data-file-field');
        if (file && fieldName) {
          const reader = new FileReader();
          reader.onloadend = () => {
            state.tempFileBase64[fieldName] = reader.result;
          };
          reader.readAsDataURL(file);
        }
      });
    });

    const crudForm = document.getElementById('crud-form');
    if (crudForm) {
      crudForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(crudForm);
        const payload = state.editingItem ? { ...state.editingItem } : { id: Date.now().toString() };

        menu.fields.forEach(f => {
          if (f.type === 'file') {
            if (state.tempFileBase64[f.name]) {
              payload[f.name] = state.tempFileBase64[f.name];
            }
          } else {
            payload[f.name] = formData.get(f.name) || '';
          }
        });

        const list = JSON.parse(localStorage.getItem(menu.storageKey) || '[]');
        let updated;
        if (state.editingItem) {
          updated = list.map(x => String(x.id) === String(state.editingItem.id) ? payload : x);
        } else {
          updated = [payload, ...list];
        }

        localStorage.setItem(menu.storageKey, JSON.stringify(updated));
        state.isFormModalOpen = false;
        showToast('Data tersimpan & sedang disinkronkan ke Spreadsheet!');
        renderApp();
      });
    }
  }

  // Dengarkan sinkronisasi dari Google Spreadsheet
  window.addEventListener('localStorageUpdate', () => {
    if (!state.isFormModalOpen) {
      renderApp();
    }
  });

  window.addEventListener('DOMContentLoaded', renderApp);
})();