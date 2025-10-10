import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl text-center"
      >
        <h2 className="text-4xl font-bold text-[#d4af37] mb-6">Despre Noi</h2>
        <p className="text-gray-300 leading-relaxed text-lg mb-6">
          La <span className="text-[#d4af37] font-semibold">Denis Barbershop</span>, fiecare tuns
          este o experiență, nu doar un serviciu. Combinăm tehnica tradițională cu stilul modern
          pentru a oferi fiecărui client o imagine unică și elegantă.
        </p>
        <p className="text-gray-400">
          Echipa noastră este formată din profesioniști pasionați, dedicați să ofere cele mai bune
          servicii de grooming din oraș. Fie că vrei o schimbare de look sau o întreținere rapidă,
          te așteptăm cu vibe-ul perfect și atmosferă relaxantă.
        </p>
      </motion.div>
    </section>
  );
}
