'use client';

import { Star, Quote, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// First set of testimonials (for top marquee - moving right)
const testimonialsDataTop = [
  {
    name: "Budi Santoso",
    profile_picture: "https://randomuser.me/api/portraits/men/21.jpg",
    role: "Pemilik Warteg",
    organization: "Warteg Sederhana Jakarta",
    rating: 5,
    testimonial: "Smarteg telah mengubah cara kami mengelola stok. Sekarang kami bisa memprediksi kebutuhan dengan akurat dan mengurangi limbah makanan hingga 70%.",
  },
  {
    name: "Siti Aminah",
    profile_picture: "https://randomuser.me/api/portraits/women/54.jpg",
    role: "Manager Operasional",
    organization: "Warteg Makmur Bandung",
    rating: 5,
    testimonial: "Pencatatan suara sangat memudahkan kami. Cukup ucapkan pesanan pelanggan, dan sistem langsung mencatat dan menghitung total harga.",
  },
  {
    name: "Ahmad Rahman",
    profile_picture: "https://randomuser.me/api/portraits/men/67.jpg",
    role: "Pemilik Warteg",
    organization: "Warteg Sejahtera Surabaya",
    rating: 5,
    testimonial: "AI prediksi kebutuhan sangat membantu. Kami tidak lagi kehabisan menu favorit atau membuat terlalu banyak yang terbuang.",
  },
  {
    name: "Dewi Sartika",
    profile_picture: "https://randomuser.me/api/portraits/women/32.jpg",
    role: "Kasir & Admin",
    organization: "Warteg Bahagia Semarang",
    rating: 5,
    testimonial: "Sistem notifikasi menu ready dan promosi otomatis sangat efektif menarik pelanggan. Penjualan kami meningkat signifikan.",
  },
  {
    name: "Bambang Suryanto",
    profile_picture: "https://randomuser.me/api/portraits/men/48.jpg",
    role: "Pemilik Warteg",
    organization: "Warteg Jaya Medan",
    rating: 5,
    testimonial: "Pengelolaan limbah makanan menjadi lebih mudah. Kami bisa melacak dan mengurangi pemborosan dengan tepat.",
  },
];

// Second set of testimonials (for bottom marquee - moving left)
const testimonialsDataBottom = [
  {
    name: "Sari Kusuma",
    profile_picture: "https://randomuser.me/api/portraits/women/62.jpg",
    role: "Manager Warteg",
    organization: "Warteg Maju Yogyakarta",
    rating: 5,
    testimonial: "Pencatatan stok otomatis dengan suara sangat praktis. Tidak perlu lagi menulis manual, semua tercatat dengan akurat.",
  },
  {
    name: "Farhan Aditya",
    profile_picture: "https://randomuser.me/api/portraits/men/33.jpg",
    role: "Pemilik Warteg",
    organization: "Warteg Sukses Palembang",
    rating: 5,
    testimonial: "Prediksi AI membantu kami mengoptimalkan persiapan masakan. Tidak ada lagi makanan yang terbuang sia-sia.",
  },
  {
    name: "Helena Wijaya",
    profile_picture: "https://randomuser.me/api/portraits/women/18.jpg",
    role: "Manager Operasional",
    organization: "Warteg Makmur Malang",
    rating: 5,
    testimonial: "Sistem voice-to-text sangat akurat. Pelanggan bisa langsung menyebutkan pesanan dan sistem mencatat dengan sempurna.",
  },
  {
    name: "Irfan Maulana",
    profile_picture: "https://randomuser.me/api/portraits/men/23.jpg",
    role: "Pemilik Warteg",
    organization: "Warteg Berkah Makassar",
    rating: 4,
    testimonial: "Pengelolaan limbah makanan menjadi lebih terstruktur. Kami bisa melacak dan mengurangi pemborosan dengan efektif.",
  },
  {
    name: "Nisa Aulia",
    profile_picture: "https://randomuser.me/api/portraits/women/41.jpg",
    role: "Manager Warteg",
    organization: "Warteg Sejahtera Denpasar",
    rating: 5,
    testimonial: "Notifikasi real-time sangat membantu. Kami bisa langsung mengumumkan menu baru dan menarik pelanggan dengan cepat.",
  },
  {
    name: "Raka Pratama",
    profile_picture: "https://randomuser.me/api/portraits/men/90.jpg",
    role: "Pemilik Warteg",
    organization: "Warteg Jaya Balikpapan",
    rating: 5,
    testimonial: "Smarteg benar-benar mengoptimalkan operasi warteg kami. Stok terkelola dengan baik dan limbah makanan berkurang drastis.",
  },
];

interface TestimonialProps {
  testimonial: {
    name: string;
    profile_picture: string;
    role: string;
    organization: string;
    rating: number;
    testimonial: string;
  };
}

const TestimonialCard: React.FC<TestimonialProps> = ({ testimonial }) => {
  // Keywords related to Smarteg features to highlight
  const keywordsToHighlight = [
    "stok",
    "limbah",
    "prediksi",
    "suara",
    "otomatis",
    "AI",
    "pencatatan",
    "pelanggan",
    "menu",
    "notifikasi",
    "promosi",
    "pemborosan",
    "optimalkan",
    "akurat",
    "real-time",
    "efektif",
  ];

  // Function to highlight keywords in text
  const highlightKeyword = (text: string) => {
    const foundKeyword = keywordsToHighlight.find((keyword) =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!foundKeyword) return text;

    const regex = new RegExp(`(${foundKeyword})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === foundKeyword.toLowerCase() ? (
            <span key={index} className="text-green-600 font-medium">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <Card className="min-w-[380px] max-w-[420px] mx-4 shadow-sm rounded-3xl overflow-hidden bg-white flex flex-col h-full border-0">
      <CardContent className="pt-8 pb-6 px-7 flex flex-col justify-between h-full">
        <div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <Quote className="text-green-500" size={24} />
          </div>

          <p className="text-gray-700 text-base leading-relaxed mb-6 whitespace-normal">
            &ldquo;{highlightKeyword(testimonial.testimonial)}&rdquo;
          </p>
        </div>

        <div>
          <div className="h-px bg-gray-200 my-4"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 relative rounded-full overflow-hidden">
                <Image
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                  src={testimonial.profile_picture}
                  width={48}
                  height={48}
                />
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-gray-600 text-sm">
                  {testimonial.role}
                </div>
                <div className="text-green-600 text-sm font-medium">
                  {testimonial.organization}
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={
                    i < testimonial.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }
                  size={16}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function TestimonialsSection() {
  return (
    <section 
      id="testimonials" 
      className="py-20 relative overflow-hidden"
    >
      {/* Pure white base background */}
      <div className="absolute inset-0 bg-white z-0" />

      {/* Light green content area with inset margins for smooth transition */}
      <div className="absolute inset-x-0 top-[60px] bottom-[60px] bg-green-50/90 z-0" />

      {/* Top transition - subtle gradient from white to green */}
      <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-white to-green-50/90 z-0" />

      {/* Bottom transition - subtle gradient from green to white */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-white to-green-50/90 z-0" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-green-300/20 rounded-full blur-3xl"></div>

      {/* Title content */}
      <div className="max-w-5xl mx-auto text-center relative z-10 mb-16 md:mb-20">
        <div className="flex justify-center mb-4">
          <Badge className='bg-green-100 text-green-700 border-green-200'>
            <MessageCircle className="-ms-0.5 opacity-60" size={12} aria-hidden="true" />
            Testimoni
          </Badge>
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Bagaimana Smarteg Membantu <br /> Warteg di Seluruh <span className="font-eb-garamond italic font-normal">Indonesia</span>
        </h2>
        <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Dipercaya oleh ribuan warteg di seluruh Indonesia untuk mengoptimalkan <br/>operasi dan mengurangi limbah makanan
        </p>
      </div>

      {/* Marquee content container */}
      <div className="relative z-10">
        {/* First row - moving right - with first set of testimonials */}
        <div className="mb-12 -mx-4">
          <div className="flex animate-marquee">
            {[...testimonialsDataTop, ...testimonialsDataTop].map(
              (testimonial, idx) => (
                <div
                  key={`${testimonial.name}-${idx}`}
                  className="whitespace-normal"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              )
            )}
          </div>
        </div>

        {/* Second row - moving left - with second set of testimonials */}
        <div className="-mx-4">
          <div className="flex animate-marquee-reverse">
            {[...testimonialsDataBottom, ...testimonialsDataBottom].map(
              (testimonial, idx) => (
                <div
                  key={`${testimonial.name}-reverse-${idx}`}
                  className="whitespace-normal"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 