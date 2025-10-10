import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-[#d4af37] mb-10"
      >
        Contactează-ne
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-black/40 backdrop-blur-md border border-[#d4af37]/30 rounded-2xl p-8 max-w-lg w-full shadow-lg"
      >
        <p className="text-gray-300 mb-6 text-center">
          Ai întrebări sau vrei o programare rapidă? Ne poți suna sau scrie direct:
        </p>

        <div className="space-y-4 text-left">
          {/* Adresă */}
          <div className="flex items-center gap-3">
            <MapPin className="text-[#d4af37]" size={20} />
            <p>
              <span className="text-[#d4af37] font-semibold">Adresă:</span>{" "}
              Str. Independenței 15, Chișinău
            </p>
          </div>

          {/* Telefon */}
          <div className="flex items-center gap-3">
            <Phone className="text-[#d4af37]" size={20} />
            <p>
              <span className="text-[#d4af37] font-semibold">Telefon:</span>{" "}
              <a href="tel:+37376784211" className="hover:underline">
                +373 767 84211
              </a>
            </p>
          </div>

          {/* Program */}
          <div className="flex items-center gap-3">
            <Clock className="text-[#d4af37]" size={20} />
            <p>
              <span className="text-[#d4af37] font-semibold">Program:</span>{" "}
              Luni - Duminică, 09:00 - 18:00
            </p>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="text-[#d4af37]" size={20} />
            <p>
              <span className="text-[#d4af37] font-semibold">Email:</span>{" "}
              <a
                href="mailto:denisbarbershop@gmail.com"
                className="hover:underline"
              >
                denisbarbershop@gmail.com
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
