import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative h-[90vh] flex items-center justify-center text-center text-white overflow-hidden"
    >
      {/* Fundal imagine */}
      <img
        src="https://images.unsplash.com/photo-1605497787868-3b1c1c2d5b69?auto=format&fit=crop&w=1920&q=80"
        alt="Barbershop Background"
        className="absolute inset-0 w-full h-full object-cover brightness-[.45]"
      />

      {/* Overlay negru subtil */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />

      {/* Conținut animat */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 px-6 max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-[#d4af37] mb-6">
          Barbershop de clasă pentru Gentlemen adevărați
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-10">
          Programează-te și experimentează rafinamentul și precizia unui look perfect.
        </p>
        <a
          href="/booking"
          className="inline-block px-8 py-3 bg-[#d4af37] text-black font-semibold rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition duration-300"
        >
          Programează-te acum
        </a>
      </motion.div>
    </section>
  );
}
