import bgImage from "../assets/barbershop.jpg";

export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen w-full text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay pentru efect vizual */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px] -z-10"></div>

      {/* conținutul paginii */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
