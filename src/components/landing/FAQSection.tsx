'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import { PlusIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

const faqData = [
  {
    id: "1",
    question: "Apa itu Smarteg?",
    answer: "Smarteg adalah aplikasi berbasis suara yang membantu Warteg mengelola stok, mencatat pesanan pelanggan, dan mengurangi limbah makanan dengan lebih efisien."
  },
  {
    id: "2",
    question: "Apakah Smarteg gratis?",
    answer: "Saat ini, Smarteg gratis untuk digunakan dalam fase uji coba. Setelah fase ini, akan ada skema harga berbasis kuota penggunaan."
  },
  {
    id: "3",
    question: "Bagaimana skema harga Smarteg nantinya?",
    answer: "Smarteg akan menawarkan beberapa paket harga berdasarkan kuota penggunaan, seperti:\n\n• Paket Gratis: Kuota terbatas untuk pencatatan stok, prediksi kebutuhan, dan gambar promosi.\n• Paket Pro: Kuota lebih besar untuk transaksi dan prediksi kebutuhan.\n• Paket Premium: Kuota tak terbatas untuk semua fitur, termasuk gambar promosi otomatis."
  },
  {
    id: "4",
    question: "Apakah Smarteg membutuhkan internet?",
    answer: "Ya, Smarteg membutuhkan koneksi internet untuk mencatat data, menghasilkan gambar promosi, dan memberikan prediksi kebutuhan masakan."
  },
  {
    id: "5",
    question: "Apakah data saya aman?",
    answer: "Ya, data Anda disimpan di server yang aman dan dienkripsi untuk melindungi privasi Anda."
  },
  {
    id: "6",
    question: "Bagaimana Smarteg membantu mengurangi limbah makanan?",
    answer: "Smarteg mencatat stok, pesanan, dan sisa makanan untuk menghitung limbah harian dan memberikan prediksi kebutuhan masakan berdasarkan data yang dikumpulkan."
  }
];

export default function FAQSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <HelpCircle className="-ms-0.5 opacity-60" size={12} aria-hidden="true" />
              FAQ
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Temukan jawaban untuk pertanyaan umum tentang Smarteg dan bagaimana kami membantu mengoptimalkan operasi warteg Anda.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
            defaultValue="1"
          >
            {faqData.map((faq) => (
              <AccordionItem
                value={faq.id}
                key={faq.id}
                className="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 rounded-md border px-4 py-1 outline-none last:border-b has-focus-visible:ring-[3px]"
              >
                <AccordionPrimitive.Header className="flex">
                                  <AccordionPrimitive.Trigger className="focus-visible:ring-0 flex flex-1 items-center justify-between rounded-md py-4 text-left text-[16px] leading-6 font-semibold transition-all outline-none [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                  {faq.question}
                  <PlusIcon
                    size={18}
                    className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="text-muted-foreground pb-4">
                  <div className="whitespace-pre-line leading-relaxed">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>


      </div>
    </section>
  );
} 