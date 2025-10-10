import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [telefon, setTelefon] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  // 🔧 normalizează numerele pentru comparație (acceptă +373 sau 0)
  const normalizePhone = (num) => {
    let clean = num.replace(/[\s()-]/g, "");
    if (/^0\d{8}$/.test(clean)) clean = "+373" + clean.substring(1);
    return clean;
  };

  // 📞 compară indiferent de format
  const phonesMatch = (a, b) => {
    const nA = normalizePhone(a);
    const nB = normalizePhone(b);
    return nA === nB || nA.slice(-8) === nB.slice(-8);
  };

  // 🧠 auto-login: dacă userul e deja logat, îl redirecționează automat
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("loggedUser"));
    const sessionUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    const activeUser = localUser || sessionUser;

    if (activeUser) {
      // trimitem semnal global pentru navbar
      window.dispatchEvent(new Event("userUpdated"));
      navigate("/"); // redirect instant
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!telefon.trim()) {
      setError("Introdu numărul de telefon.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => phonesMatch(u.telefon, telefon));

    if (user) {
      if (remember) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
      } else {
        sessionStorage.setItem("loggedUser", JSON.stringify(user));
      }

      window.dispatchEvent(new Event("userUpdated"));
      alert(`Bun venit, ${user.prenume} ${user.nume}!`);
      navigate("/");
    } else {
      setError("Număr de telefon inexistent!");
    }
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
          Autentificare Client
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Telefon */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Număr de telefon
            </label>
            <input
              type="tel"
              value={telefon}
              onChange={(e) => {
                setTelefon(e.target.value);
                setError("");
              }}
              placeholder="076784211 sau +37376784211"
              pattern="^(\+373\d{8}|0\d{8})$"
              title="Folosește formatul 076784211 sau +37376784211"
              className={`w-full bg-transparent border ${
                error
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#d4af37]/30 focus:border-[#d4af37]"
              } text-white rounded-md px-4 py-2 focus:outline-none transition`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-sm mt-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-[#d4af37] w-4 h-4"
              />
              <span className="text-gray-300">Ține-mă minte</span>
            </label>

            <a
              href="/register"
              className="text-[#d4af37] hover:underline transition"
            >
              Înregistrează-te
            </a>
          </div>

          {/* Buton Login */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full mt-5 bg-[#d4af37] text-black font-semibold py-3 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition duration-300"
          >
            Autentifică-te
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-8">
          © 2025 Denis Barbershop. Toate drepturile rezervate.
        </p>
      </motion.div>
    </section>
  );
}
