import {useState, useEffect} from "react";
import {motion} from "framer-motion";
import {CalendarDays, Clock, Scissors} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ro} from "date-fns/locale";

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
    const [selectedBarber, setSelectedBarber] = useState(null);

    const SLOT_MIN = 35;
    const baseUrl = process.env.REACT_APP_BASE_URL;

    // 🟡 pauza dintre 13:00–14:00
    const inBreak = (t) => t >= "13:00" && t < "14:00";

    // 🟡 funcție pentru +X minute
    const addMinutes = (t, m) => {
        const [h, min] = t.split(":").map(Number);
        const total = h * 60 + min + m;
        const H = String(Math.floor(total / 60)).padStart(2, "0");
        const M = String(total % 60).toString().padStart(2, "0");
        return `${H}:${M}`;
    };

    // 🟡 generăm intervalele orare
    const generateTimes = (name = "") => {
        const list = [];
        let start = 8 * 60;
        const interval = name.toLowerCase().includes("denis") ? 40 : SLOT_MIN;
        while (start < 20 * 60) {
            const h = Math.floor(start / 60).toString().padStart(2, "0");
            const m = (start % 60).toString().padStart(2, "0");
            const t = `${h}:${m}`;
            if (!inBreak(t)) list.push(t);
            start += interval;
        }
        return list;
    };

    const [availableTimes, setAvailableTimes] = useState(generateTimes());

    // 🔥 PRESELECTARE FRIZER DIN LOCALSTORAGE
    useEffect(() => {
        try {
            const stored = localStorage.getItem("selectedBarber");
            if (stored) {
                const barber = JSON.parse(stored);
                setSelectedBarber(barber);
                setForm((prev) => ({
                    ...prev,
                    barber_id: barber.id,
                }));
            }
        } catch {
        }
    }, []);

    // 🔥 user logat
    useEffect(() => {
        const stored =
            JSON.parse(localStorage.getItem("loggedUser")) ||
            JSON.parse(sessionStorage.getItem("loggedUser"));
        setUser(stored);
    }, []);

    // 🔥 lista frizerilor
    useEffect(() => {
        fetch(baseUrl + "/get_barbers.php")
            .then((r) => r.json())
            .then((d) => Array.isArray(d.data) && setBarbers(d.data))
            .catch(() => setBarbers([]));
    }, []);

    // 🔥 adaptăm intervalele pe frizer
    useEffect(() => {
        const barber = barbers.find((b) => String(b.id) === String(form.barber_id));
        if (barber) setAvailableTimes(generateTimes(barber.nume || ""));
    }, [form.barber_id, barbers]);

    // 🔥 zile libere
    useEffect(() => {
        if (!form.barber_id) return;
        fetch(baseUrl + `/get_holidays.php?barber_id=${form.barber_id}`)
            .then((r) => r.json())
            .then((d) => {
                if (Array.isArray(d?.holidays))
                    setHolidays(d.holidays.map((x) => (typeof x === "string" ? x : x.date)));
            })
            .catch(() => setHolidays([]));
    }, [form.barber_id]);

    // 🔥 ore ocupate
    useEffect(() => {
        if (!form.barber_id || !form.date) return;
        fetch(
            baseUrl +
            `/get_booked_times.php?barber_id=${form.barber_id}&date=${form.date}`
        )
            .then((r) => r.json())
            .then((d) => setBookedTimes((d || []).map((x) => x.substring(0, 5))))
            .catch(() => setBookedTimes([]));
    }, [form.barber_id, form.date]);

    const isHoliday = holidays.includes(form.date);

    const handleDateChange = (date) => {
        if (!date) return;
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        setForm((p) => ({...p, date: local.toISOString().split("T")[0]}));
    };

    const handleTimeChange = (value) => {
        setForm((p) => ({...p, time: value}));
    };

    const isTimeSelectable = (t) => {
        if (bookedTimes.includes(t) || inBreak(t)) return false;
        const barber = barbers.find((b) => String(b.id) === String(form.barber_id));
        const interval = barber?.nume?.toLowerCase().includes("denis") ? 40 : SLOT_MIN;

        // 🔥 CRITICAL FIX: Only check double booking for Danu (barber_id = 2) when service is "Tuns + Barbă"
        if (form.service === "Tuns + Barbă" && String(form.barber_id) === "2") {
            const next = addMinutes(t, interval);
            if (bookedTimes.includes(next)) return false;
        }
        return true;
    };

    // 🔥 trimiterea formularului
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isHoliday) return setMessage("Frizerul este în concediu în această zi.");

        const {nume, telefon, service, barber_id, date, time} = form;

        if (!barber_id || !service || !date || !time)
            return setMessage("⚠ Completează toate câmpurile!");

        if (!user && (!nume.trim() || !telefon.trim()))
            return setMessage("⚠ Introdu numele și numărul de telefon!");

        const fd = new FormData();
        fd.append("nume", nume || `${user?.prenume} ${user?.nume}`);
        fd.append("telefon", telefon || user?.telefon);
        fd.append("service", service);
        fd.append("date", date);
        fd.append("time", time);
        fd.append("barber_id", barber_id);

        const barber = barbers.find((b) => String(b.id) === String(barber_id));
        const interval = barber?.nume?.toLowerCase().includes("denis") ? 40 : SLOT_MIN;

        // 🔥 CRITICAL FIX: Only send extra_time for Danu (barber_id = 2) when service is "Tuns + Barbă"
        if (service === "Tuns + Barbă" && String(barber_id) === "2") {
            const next = addMinutes(time, interval);
            fd.append("extra_time", next);
        }

        const res = await fetch(baseUrl + "/book_appointment.php", {
            method: "POST",
            body: fd,
        });

        const data = await res.json();
        setMessage(data.success ? data.message : data.error || "Eroare necunoscută");
    };

    return (
        <section className="min-h-screen flex items-center justify-center text-white">
            <motion.div
                initial={{opacity: 0, y: 40}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                className="bg-black/50 border border-[#d4af37]/40 rounded-2xl p-8 w-full max-w-md shadow-lg mb-20"
            >
                <h2 className="text-3xl font-bold text-center text-[#d4af37] mb-6">
                    Programează-te la tuns
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 🔥 NUME & TELEFON DACĂ NU E LOGAT */}
                    {!user && (
                        <>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Nume</label>
                                <input
                                    type="text"
                                    value={form.nume}
                                    onChange={(e) => setForm({...form, nume: e.target.value})}
                                    placeholder="Ex: Dumitru"
                                    className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-gray-200 focus:border-[#d4af37]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Telefon</label>
                                <input
                                    type="tel"
                                    value={form.telefon}
                                    onChange={(e) => setForm({...form, telefon: e.target.value})}
                                    placeholder="060000000"
                                    className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-gray-200 focus:border-[#d4af37]"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* 🔥 SERVICIU */}
                    <select
                        name="service"
                        value={form.service}
                        onChange={(e) => setForm({...form, service: e.target.value})}
                        className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-gray-200 focus:border-[#d4af37] appearance-none"
                        required
                    >
                        <option value="">Selectează serviciul</option>
                        <option value="Tuns">Tuns</option>
                        <option value="Tuns + Barbă">Tuns + Barbă</option>
                        <option value="Barbă">Barbă</option>
                    </select>

                    {/* 🔥 SELECTARE FRIZER - CU PRESELECTARE */}
                    <div className="relative flex items-center">
                        <select
                            name="barber_id"
                            value={form.barber_id}
                            onChange={(e) => setForm({...form, barber_id: e.target.value})}
                            className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-gray-200 focus:border-[#d4af37] appearance-none"
                            required
                        >
                            <option value="">Selectează frizerul</option>
                            {barbers.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.nume}
                                </option>
                            ))}
                        </select>
                        <Scissors
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37] w-5 h-5 pointer-events-none"/>
                    </div>

                    {/* 🔥 DATA + ORA */}
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <DatePicker
                                selected={form.date ? new Date(form.date) : null}
                                onChange={handleDateChange}
                                locale={ro}
                                dateFormat="dd.MM.yyyy"
                                minDate={new Date()}
                                placeholderText="Alege data"
                                calendarStartDay={1}
                                className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-[#d4af37] appearance-none"
                            />
                            <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37] w-5 h-5"/>
                        </div>

                        <div className="relative flex-1">
                            <select
                                name="time"
                                value={form.time}
                                onChange={(e) => handleTimeChange(e.target.value)}
                                disabled={isHoliday}
                                className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-white disabled:text-gray-500 appearance-none"
                                required
                            >
                                <option value="">Ora...</option>
                                {availableTimes.map((t) => (
                                    <option
                                        key={t}
                                        value={t}
                                        disabled={!isTimeSelectable(t)}
                                        className={bookedTimes.includes(t) ? "text-gray-500" : ""}
                                    >
                                        {t} {bookedTimes.includes(t) ? "(ocupat)" : ""}
                                    </option>
                                ))}
                            </select>
                            <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37] w-5 h-5"/>
                        </div>
                    </div>

                    {isHoliday && (
                        <p className="text-red-400 text-sm text-center">
                            Frizerul este în concediu în această zi.
                        </p>
                    )}

                    {/* 🔥 BUTON */}
                    <button
                        type="submit"
                        disabled={isHoliday}
                        className={`w-full font-semibold py-3 rounded-md border transition ${
                            isHoliday
                                ? "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed"
                                : "bg-[#d4af37] text-black hover:bg-transparent hover:text-[#d4af37] border-[#d4af37]"
                        }`}
                    >
                        {isHoliday ? "Zile libere" : "Programează-te"}
                    </button>
                </form>

                {/* 🔥 MESAJ */}
                {message && (
                    <p
                        className={`mt-4 text-center text-sm ${
                            message.includes("succes") ? "text-green-400" : "text-red-400"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </motion.div>
        </section>
    );
}