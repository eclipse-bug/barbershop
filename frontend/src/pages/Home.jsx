import { motion } from "framer-motion";
import bgImage from "../assets/barbershop.jpg";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center text-center relative text-white overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Fundal cu blur cinematic */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(0.6)",
          transform: "scale(1.05)", // evită marginile neclare
        }}
      ></div>

      {/* Overlay gradient elegant */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90"></div>

      {/* Conținut principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-6"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#d4af37] mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          Barbershop de clasă pentru Gentlemen adevărați
        </h1>

        <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          Programează-te și experimentează rafinamentul și precizia unui look perfect.
        </p>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/booking"
          className="inline-block bg-[#d4af37] text-black font-semibold py-3 px-6 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition duration-300 shadow-lg hover:shadow-[#d4af37]/30"
        >
          Programează-te acum
        </motion.a>
      </motion.div>
      <Footer />
    </section>
  );
}
