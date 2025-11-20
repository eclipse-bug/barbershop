import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scissors, Clock, BadgeDollarSign } from "lucide-react";

export default function Services() {
  const [services, setServices] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetch(baseUrl + "/get_services.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          console.error("Invalid API response:", data);
          setServices([]);
        }
      })
      .catch((err) => {
        console.error("Eroare API:", err);
        setServices([]);
      });
  }, [baseUrl]);

  return (
    <section className="min-h-screen px-6 py-16 flex flex-col items-center text-white relative">
      {/* Titlu */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-extrabold text-[#d4af37] mb-12 drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]"
      >
        Serviciile Noastre
      </motion.h1>

      {/* Carduri de servicii */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
        {services.map((s, index) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="relative bg-black/40 backdrop-blur-md border border-[#d4af37]/30 rounded-2xl shadow-lg hover:shadow-[#d4af37]/40 transition-all duration-300 p-6 flex flex-col justify-between"
          >
            {/* Pictogramă */}
            <div className="absolute -top-5 left-6 bg-[#d4af37] p-2 rounded-full shadow-md shadow-black/40">
              <Scissors className="text-black w-5 h-5" />
            </div>

            {/* Conținut principal */}
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-[#d4af37] mb-2">
                {s.name}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {s.description || "Serviciu profesional oferit de experții noștri."}
              </p>
            </div>

            {/* Informații detalii */}
            <div className="flex items-center justify-between text-sm text-gray-200 mt-auto border-t border-[#d4af37]/30 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>{s.duration} min</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeDollarSign className="w-4 h-4 text-[#d4af37]" />
                <span>{s.price} lei</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Linie animată aurie la final */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-32 h-[2px] bg-[#d4af37] mt-16"
      ></motion.div>
    </section>
  );
}
