export type FoodCategory = 'good' | 'limit';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  categoryLabel: string;
  nutrientTag: string;
  textureTag: string;
  shortHint: string;
  dentalFact: string;
  tipAfterEating: string;
}

export const GAME_MESSAGES = {
  CORRECT: 'Benar! Pilihan yang baik untuk gigi.',
  WRONG: 'Coba lagi! Ingat, makanan manis sebaiknya tidak terlalu sering dikonsumsi.',
  FINAL_EDUCATION:
    'Hebat! Yuk, jaga gigi dengan memilih makanan yang baik, minum air putih, dan tetap menyikat gigi 2 kali sehari.',
};

export const INITIAL_FOODS: FoodItem[] = [
  {
    id: 'apel',
    name: 'Apel',
    category: 'good',
    categoryLabel: 'Baik untuk Gigi',
    nutrientTag: 'Kaya Serat & Air',
    textureTag: 'Renyah Alami',
    shortHint: 'Buah segar yang renyah saat dikunyah.',
    dentalFact:
      'Mengunyah apel yang renyah membantu merangsang air liur dan membersihkan sisa makanan di permukaan gigi.',
    tipAfterEating: 'Makan apel segar beserta kulitnya yang sudah dicuci bersih.',
  },
  {
    id: 'wortel',
    name: 'Wortel',
    category: 'good',
    categoryLabel: 'Baik untuk Gigi',
    nutrientTag: 'Vitamin A & Serat',
    textureTag: 'Sayuran Renyah',
    shortHint: 'Sayuran oranye yang bagus untuk mata dan gusi.',
    dentalFact:
      'Wortel kaya serat dan vitamin A yang membantu menjaga kekuatan email gigi serta kesehatan gusi.',
    tipAfterEating: 'Cocok dijadikan camilan sehat di siang hari.',
  },
  {
    id: 'keju',
    name: 'Keju',
    category: 'good',
    categoryLabel: 'Baik untuk Gigi',
    nutrientTag: 'Tinggi Kalsium',
    textureTag: 'Pelindung Email',
    shortHint: 'Olahan susu yang gurih dan kaya kalsium.',
    dentalFact:
      'Keju mengandung kalsium dan kasein yang tinggi untuk membantu menyeimbangkan asam di mulut dan memperkuat lapisan gigi.',
    tipAfterEating: 'Pilih keju asli tanpa tambahan gula berlebih.',
  },
  {
    id: 'susu',
    name: 'Susu',
    category: 'good',
    categoryLabel: 'Baik untuk Gigi',
    nutrientTag: 'Kalsium & Vitamin D',
    textureTag: 'Penguat Gigi',
    shortHint: 'Minuman sehat pembangun tulang dan gigi kuat.',
    dentalFact:
      'Susu tawar kaya akan kalsium, fosfor, dan vitamin D yang membuat gigi tumbuh kokoh dan tidak mudah berlubang.',
    tipAfterEating: 'Minum susu tawar dan tetap sikat gigi sebelum tidur malam.',
  },
  {
    id: 'air-putih',
    name: 'Air putih',
    category: 'good',
    categoryLabel: 'Baik untuk Gigi',
    nutrientTag: '0% Gula · Mineral Alami',
    textureTag: 'Pembilas Bersih',
    shortHint: 'Minuman terbaik untuk membilas mulut setiap saat.',
    dentalFact:
      'Air putih membantu membilas sisa makanan dan gula yang menempel di sela-sela gigi tanpa meninggalkan asam.',
    tipAfterEating: 'Minum air putih setiap habis makan atau mengonsumsi camilan.',
  },
  {
    id: 'permen',
    name: 'Permen',
    category: 'limit',
    categoryLabel: 'Perlu Dibatasi',
    nutrientTag: 'Tinggi Gula',
    textureTag: 'Lengket di Gigi',
    shortHint: 'Kembang gula warna-warni yang sangat manis dan lengket.',
    dentalFact:
      'Gula dari permen mudah menempel lama di celah gigi dan diubah oleh kuman menjadi asam penyebab gigi berlubang.',
    tipAfterEating: 'Jika makan permen, segera berkumur dengan air putih setelahnya.',
  },
  {
    id: 'cokelat',
    name: 'Cokelat',
    category: 'limit',
    categoryLabel: 'Perlu Dibatasi',
    nutrientTag: 'Gula Tambahan',
    textureTag: 'Mudah Menempel',
    shortHint: 'Camilan manis kecokelatan yang meleleh di mulut.',
    dentalFact:
      'Cokelat manis mengandung banyak gula yang bisa tertinggal di lekukan gigi geraham jika tidak dibersihkan.',
    tipAfterEating: 'Jangan makan cokelat tepat sebelum tidur setelah menyikat gigi.',
  },
  {
    id: 'es-krim',
    name: 'Es krim',
    category: 'limit',
    categoryLabel: 'Perlu Dibatasi',
    nutrientTag: 'Tinggi Sirup & Gula',
    textureTag: 'Dingin & Manis',
    shortHint: 'Hidangan penutup beku dengan rasa manis.',
    dentalFact:
      'Es krim memiliki kandungan gula tinggi dan suhu sangat dingin yang dapat membuat gigi sensitif terasa ngilu.',
    tipAfterEating: 'Nikmati sesekali saja dan minum air putih sesudahnya.',
  },
  {
    id: 'minuman-bersoda',
    name: 'Minuman bersoda',
    category: 'limit',
    categoryLabel: 'Perlu Dibatasi',
    nutrientTag: 'Tinggi Gula & Asam',
    textureTag: 'Pengikis Email',
    shortHint: 'Minuman bergelembung yang manis dan asam.',
    dentalFact:
      'Minuman bersoda mengandung asam karbonasi dan gula tinggi yang dapat mengikis lapisan pelindung (email) gigi.',
    tipAfterEating: 'Ganti minuman bersoda dengan air putih segar atau susu tawar.',
  },
  {
    id: 'kue-manis',
    name: 'Kue manis',
    category: 'limit',
    categoryLabel: 'Perlu Dibatasi',
    nutrientTag: 'Tepung & Krim Gula',
    textureTag: 'Lunak & Lengket',
    shortHint: 'Kue bolu berhias krim gula warna-warni.',
    dentalFact:
      'Tepung halus dan krim gula pada kue manis mudah menyelip di antara gusi dan gigi sehingga memicu plak.',
    tipAfterEating: 'Konsumsi saat waktu makan utama dan sikat gigi secara teratur.',
  },
];

export const BRUSHING_STEPS = [
  {
    step: 1,
    title: 'Gunakan Pasta Gigi Berfluoride Sebesar Biji Jagung',
    duration: '30 Detik Pertama',
    description:
      'Pilih sikat gigi berbulu lembut. Sikat bagian depan gigi atas dan bawah dengan gerakan memutar lembut dari gusi ke arah gigi.',
  },
  {
    step: 2,
    title: 'Sikat Bagian Samping & Geraham Pengunyah',
    duration: '30 Detik Kedua',
    description:
      'Bersihkan permukaan kunyah gigi geraham tempat sisa makanan manis seperti cokelat dan kue sering bersembunyi.',
  },
  {
    step: 3,
    title: 'Bersihkan Bagian Dalam Gigi & Permukaan Lidah',
    duration: '30 Detik Ketiga',
    description:
      'Arahkan sikat secara miring untuk menjangkau bagian belakang gigi depan, lalu sikat lidah perlahan agar napas segar.',
  },
  {
    step: 4,
    title: 'Waktu Terbaik: Pagi Sesudah Sarapan & Malam Sebelum Tidur',
    duration: '2 Kali Sehari',
    description:
      'Menyikat gigi 2 kali sehari selama 2 menit penuh menjaga gigi tetap putih bersih, kuat, dan bebas lubang!',
  },
];
