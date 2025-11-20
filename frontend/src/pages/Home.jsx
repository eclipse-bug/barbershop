import { motion } from "framer-motion";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center relative text-white overflow-hidden px-4 sm:px-6">
      {/* ✅ Conținut principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-3xl"
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#d4af37] 
          mb-4 sm:mb-6 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] px-2"
        >
          Barbershop de clasă<br className="sm:hidden" /> pentru Gentlemen adevărati
        </h1>

        <p
          className="text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 
          drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] leading-relaxed px-2"
        >
          Programează-te și experimentează rafinamentul și precizia unui look perfect,
          adaptat stilului tău.
        </p>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/barbers"
          className="inline-block bg-[#d4af37] text-black font-semibold py-3 sm:py-4 px-8 
          rounded-md text-sm sm:text-base hover:bg-transparent hover:text-[#d4af37] 
          border border-[#d4af37] transition duration-300 shadow-lg hover:shadow-[#d4af37]/30
          w-[80%] sm:w-auto"
        >
          Programează-te acum
        </motion.a>
      </motion.div>

      {/* 🧩 Footer fix jos */}
      <div className="mt-16 sm:mt-24 w-full">
        <Footer />
      </div>
    </section>
  );
}
