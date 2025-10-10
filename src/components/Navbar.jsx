import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔁 Ascultăm modificările userului fără refresh
  useEffect(() => {
    const updateUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
      setUser(storedUser);
    };

    // citire imediată la montare
    updateUser();

    // ascultă evenimentul custom "userUpdated" și eventul nativ 'storage'
    window.addEventListener("userUpdated", updateUser);
    window.addEventListener("storage", updateUser);

    // cleanup
    return () => {
      window.removeEventListener("userUpdated", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
    window.dispatchEvent(new Event("userUpdated")); // trimitem semnal către toate componentele
    alert("Te-ai delogat cu succes!");
    navigate("/login");
  };

  // ✅ Definim criteriile pentru Admin
  const isAdmin =
    user &&
    (
      user.telefon === "+37360000000" ||
      user.telefon === "076784211" ||
      user.prenume?.toLowerCase() === "denis"
    );

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-md bg-black/70 border-b border-[#d4af37]/30 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-semibold text-[#d4af37] tracking-wide cursor-pointer select-none"
        >
          Denis <span className="text-white">Barbershop</span>
        </h1>

        {/* Meniu principal */}
        <div className="space-x-6 text-sm font-medium hidden md:block">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-[#d4af37]"
                : "text-gray-300 hover:text-[#d4af37] transition"
            }
          >
            Acasă
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive
                ? "text-[#d4af37]"
                : "text-gray-300 hover:text-[#d4af37] transition"
            }
          >
            Servicii
          </NavLink>
          <NavLink
            to="/booking"
            className={({ isActive }) =>
              isActive
                ? "text-[#d4af37]"
                : "text-gray-300 hover:text-[#d4af37] transition"
            }
          >
            Programări
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-[#d4af37]"
                : "text-gray-300 hover:text-[#d4af37] transition"
            }
          >
            Despre noi
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-[#d4af37]"
                : "text-gray-300 hover:text-[#d4af37] transition"
            }
          >
            Contact
          </NavLink>

          {/* ✅ Dashboard vizibil doar pentru Admin */}
          {isAdmin && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-[#d4af37]"
                  : "text-gray-300 hover:text-[#d4af37] transition"
              }
            >
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Dreapta: utilizator logat / nelogat */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-[#d4af37] font-medium">
                  Salut,{" "}
                  <NavLink
                    to="/profile"
                    className="underline-offset-4 hover:underline"
                  >
                    {user.prenume}
                  </NavLink>
                </span>

                {/* 🔰 Badge Admin */}
                {isAdmin && (
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="text-xs bg-[#d4af37] text-black font-semibold px-2 py-[2px] rounded-full uppercase tracking-wide"
                  >
                    Admin
                  </motion.span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-gray-300 hover:text-[#d4af37] transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 rounded-md border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
