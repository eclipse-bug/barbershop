import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const hour = new Date().getHours();
  const isOpen = hour >= 8 && hour < 20;

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-black/90 border-t border-[#d4af37]/30 text-gray-300 text-sm fixed bottom-0 left-0 z-50"
    >
      {/* Linie aurie animată sus */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
      ></motion.div>

      {/* Conținut compact */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-3">
        {/* Stânga - informații */}
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-[#d4af37]" />
            <span>Chișinău, str. Bărbaților nr. 7</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={15} className="text-[#d4af37]" />
            <a
              href="tel:+37376784211"
              className="hover:text-[#d4af37] transition"
            >
              +373 692 25 738
            </a>
          </div>  

          <div className="flex items-center gap-2">
            <Clock size={15} className="text-[#d4af37]" />
            <motion.span
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`font-semibold ${
                isOpen ? "text-green-400" : "text-red-500"
              }`}
            >
              {isOpen ? "Deschis acum" : "Închis - deschidem la 8:00"}
            </motion.span>
          </div>
        </div>

        {/* Dreapta - drepturi */}
        <div className="text-xs text-gray-400 text-center md:text-right">
          © {currentYear}{" "}
          <span className="text-[#d4af37] font-medium">Denis Barbershop</span>{" "}
          • Design & Development by{" "}
          <span className="text-[#d4af37] font-semibold">A.M & B.D</span>
        </div>
      </div>

      {/* Glow subtil aurie */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/10 via-transparent to-transparent blur-3xl"
      ></motion.div>
    </motion.footer>
  );
}
