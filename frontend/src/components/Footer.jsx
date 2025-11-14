import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const hour = new Date().getHours();
  const isOpen = hour >= 8 && hour < 18; // Deschis între 8:00 și 18:00

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      // 🔹 Footer fix, mai compact pe mobil
      className="w-full bg-black/90 border-t border-[#d4af37]/30 text-gray-300 text-xs sm:text-sm fixed bottom-0 left-0 z-50 py-2 sm:py-3 md:py-4"
    >
      {/* Linie aurie animată sus */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
      ></motion.div>

      {/* Conținut compact */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-3 sm:px-6 gap-2 sm:gap-3">
        {/* Informații principale */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center md:text-left">
          <div className="flex items-center justify-center gap-1.5">
            <MapPin size={14} className="text-[#d4af37]" />
            <span>Chișinău, str. Bărbaților nr. 7</span>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <Phone size={14} className="text-[#d4af37]" />
            <a
              href="tel:+37376784211"
              className="hover:text-[#d4af37] transition"
            >
              +373 692 25 738
            </a>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <Clock size={14} className="text-[#d4af37]" />
            <motion.span
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`font-semibold ${
                isOpen ? "text-green-400" : "text-red-500"
              }`}
            >
              {isOpen ? "Deschis acum" : "Închis"}
            </motion.span>
          </div>
        </div>

        {/* Drepturi / Copyright */}
        <div className="text-[10px] sm:text-xs text-gray-400 text-center md:text-right leading-tight">
          © {currentYear}{" "}
          <span className="text-[#d4af37] font-medium">Denis Barbershop</span>{" "}
          • by{" "}
          <span className="text-[#d4af37] font-semibold">A.M & B.D</span>
        </div>
      </div>

      {/* Glow subtil aurie */}
      <motion.div
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/10 via-transparent to-transparent blur-2xl pointer-events-none"
      ></motion.div>
    </motion.footer>
  );
}
