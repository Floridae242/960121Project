import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import WorkshopsSection from "@/components/WorkshopsSection";
import FinalCTASection from "@/components/FinalCTASection";
import ContactSection from "@/components/ContactSection";

function Footer() {
  return (
    <footer style={{
      background: "var(--wm-footer-bg)",
      padding: "28px 48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <span style={{ fontSize: "15px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
        แป้งละออง<span style={{ color: "var(--wm-red)" }}>.</span>
      </span>
      <span style={{ fontSize: "12px", color: "#555" }}>
        © 2026 Pang-La-Ong · All rights reserved.
      </span>
    </footer>
  );
}

export default function Home() {
  return (
    <div style={{ background: "var(--wm-bg)" }}>
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <WorkshopsSection />
      <FinalCTASection />
      <ContactSection />
      <Footer />
    </div>
  );
}
