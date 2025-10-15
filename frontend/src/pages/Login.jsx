import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [telefon, setTelefon] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [isAdminPhone, setIsAdminPhone] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const navigate = useNavigate();

  // 🔸 Adminii definiți manual
  const admins = [
    { phone: "+37360000000", prenume: "Denis" },
    { phone: "076784211", prenume: "Danu" },
  ];
  const adminAccessCode = "7UVJ5tNnZYni8fQuazbvElFbZcXx9aTTkBaF1v";

  // ✅ Verificăm dacă userul e deja logat
  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("loggedUser")) ||
      JSON.parse(sessionStorage.getItem("loggedUser"));
    if (savedUser) {
      window.dispatchEvent(new Event("userUpdated"));
      navigate(savedUser.isAdmin ? "/dashboard" : "/");
    }
  }, [navigate]);

  // 🔍 Verificăm dacă e admin după număr
  useEffect(() => {
    const normalized = telefon.replace(/\s|-/g, "");
    const found = admins.find(
      (a) =>
        normalized.endsWith(a.phone) ||
        a.phone.endsWith(normalized) ||
        normalized === a.phone
    );
    setIsAdminPhone(!!found);
  }, [telefon]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!telefon.trim()) {
      setError("Introdu numărul de telefon!");
      return;
    }

    // 🔹 Dacă e admin
    const adminFound = admins.find(
      (a) =>
        telefon.endsWith(a.phone) ||
        a.phone.endsWith(telefon) ||
        telefon === a.phone
    );

    if (adminFound) {
      if (adminCode !== adminAccessCode) {
        setError("Cod de acces greșit pentru admin!");
        return;
      }

      const adminUser = {
        id: adminFound.phone === "+37360000000" ? 1 : 2,
        prenume: adminFound.prenume,
        nume: "Admin",
        telefon: adminFound.phone,
        isAdmin: true,
      };

      if (remember)
        localStorage.setItem("loggedUser", JSON.stringify(adminUser));
      else sessionStorage.setItem("loggedUser", JSON.stringify(adminUser));

      window.dispatchEvent(new Event("userUpdated"));
      alert(`👑 Bun venit, ${adminFound.prenume} (Admin)!`);
      navigate("/dashboard");
      return;
    }

    // 🔹 Altfel — client normal
    const formData = new FormData();
    formData.append("telefon", telefon);

    try {
      const res = await fetch(
        "http://localhost/barbershop/frontend/backend/api/login_client.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        const user = { ...data.user, isAdmin: false };
        if (remember)
          localStorage.setItem("loggedUser", JSON.stringify(user));
        else sessionStorage.setItem("loggedUser", JSON.stringify(user));

        window.dispatchEvent(new Event("userUpdated"));
        alert(`Bun venit, ${user.prenume} ${user.nume}!`);
        navigate("/");
      } else {
        setError(data.error || "Număr de telefon inexistent!");
      }
    } catch (err) {
      console.error(err);
      setError("Eroare la conexiunea cu serverul.");
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
          Autentificare
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
              placeholder="+37360000000 sau 076784211"
              className={`w-full bg-transparent border ${
                error
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#d4af37]/30 focus:border-[#d4af37]"
              } text-white rounded-md px-4 py-2 focus:outline-none transition`}
            />
          </div>

          {/* 🔑 Cod acces admin */}
          {isAdminPhone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm text-gray-300 mb-2">
                Cod de acces admin
              </label>
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Introdu codul secret"
                className={`w-full bg-transparent border ${
                  error
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#d4af37]/30 focus:border-[#d4af37]"
                } text-white rounded-md px-4 py-2 focus:outline-none transition`}
              />
            </motion.div>
          )}

          {error && <p className="text-red-500 text-xs">{error}</p>}

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
