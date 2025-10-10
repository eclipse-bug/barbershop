import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-black/80 border-t border-[#d4af37]/30 text-gray-400 text-center py-5 mt-auto relative overflow-hidden shadow-[0_-4px_12px_rgba(212,175,55,0.15)]"
    >
      {/* Linia aurie animată */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80"
      ></motion.div>

      {/* Efect de glow subtil */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-0 top-0 h-[2px] bg-[#d4af37] blur-md opacity-30"
      ></motion.div>

      {/* Text principal */}
      <p className="text-sm tracking-wide">
        © {new Date().getFullYear()}{" "}
        <span className="text-[#d4af37] font-medium">Denis Barbershop</span>.
        Toate drepturile rezervate.
      </p>

      {/* Subtext */}
      <p className="text-xs mt-1 opacity-70">
        Design & Development by{" "}
        <span className="text-[#d4af37] font-semibold">Brat</span>.
      </p>
    </motion.footer>
  );
}
