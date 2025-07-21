"use client";
import React from "react";
import { motion } from "framer-motion";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { Container } from "@/components/Container";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function ContactPage() {
  return (
    <AnimatedPageWrapper>
      <Container className="flex flex-col gap-12 items-center justify-start min-h-screen">
        {/* Başlık */}
        <motion.div
          className="mb-2 md:mb-4 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
          variants={fadeInUp}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-center text-black dark:text-white mb-2 md:mb-4">İletişim</h1>
        </motion.div>
        {/* Açıklama */}
        <motion.div
          className="mb-4 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
          variants={fadeInUp}
        >
          <h2 className="text-2xl md:text-3xl text-center text-gray-700 dark:text-gray-200 mb-2 md:mb-4">ROINMAX ailesi olarak bizimle iletişim kurmanızdan mutluluk duyacağız.</h2>
        </motion.div>
        {/* İletişim Bilgileri ve Google Maps */}
        <motion.div
          className="flex flex-col md:flex-row gap-8 mb-8 md:mb-12 items-start justify-between w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <div className="flex-2 space-y-6 md:space-y-8">
            <div>
              <span className="block text-xl font-bold text-indigo-600 mb-1">Adresimiz</span>
              <span className="text-gray-700 dark:text-gray-200">Piriçelebi Mahallesi Zihniderin Caddesi No:20/A Kat:1 Rize</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-indigo-600 mb-1">E-posta</span>
              <span className="text-gray-700 dark:text-gray-200">tasarim@roinmax.com</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-indigo-600 mb-1">Telefon</span>
              <span className="text-gray-700 dark:text-gray-200">+90 532 469 58 47</span>
            </div>
          </div>
          <div className="flex-1 w-full h-64 md:h-48 rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="Roinmax Konum"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d24080.627815726388!2d40.515444!3d41.023539!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40667ae41e07d3a7%3A0xf94e0507388164de!2sRoinmax%20Reklam!5e0!3m2!1str!2str!4v1752825273837!5m2!1str!2str"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
        {/* İnsan Kaynakları */}
        <motion.div
          className="bg-indigo-50 dark:bg-indigo-900 rounded-xl p-6 md:p-8 mb-8 md:mb-12 shadow-md w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-2">İnsan Kaynakları Yönetimi</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-2">Güçlü bir çalışan deneyimi yolculuğuna hazır mısınız? Mobil, kapsayıcı ve sürdürülebilir bir çalışan deneyimini birlikte yaratıyor, geleceğin iş yerini beraber şekillendiriyoruz.</p>
          <span className="block text-indigo-600 dark:text-indigo-300 font-semibold">ik@roinmax.com</span>
        </motion.div>
        {/* İletişim Formu */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 mb-8 md:mb-12 w-full max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">İletişim Formu</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Birey veya Kurum Adı <span className="text-red-500">*</span></label>
              <input type="text" required className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-900 dark:text-white" placeholder="Adınız veya kurumunuz" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">E-Mail Adresiniz <span className="text-red-500">*</span></label>
              <input type="email" required className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-900 dark:text-white" placeholder="ornek@mail.com" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">İletişim Konusu</label>
              <input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-900 dark:text-white" placeholder="Konu" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">İleti Metni</label>
              <textarea className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[120px] dark:bg-gray-900 dark:text-white" placeholder="Mesajınız"></textarea>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors">Gönder</button>
          </form>
        </motion.div>
        {/* Roinmax Reklam Gücü */}
        <motion.div
          className="bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-800 dark:to-indigo-600 rounded-2xl p-8 md:p-12 text-center shadow-xl w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-extrabold text-black dark:text-white mb-2">Roinmax Reklam Gücü</h2>
          <p className="text-lg text-indigo-100 dark:text-indigo-200 mb-6">Projeye mi ihtiyacınız var?</p>
          <a href="mailto:roinmax@gmail.com" className="inline-block bg-white dark:bg-gray-900 text-indigo-700 dark:text-indigo-300 font-bold px-8 py-3 rounded-lg shadow hover:bg-indigo-50 dark:hover:bg-gray-800 transition">Bize Ulaşın</a>
        </motion.div>
      </Container>
    </AnimatedPageWrapper>
  );
} 