import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Barbers() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    console.log("Fetching barbers from:", baseUrl + "/get_barbers.php");
    
    fetch(baseUrl + "/get_barbers.php")
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        
        // ✅ FIX: Verificăm structura corectă a răspunsului
        if (data.success && Array.isArray(data.data)) {
          console.log("Barbers found:", data.data.length);
          setBarbers(data.data);
        } else if (Array.isArray(data)) {
          // Fallback dacă API-ul returnează direct array-ul
          console.log("Barbers found (direct array):", data.length);
          setBarbers(data);
        } else {
          console.error("Invalid data structure:", data);
          setError("Format invalid de date primit de la server");
          setBarbers([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Nu s-au putut încărca frizerii. Verifică conexiunea.");
        setBarbers([]);
        setLoading(false);
      });
  }, [baseUrl]);

  const handleSelectBarber = (barber) => {
    console.log("Selected barber:", barber);
    localStorage.setItem("selectedBarber", JSON.stringify(barber));
    navigate("/booking");
  };

  if (loading) {
    return (
      <section className="min-h-screen text-white flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full"
        />
        <p className="mt-4 text-gray-400">Se încarcă frizerii...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen text-white flex flex-col items-center justify-center px-6">
        <p className="text-red-400 text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#d4af37] text-black font-semibold rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition"
        >
          Reîncearcă
        </button>
      </section>
    );
  }

  if (barbers.length === 0) {
    return (
      <section className="min-h-screen text-white flex flex-col items-center justify-center px-6">
        <p className="text-gray-400 text-center mb-4">
          Nu sunt frizeri disponibili momentan.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-[#d4af37] text-black font-semibold rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition"
        >
          Înapoi la pagina principală
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden pb-24 md:pb-28">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-center text-[#d4af37] mb-16 tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)] z-10"
      >
        Alege frizerul tău preferat
      </motion.h2>

      <div className="flex flex-wrap justify-center items-center gap-12 px-6 z-10 max-w-6xl">
        {barbers.map((barber, index) => (
          <motion.div
            key={barber.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.08, rotateY: 4 }}
            className="group relative w-[320px] bg-gradient-to-br from-[#111] to-[#1f1f1f] rounded-3xl border border-[#d4af37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] overflow-hidden transform-gpu transition-all duration-300"
          >
            <div className="relative">
              {/* ✅ FIX: Imagine placeholder sau din server */}
              <div className="w-full h-80 bg-gradient-to-br from-[#d4af37]/20 to-[#222] flex items-center justify-center relative overflow-hidden">
                {barber.imagine ? (
                  <img
                    src={barber.imagine}
                    alt={barber.nume}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ display: barber.imagine ? 'none' : 'flex' }}
                >
                  <span className="text-[#d4af37] text-6xl font-bold opacity-30">
                    {barber.nume.charAt(0)}
                  </span>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-5 left-0 right-0 text-center px-6">
                <h3 className="text-3xl font-semibold text-[#d4af37] tracking-wide drop-shadow-md">
                  {barber.nume}
                </h3>
                {barber.specializare && (
                  <p className="text-gray-300 text-sm mt-2">
                    {barber.specializare}
                  </p>
                )}
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