import { motion } from "framer-motion";

export default function QuickBooking() {
  return (
    <section className="py-24 bg-[#0f0f0f]" id="booking">
      <div className="max-w-3xl mx-auto text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-[#d4af37] mb-12"
        >
          Programează-te Rapid
        </motion.h2>

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/50 backdrop-blur-md border border-[#d4af37]/20 rounded-2xl p-8 shadow-lg space-y-6"
        >
          <div className="flex flex-col">
            <label className="text-left text-gray-300 mb-2">Nume complet</label>
            <input
              type="text"
              placeholder="Ex: Denis Popescu"
              className="bg-transparent border border-[#d4af37]/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#d4af37] transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-left text-gray-300 mb-2">Data</label>
              <input
                type="date"
                className="bg-transparent border border-[#d4af37]/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#d4af37] transition"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-left text-gray-300 mb-2">Ora</label>
              <input
                type="time"
                className="bg-transparent border border-[#d4af37]/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#d4af37] transition"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 bg-[#d4af37] text-black font-semibold py-3 px-10 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition duration-300"
          >
            Rezervă locul
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
