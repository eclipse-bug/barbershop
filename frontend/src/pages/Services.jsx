import { motion } from "framer-motion";

export default function Services() {
  const services = [
    { title: "Tuns Clasic", price: "150 MDL", desc: "Tuns profesional adaptat stilului tău." },
    { title: "Tuns + Barba", price: "250 MDL", desc: "Pachet complet cu styling și contur perfect." },
    { title: "Îngrijire Barba", price: "120 MDL", desc: "Conturare, tundere și hidratare a bărbii." },
    { title: "Spălat + Styling", price: "100 MDL", desc: "Spălat, masaj capilar și aranjare finală." },
  ];

  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-[#d4af37] mb-12"
      >
        Serviciile Noastre
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-6">
        {services.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-black/50 border border-[#d4af37]/30 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-[#d4af37] mb-2">{s.title}</h3>
            <p className="text-gray-400 mb-4">{s.desc}</p>
            <span className="block text-lg font-bold text-white">{s.price}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
