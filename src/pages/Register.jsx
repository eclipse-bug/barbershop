import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ nume: "", prenume: "", telefon: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const normalizePhone = (num) => {
    let clean = num.replace(/[\s()-]/g, "");
    if (/^0\d{8}$/.test(clean)) {
      clean = "+373" + clean.substring(1);
    }
    return clean;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!form.nume.trim()) newErrors.nume = "Completează numele de familie.";
    if (!form.prenume.trim()) newErrors.prenume = "Completează prenumele.";
    if (!form.telefon.trim()) newErrors.telefon = "Introdu numărul de telefon.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const normalized = normalizePhone(form.telefon);
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // prevenim duplicate
    if (users.some((u) => u.telefon === normalized)) {
      alert("Acest număr este deja înregistrat!");
      return;
    }

    users.push({ ...form, telefon: normalized });
    localStorage.setItem("users", JSON.stringify(users));

    window.dispatchEvent(new Event("userUpdated"));
    alert(`Înregistrare reușită pentru ${form.prenume} ${form.nume}!`);
    navigate("/login");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/40 backdrop-blur-md border border-[#d4af37]/30 rounded-2xl p-10 w-full max-w-md shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-[#d4af37] mb-6">
          Înregistrare Client
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Nume (Familie)</label>
            <input
              type="text"
              name="nume"
              value={form.nume}
              onChange={handleChange}
              placeholder="Munteanu"
              className={`w-full bg-transparent border ${
                errors.nume ? "border-red-500" : "border-[#d4af37]/30"
              } text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#d4af37] transition`}
            />
            {errors.nume && <p className="text-red-500 text-xs mt-1">{errors.nume}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Prenume (Nume mic)</label>
            <input
              type="text"
              name="prenume"
              value={form.prenume}
              onChange={handleChange}
              placeholder="Denis"
              className={`w-full bg-transparent border ${
                errors.prenume ? "border-red-500" : "border-[#d4af37]/30"
              } text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#d4af37] transition`}
            />
            {errors.prenume && <p className="text-red-500 text-xs mt-1">{errors.prenume}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Număr de telefon</label>
            <input
              type="tel"
              name="telefon"
              value={form.telefon}
              onChange={handleChange}
              placeholder="076784211 sau +37376784211"
              pattern="^(\+373\d{8}|0\d{8})$"
              title="Folosește formatul 076784211 sau +37376784211"
              className={`w-full bg-transparent border ${
                errors.telefon ? "border-red-500" : "border-[#d4af37]/30"
              } text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#d4af37] transition`}
            />
            {errors.telefon && <p className="text-red-500 text-xs mt-1">{errors.telefon}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full mt-4 bg-[#d4af37] text-black font-semibold py-3 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition duration-300"
          >
            Înregistrează-te
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Ai deja cont?{" "}
          <a href="/login" className="text-[#d4af37] hover:underline">
            Autentifică-te aici
          </a>
        </p>
      </motion.div>
    </section>
  );
}
