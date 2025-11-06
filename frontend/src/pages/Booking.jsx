import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Scissors } from "lucide-react";

export default function Booking() {
  const [form, setForm] = useState({
    nume: "",
    telefon: "",
    service: "",
    barber_id: "",
    date: "",
    time: "",
  });
  const [user, setUser] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [message, setMessage] = useState("");
  const dateRef = useRef(null);

  // ==== TIMP ====
  const SLOT_MIN = 35; // 35 minute / slot

  const addMinutes = (hhmm, minutes) => {
    if (!hhmm) return null;
    const [h, m] = hhmm.split(":").map(Number);
    const total = h * 60 + m + minutes;
    if (total < 0 || total >= 24 * 60) return null;
    const H = String(Math.floor(total / 60)).padStart(2, "0");
    const M = String(total % 60).padStart(2, "0");
    return `${H}:${M}`;
  };

  const inBreak = (hhmm) => hhmm >= "13:00" && hhmm < "14:00";

  // ✅ orele exacte pentru Denis (după poză)
  const denisSchedule = [
    "08:00",
    "08:30",
    "09:00",
    "09:35",
    "10:10",
    "10:45",
    "11:20",
    "11:55",
    "12:30",
    "14:15",
    "14:50",
    "15:25",
    "16:00",
    "16:35",
    "17:10",
    "17:45",
    "18:20",
  ];

  // 🔹 orar general (sau Denis dacă e selectat)
  const generateTimes = () => {
    // caută frizerul selectat în listă
    const selectedBarber = barbers.find(
      (b) => String(b.id) === String(form.barber_id)
    );

    // dacă numele conține "denis", returnăm orarul special
    if (selectedBarber && selectedBarber.nume?.toLowerCase().includes("denis")) {
      return denisSchedule;
    }

    // altfel, orarul standard din 35 în 35 minute
    const times = [];
    let start = 8 * 60; // 08:00
    const end = 20 * 60; // 20:00
    while (start <= end) {
      const h = Math.floor(start / 60).toString().padStart(2, "0");
      const m = (start % 60).toString().padStart(2, "0");
      const t = `${h}:${m}`;
      if (!inBreak(t)) times.push(t);
      start += SLOT_MIN;
    }
    return times;
  };

  const allTimes = generateTimes();

  // ==== USER LOGAT ====
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("loggedUser")) ||
      JSON.parse(sessionStorage.getItem("loggedUser"));
    setUser(stored);
  }, []);

  // ==== BARBER PRESELECTAT DIN /barbers ====
  useEffect(() => {
    const selectedBarber = JSON.parse(localStorage.getItem("selectedBarber"));
    if (selectedBarber) {
      setForm((prev) => ({ ...prev, barber_id: selectedBarber.id }));
      localStorage.removeItem("selectedBarber");
    }
  }, []);

  // ==== ÎNCARCĂ FRIZERII ====
  useEffect(() => {
    fetch("http://localhost/barbershop/backend/api/get_barbers.php")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBarbers(data);
      })
      .catch(() => setBarbers([]));
  }, []);

  // ==== ZILE LIBERE ALE FRIZERULUI ====
  useEffect(() => {
    if (form.barber_id) {
      fetch(
        `http://localhost/barbershop/backend/api/get_holidays.php?barber_id=${form.barber_id}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setHolidays(data);
        })
        .catch(() => setHolidays([]));
    }
  }, [form.barber_id]);

  // ==== ORE OCUPATE PENTRU DATA+FRIZER ====
  useEffect(() => {
    if (form.date && form.barber_id) {
      fetch(
        `http://localhost/barbershop/backend/api/get_booked_times.php?date=${form.date}&barber_id=${form.barber_id}`
      )
        .then((res) => res.json())
        .then((data) => {
          const normalized = (data || []).map((t) => t.substring(0, 5));
          setBookedTimes(normalized);
        })
        .catch(() => setBookedTimes([]));
    } else {
      setBookedTimes([]);
    }
  }, [form.date, form.barber_id]);

  const isHoliday = holidays.includes(form.date);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const needsDoubleSlot = form.service === "Tuns + Barbă";

  const isTimeSelectable = (t) => {
    const booked = bookedTimes.includes(t);
    if (booked) return false;
    if (inBreak(t)) return false;

    if (needsDoubleSlot) {
      const next = addMinutes(t, SLOT_MIN);
      if (!next) return false;
      if (inBreak(next)) return false;
      if (bookedTimes.includes(next)) return false;
      if (!allTimes.includes(next)) return false;
    }
    return true;
  };

  // ==== SUBMIT ====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { nume, telefon, service, barber_id, date, time } = form;

    if (!service || !barber_id || !date || !time) {
      setMessage("⚠ Completează toate câmpurile!");
      return;
    }
    if (!user && (!nume || !telefon)) {
      setMessage("⚠ Completează numele și telefonul!");
      return;
    }
    if (isHoliday) {
      setMessage("Frizerul este în concediu în această zi.");
      return;
    }

    const next = needsDoubleSlot ? addMinutes(time, SLOT_MIN) : null;
    if (needsDoubleSlot) {
      if (!next) {
        setMessage("⚠ Nu există slotul următor disponibil pentru acest serviciu.");
        return;
      }
      if (inBreak(time) || inBreak(next)) {
        setMessage("⚠ Programarea nu poate fi peste pauza 13:00–14:00.");
        return;
      }
      if (!allTimes.includes(next)) {
        setMessage("⚠ Slotul următor iese din programul zilnic.");
        return;
      }
      if (bookedTimes.includes(time) || bookedTimes.includes(next)) {
        setMessage("⚠ Ai ales o oră fără două sloturi consecutive libere.");
        return;
      }
    }

    const makeFormData = (clock) => {
      const fd = new FormData();
      fd.append("barber_id", barber_id);
      fd.append("service", service);
      fd.append("date", date);
      fd.append("time", clock);
      if (user) {
        fd.append("client_id", user.id);
        fd.append("nume", `${user.prenume} ${user.nume}`);
        fd.append("telefon", user.telefon);
      } else {
        fd.append("client_id", 0);
        fd.append("nume", nume);
        fd.append("telefon", telefon);
      }
      return fd;
    };

    try {
      const res1 = await fetch(
        "http://localhost/barbershop/backend/api/book_appointment.php",
        { method: "POST", body: makeFormData(time) }
      );
      const data1 = await res1.json();
      if (!data1?.success) {
        setMessage(data1?.error || "⚠ Eroare la rezervarea primului slot.");
        return;
      }

      if (needsDoubleSlot && next) {
        const res2 = await fetch(
          "http://localhost/barbershop/backend/api/book_appointment.php",
          { method: "POST", body: makeFormData(next) }
        );
        const data2 = await res2.json();
        if (!data2?.success) {
          setMessage(
            data2?.error ||
              "⚠ Primul slot a fost rezervat, dar al doilea nu a putut fi blocat."
          );
          setBookedTimes((prev) => Array.from(new Set([...prev, time])));
          return;
        }
      }

      setBookedTimes((prev) =>
        needsDoubleSlot && next
          ? Array.from(new Set([...prev, time, next]))
          : Array.from(new Set([...prev, time]))
      );

      setMessage("✅ Programarea a fost înregistrată cu succes!");
      setForm({
        nume: "",
        telefon: "",
        service: "",
        barber_id: "",
        date: "",
        time: "",
      });
    } catch (err) {
      setMessage("⚠ Eroare la conexiunea cu serverul!");
    }
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
          {user ? (
            <div className="text-sm text-gray-300 mb-3 text-center">
              Client:{" "}
              <span className="text-[#d4af37] font-semibold">
                {user.prenume} {user.nume}
              </span>{" "}
              ({user.telefon})
            </div>
          ) : (
            <>
              <input
                type="text"
                name="nume"
                placeholder="Numele tău complet"
                value={form.nume}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-gray-200 focus:border-[#d4af37] transition text-base"
                required
              />
              <input
                type="tel"
                name="telefon"
                placeholder="Număr de telefon"
                value={form.telefon}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-gray-200 focus:border-[#d4af37] transition text-base"
                required
              />
            </>
          )}

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

          <div className="relative flex items-center">
            <select
              name="barber_id"
              value={form.barber_id}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-gray-200 focus:border-[#d4af37] transition text-base appearance-none"
              required
            >
              <option value="">— selectează frizerul —</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nume} — {b.specializare}
                </option>
              ))}
            </select>
            <Scissors className="absolute right-3 text-[#d4af37] w-5 h-5 pointer-events-none" />
          </div>

          <div className="flex gap-3 items-center justify-between">
            <div className="relative flex-1 flex items-center group">
              <input
                ref={dateRef}
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                disabled={isHoliday}
                className={`w-full bg-gradient-to-br from-[#111] to-[#1f1f1f] border rounded-md px-4 py-2 pr-10 text-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition text-base ${
                  isHoliday
                    ? "border-red-500 text-red-400 cursor-not-allowed"
                    : "border-[#d4af37]/50"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => dateRef.current?.showPicker?.()}
                disabled={isHoliday}
                className={`absolute right-3 ${
                  isHoliday ? "text-red-500" : "text-[#d4af37]"
                } hover:text-yellow-400 transition`}
              >
                <CalendarDays className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center">
              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                disabled={isHoliday}
                className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 pr-10 text-gray-200 focus:border-[#d4af37] transition text-base appearance-none disabled:text-gray-500 disabled:cursor-not-allowed"
                required
              >
                <option value="">HH:MM</option>
                {allTimes.map((t) => {
                  const disabled = !isTimeSelectable(t);
                  return (
                    <option
                      key={t}
                      value={t}
                      disabled={disabled}
                      className={
                        disabled
                          ? "text-gray-500 bg-[#111]/70 cursor-not-allowed"
                          : "text-[#d4af37]"
                      }
                    >
                      {t}
                      {bookedTimes.includes(t)
                        ? " (ocupat)"
                        : needsDoubleSlot && disabled
                        ? " (nu sunt 2 sloturi libere)"
                        : ""}
                    </option>
                  );
                })}
              </select>
              <Clock className="absolute right-3 text-[#d4af37] w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {isHoliday && (
            <p className="text-red-400 text-sm text-center mt-2">
              Frizerul este în concediu în această zi. Alege altă dată.
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isHoliday}
            className={`w-full mt-4 font-semibold py-3 rounded-md border transition ${
              isHoliday
                ? "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed"
                : "bg-[#d4af37] text-black hover:bg-transparent hover:text-[#d4af37] border-[#d4af37]"
            }`}
          >
            {isHoliday ? "Zile libere" : "Programează-te acum"}
          </motion.button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("succes") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-3 text-center text-xs text-gray-400">
          Pauză zilnică: 13:00–14:00 (nu se fac programări).
        </p>
      </motion.div>
    </section>
  );
}
