import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ro } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ro", ro);

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [filterDate, setFilterDate] = useState(null);
  const [forcedBarberId, setForcedBarberId] = useState(null);

  const activeBarberId = forcedBarberId || user?.id || null;

  // --- Obținerea programărilor ---
  const fetchAppointments = async (barberId) => {
    if (!barberId) return setAppointments([]);

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const res = await fetch(baseUrl + "/get_barber_appointments.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barber_id: barberId }),
        cache: "no-store",
      });

      const data = await res.json();

      if (data?.success && Array.isArray(data.appointments)) {
        const sorted = data.appointments.sort(
          (a, b) =>
            new Date(`${a.date}T${a.time}`) -
            new Date(`${b.date}T${b.time}`)
        );
        setAppointments(sorted);
      } else {
        setAppointments([]);
      }
    } catch {
      setAppointments([]);
    }
  };

  // --- Obținerea zilelor libere ---
  const fetchHolidays = async (barberId) => {
    if (!barberId) return setHolidays([]);

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const res = await fetch(baseUrl + `/get_holidays.php?barber_id=${barberId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const data = await res.json();

      if (data?.success) {
        setHolidays(
          data.holidays
            .map((h) => (typeof h === "string" ? h : h?.date || null))
            .filter(Boolean)
        );
      } else {
        setHolidays([]);
      }
    } catch {
      setHolidays([]);
    }
  };

  // --- Inițializare utilizator ---
  useEffect(() => {
    const raw =
      localStorage.getItem("loggedUser") || sessionStorage.getItem("loggedUser");
    let stored;
    try {
      stored = raw ? JSON.parse(raw) : null;
    } catch {
      stored = null;
    }

    if (!stored) return;

    setUser(stored);
    const phoneNormalized = (stored.telefon || "").replace(/\D/g, "");

    if (phoneNormalized === "069225738") {
      setForcedBarberId(1); // Denis
      fetchAppointments(1);
      fetchHolidays(1);
    } else if (phoneNormalized === "060275874") {
      setForcedBarberId(2); // Danu
      fetchAppointments(2);
      fetchHolidays(2);
    } else if (stored.id) {
      fetchAppointments(stored.id);
      fetchHolidays(stored.id);
    }
  }, []);

  // --- Adăugare zi liberă ---
  const handleAddHoliday = async () => {
    if (!selectedHoliday) return setMessage("⚠ Selectează o dată din calendar!");
    if (!activeBarberId) return setMessage("⚠ Barber inexistent pentru salvare!");

    const year = selectedHoliday.getFullYear();
    const month = String(selectedHoliday.getMonth() + 1).padStart(2, "0");
    const day = String(selectedHoliday.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const res = await fetch(baseUrl + "/set_holiday.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barber_id: activeBarberId, date: dateStr }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("🌴 Ziua liberă a fost adăugată corect!");
        fetchHolidays(activeBarberId);
        setSelectedHoliday(null);
      } else setMessage(data.message || "⚠ Eroare la salvare!");
    } catch {
      setMessage("⚠ Eroare de conexiune!");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // --- Ștergere zi liberă ---
  const handleDeleteHoliday = async (date) => {
    if (!activeBarberId) return setMessage("⚠ Barber inexistent pentru ștergere!");
    if (!window.confirm("Ștergi această zi liberă?")) return;
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const res = await fetch(baseUrl + "/delete_holiday.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barber_id: activeBarberId, date }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("🗓️ Ziua liberă a fost eliminată!");
        fetchHolidays(activeBarberId);
      } else setMessage("⚠ Eroare la ștergere!");
    } catch {
      setMessage("⚠ Eroare de conexiune!");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // --- Ștergere programare ---
  const handleDelete = async (id) => {
    if (!window.confirm("Ești sigur că vrei să ștergi această programare?")) return;
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const res = await fetch(baseUrl + "/delete_appointment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        setMessage("🗑️ Programarea a fost ștearsă!");
      } else setMessage("⚠ Eroare la ștergere!");
    } catch {
      setMessage("⚠ Eroare de conexiune!");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // --- Filtrare ---
  const filteredAppointments = appointments.filter((a) => {
    const normalize = (str) => (str || "").toLowerCase().replace(/\s+/g, "").trim();
    const term = normalize(search);
    const match =
      normalize(a.client_nume || "").includes(term) ||
      normalize(a.client_prenume || "").includes(term) ||
      normalize(a.client_telefon || "").includes(term) ||
      normalize(a.service || "").includes(term);
    if (filterDate) {
      const year = filterDate.getFullYear();
      const month = String(filterDate.getMonth() + 1).padStart(2, "0");
      const day = String(filterDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      return a.date === dateStr && match;
    }
    return match;
  });

  const displayName = user?.prenume || "Frizer";

  if (!user?.id)
    return (
      <section className="bg-[#0f0f0f] text-white p-6 flex justify-center items-center min-h-[60vh]">
        <p className="text-center text-red-400 text-sm sm:text-base">
          Nu ești autentificat. Te rog să te reconectezi pentru a accesa panoul.
        </p>
      </section>
    );

  return (
    <>
      <style>{`
        .react-datepicker-popper {
          z-index: 9999 !important;
          transform: translate(0px, 50px) !important;
        }
        .react-datepicker-popper[data-placement^="bottom"] {
          padding-top: 10px;
        }
      `}</style>
      
      <section className="text-white px-3 py-6 md:px-6 lg:px-10 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl bg-black/40 border border-[#d4af37]/40 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl overflow-hidden pb-28"
        >
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#d4af37] mb-6 text-center">
            Dashboard — {displayName}
          </h1>

          {/* 🌴 Zile libere / Concediu */}
          <div className="mb-8 bg-[#1a1a1a]/60 border border-[#d4af37]/30 rounded-xl p-4 md:p-6 text-center">
            <h2 className="text-lg md:text-xl font-semibold text-[#d4af37] mb-4">
              Zile libere / Concediu
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5 w-full z-50">
              <div className="relative w-full sm:w-auto flex items-center justify-center">
                <DatePicker
                  selected={selectedHoliday}
                  onChange={(date) => setSelectedHoliday(date)}
                  locale="ro"
                  dateFormat="dd.MM.yyyy"
                  minDate={new Date()}
                  placeholderText="Alege o dată..."
                  className="w-full bg-[#0f0f0f] border border-[#d4af37]/60 rounded-lg px-4 py-2 md:px-5 md:py-3 text-[#d4af37] text-center leading-none focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 text-sm md:text-base placeholder-gray-500"
                  popperPlacement="top"
                  popperClassName="z-[9999]"
                />
                <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37] w-5 h-5 pointer-events-none" />
              </div>

              <button
                onClick={handleAddHoliday}
                className="w-full md:w-auto bg-[#d4af37] text-black font-semibold px-5 md:px-6 py-2 md:py-3 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition duration-300 shadow-md text-sm md:text-base"
              >
                Salvează concediul
              </button>
            </div>

            {holidays.length > 0 && (
              <ul className="mt-5 text-center text-xs md:text-sm text-gray-300 flex flex-wrap justify-center gap-2 md:gap-3">
                {holidays.map((h, i) => (
                  <li
                    key={i}
                    className="bg-[#222]/60 px-3 py-1.5 rounded-md flex items-center gap-2 border border-[#d4af37]/20"
                  >
                    <span className="text-[#d4af37]">{h}</span>
                    <button
                      onClick={() => handleDeleteHoliday(h)}
                      className="text-red-400 hover:text-red-500 text-base leading-none"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 🔍 Căutare + Filtru Dată */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 w-full">
            <input
              type="text"
              placeholder="Caută client, serviciu sau telefon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 bg-[#1a1a1a] border border-[#d4af37]/40 text-[#d4af37] placeholder-gray-500 rounded-md px-4 py-2 text-center leading-none text-sm md:text-base focus:border-[#d4af37] focus:outline-none"
            />

            <div className="relative w-full sm:w-auto">
              <DatePicker
                selected={filterDate}
                onChange={(date) => setFilterDate(date)}
                locale="ro"
                dateFormat="dd.MM.yyyy"
                placeholderText="Alege data..."
                customInput={
                  <button
                    type="button"
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm md:text-base transition-all duration-300 border-2 ${
                      filterDate
                        ? "bg-[#d4af37] text-black border-[#d4af37] hover:bg-[#d4af37]/90"
                        : "bg-transparent text-[#d4af37] border-[#d4af37]/60 hover:border-[#d4af37] hover:bg-[#d4af37]/10"
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    {filterDate
                      ? `${filterDate.getDate().toString().padStart(2, "0")}.${(
                          filterDate.getMonth() + 1
                        )
                          .toString()
                          .padStart(2, "0")}.${filterDate.getFullYear()}`
                      : "Filtrează după dată"}
                  </button>
                }
                popperPlacement="bottom"
              />
              {filterDate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterDate(null);
                  }}
                  className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition shadow-lg z-10"
                  title="Șterge filtrul"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 📅 Lista programărilor */}
          {filteredAppointments.length === 0 ? (
            <p className="text-center text-gray-400 text-sm md:text-base mb-10">
              Nu s-au găsit programări pentru filtrul selectat.
            </p>
          ) : (
            <div className="overflow-y-auto max-h-[65vh] rounded-lg border border-[#d4af37]/30 shadow-inner mb-10">
              <table className="w-full text-[11px] sm:text-sm md:text-base border-collapse">
                <thead className="bg-[#1a1a1a] text-[#d4af37] sticky top-0 z-10">
                  <tr>
                    <th className="p-2 md:p-4">#</th>
                    <th className="p-2 md:p-4">Client</th>
                    <th className="p-2 md:p-4">Telefon</th>
                    <th className="p-2 md:p-4">Serviciu</th>
                    <th className="p-2 md:p-4">Data</th>
                    <th className="p-2 md:p-4">Ora</th>
                    <th className="p-2 md:p-4">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((a, i) => (
                    <tr key={a.id} className="hover:bg-[#d4af37]/10 transition text-center">
                      <td className="p-2 md:p-4">{i + 1}</td>
                      <td className="p-2 md:p-4">
                        {a.client_prenume} {a.client_nume}
                      </td>
                      <td className="p-2 md:p-4">{a.client_telefon}</td>
                      <td className="p-2 md:p-4">{a.service}</td>
                      <td className="p-2 md:p-4">{a.date}</td>
                      <td className="p-2 md:p-4">{a.time}</td>
                      <td className="p-2 md:p-4">
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="text-red-500 hover:text-red-400 hover:underline text-sm transition"
                        >
                          Șterge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {message && (
            <p className="text-center text-sm mt-2 text-[#d4af37]">{message}</p>
          )}
        </motion.div>
      </section>
    </>
  );
}