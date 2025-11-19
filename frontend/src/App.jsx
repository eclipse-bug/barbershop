import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Barbers from "./pages/Barbers";
import bgImage from "./assets/barbershop.jpg";

// 🔒 doar adminii
const AdminRoute = ({ children }) => {
  const rawUser =
    localStorage.getItem("loggedUser") || sessionStorage.getItem("loggedUser");
  if (!rawUser || rawUser === "undefined" || rawUser === "null")
    return <Navigate to="/" />;

  try {
    const user = JSON.parse(rawUser);
    if (user?.isAdmin) return children;
  } catch {}
  return <Navigate to="/" />;
};

// 🚫 oprit accesul la login pentru admin deja logat
const GuestRoute = ({ children }) => {
  const rawUser =
    localStorage.getItem("loggedUser") || sessionStorage.getItem("loggedUser");
  if (!rawUser || rawUser === "undefined" || rawUser === "null") return children;

  try {
    const user = JSON.parse(rawUser);
    if (user?.isAdmin) return <Navigate to="/dashboard" />;
  } catch {}
  return children;
};

export default function App() {
  return (
    <Router>
      <div
        className="relative min-h-screen text-white"
        style={{
  backgroundImage: `url(${bgImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
}}

      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"></div>

        <Navbar />

        <main className="relative z-10 pt-20 pb-20 px-2 sm:px-4 md:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/barbers" element={<Barbers />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
