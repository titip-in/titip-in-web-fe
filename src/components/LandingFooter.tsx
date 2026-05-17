import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import "../pages/landing/landing.css";

export function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Titip.in</span>
          <p className="footer-tagline">
            Platform jastip & preloved hyperlocal untuk warga Malang.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <div className="footer-col-title">Platform</div>
            <Link to="/landing">Beranda</Link>
            <Link to="/android">📱 Android App</Link>
            <Link to="/about">Tentang Kami</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Akun</div>
            <Link to="/login">Masuk</Link>
            <Link to="/register">Daftar Gratis</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Hubungi Kami</div>
            <a href="mailto:support@titipin.me">support@titipin.me</a>
            <a
              href="https://instagram.com/titipin.me"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Instagram size={13} /> @titipin.me
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Titip.in — Buat & Cari Jastip-Preloved dengan Mudah</p>
        </div>
      </div>
    </footer>
  );
}
