import { motion } from "framer-motion";
import { Scissors, Sparkles, SprayCan, Brush } from "lucide-react";

const services = [
  {
    icon: <Scissors size={36} />,
    title: "Tuns Clasic",
    desc: "Tuns profesional realizat cu atenție la detalii pentru un look elegant.",
    price: "150 MDL",
  },
  {
    icon: <Sparkles size={36} />,
    title: "Bărbierit Premium",
    desc: "Ritual complet de bărbierit cu prosoape calde și aftershave de calitate.",
    price: "120 MDL",
  },
  {
    icon: <SprayCan size={36} />,
    title: "Styling Modern",
    desc: "Fixare și aranjare folosind produse profesionale pentru un finisaj perfect.",
    price: "100 MDL",
  },
  {
    icon: <Brush size={36} />,
    title: "Îngrijire Barba",
    desc: "Contur, hidratare și formă personalizată pentru barba ta.",
    price: "80 MDL",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-[#0f0f0f]" id="servicii">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-[#d4af37] mb-12"
        >
          Serviciile Noastre
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-black/60 border border-[#d4af37]/20 hover:border-[#d4af37] rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div className="flex justify-center mb-4 text-[#d4af37]">{s.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-gray-400 mb-4">{s.desc}</p>
              <p className="text-[#d4af37] font-semibold">{s.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
