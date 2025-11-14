import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Barbers() {
  const [barbers, setBarbers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/barbershop/backend/api/get_barbers.php")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBarbers(data);
      })
      .catch(() => setBarbers([]));
  }, []);

  const handleSelectBarber = (barber) => {
    localStorage.setItem("selectedBarber", JSON.stringify(barber));
    navigate("/booking");
  };

  return (
    <section className="min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden pb-24 md:pb-28">
      {/* ❌ Eliminat gradientul și efectele ambientale */}

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-center text-[#d4af37] mb-16 tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)] z-10"
      >
        Alege frizerul tău preferat
      </motion.h2>

      <div className="flex flex-wrap justify-center items-center gap-12 px-6 z-10 max-w-6xl">
        {barbers.map((barber) => (
          <motion.div
            key={barber.id}
            whileHover={{ scale: 1.08, rotateY: 4 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="group relative w-[320px] bg-gradient-to-br from-[#111] to-[#1f1f1f] rounded-3xl border border-[#d4af37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] overflow-hidden transform-gpu transition-all duration-300"
          >
            <div className="relative">
              <img
                src={`http://localhost/barbershop/backend/uploads/${barber.imagine || "default.jpg"}`}
                alt={barber.nume}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-5 left-0 right-0 text-center px-6">
                <h3 className="text-3xl font-semibold text-[#d4af37] tracking-wide drop-shadow-md">
                  {barber.nume}
                </h3>
              </div>
            </div>

            <div className="p-6 text-center">
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {barber.nume} oferă servicii premium și o experiență unică
                pentru fiecare client.
              </p>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectBarber(barber)}
                className="w-full py-3 bg-[#d4af37] text-black font-semibold rounded-xl hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.8)]"
              >
                Programează-te la mine
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
