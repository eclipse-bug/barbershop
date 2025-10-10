import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";

export default function Booking() {
  const [form, setForm] = useState({
    nume: "",
    prenume: "",
    telefon: "",
    service: "",
    date: "",
    time: "",
  });

  const [bookedTimes, setBookedTimes] = useState([]); // ✅ ore ocupate
  const dateRef = useRef(null);

  // ore între 08:00 - 20:00 din 40 în 40 min
  const generateTimes = () => {
    const times = [];
    let start = 8 * 60;
    const end = 20 * 60;
    while (start <= end) {
      const h = Math.floor(start / 60).toString().padStart(2, "0");
      const m = (start % 60).toString().padStart(2, "0");
      times.push(`${h}:${m}`);
      start += 40;
    }
    return times;
  };

  const timeSlots = generateTimes();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (user) {
      setForm((prev) => ({
        ...prev,
        nume: user.nume || "",
        prenume: user.prenume || "",
        telefon: user.telefon || "",
      }));
    }
  }, []);

  // 🔄 când se schimbă data, încărcăm orele ocupate pentru acea zi
  useEffect(() => {
    if (form.date) {
      const [year, month, day] = form.date.split("-");
      const formattedDate = `${month}/${day}/${year}`;
      const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const sameDay = allBookings.filter((b) => b.date === formattedDate);
      setBookedTimes(sameDay.map((b) => b.time));
    } else {
      setBookedTimes([]);
    }
  }, [form.date]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const [year, month, day] = form.date.split("-");
    const formattedDate = `${month}/${day}/${year}`;

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push({ ...form, date: formattedDate });
    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert("✅ Programarea a fost înregistrată cu succes!");
    setForm((prev) => ({ ...prev, service: "", date: "", time: "" }));
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/50 backdrop-blur-md border border-[#d4af37]/40 rounded-2xl p-10 w-full max-w-md shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-[#d4af37] mb-6">
          Programează-te la tuns
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 🔒 Date luate din profil */}
          <input
            type="text"
            name="nume"
            value={form.nume}
            disabled
            className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-[#b8a96f] cursor-not-allowed select-none text-base"
          />
          <input
            type="text"
            name="prenume"
            value={form.prenume}
            disabled
            className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-[#b8a96f] cursor-not-allowed select-none text-base"
          />
          <input
            type="tel"
            name="telefon"
            value={form.telefon}
            disabled
            className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-[#b8a96f] cursor-not-allowed select-none text-base"
          />

          {/* 🧴 Select servicii */}
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:border-[#d4af37] hover:border-[#d4af37] transition text-base"
            required
          >
            <option value="">— selectează serviciul —</option>
            <option value="Tuns">Tuns</option>
            <option value="Tuns + Barbă">Tuns + Barbă</option>
            <option value="Barbă">Barbă</option>
            <option value="Spălat + Coafat">Spălat + Coafat</option>
          </select>

          {/* 📅 Data + ⏰ Ora */}
          <div className="flex gap-3 items-center justify-between">
            {/* Data */}
            <div className="relative flex-1 flex items-center">
              <input
                ref={dateRef}
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 pr-10 text-gray-200 focus:border-[#d4af37] transition text-base"
                required
              />
              <button
                type="button"
                onClick={() => dateRef.current.showPicker()}
                className="absolute right-3 text-[#d4af37] hover:text-yellow-400 transition"
              >
                <CalendarDays className="w-5 h-5" />
              </button>
            </div>

            {/* Ora */}
            <div className="relative flex-1 flex items-center">
              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 pr-10 text-gray-200 focus:border-[#d4af37] transition text-base appearance-none"
                required
              >
                <option value="">HH:MM</option>
                {timeSlots.map((t) => {
                  const isBooked = bookedTimes.includes(t);
                  return (
                    <option
                      key={t}
                      value={isBooked ? "" : t}
                      disabled={isBooked}
                      className={`bg-[#1a1a1a] ${
                        isBooked ? "text-gray-500 line-through" : "text-[#d4af37]"
                      }`}
                    >
                      {t}
                    </option>
                  );
                })}
              </select>
              <Clock className="absolute right-3 text-[#d4af37] w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Buton */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full mt-4 bg-[#d4af37] text-black font-semibold py-3 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition"
          >
            Programează-te acum
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
