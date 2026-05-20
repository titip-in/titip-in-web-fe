import "../landing/landing.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Download,
  Star,
  Shield,
  Zap,
  Users,
  Package,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  MessageCircle,
} from "lucide-react";

const screenshots = [
  {
    src: "/screenshots/app-home.jpg",
    label: "Beranda",
    desc: "Dashboard lengkap semua aktivitas Jastip & Preloved kamu",
  },
  {
    src: "/screenshots/app-jastip.jpg",
    label: "Jastip",
    desc: "Cari atau buka jastip di sekitar Malang dengan mudah",
  },
  {
    src: "/screenshots/app-preloved.jpg",
    label: "Preloved",
    desc: "Jual & cari barang preloved dari sesama mahasiswa",
  },
  {
    src: "/screenshots/app-profile.jpg",
    label: "Profil",
    desc: "Kelola profil, listing, dan aktivitasmu dalam satu tempat",
  },
];

const features = [
  {
    icon: <Zap size={20} />,
    title: "Cepat & Ringan",
    desc: "Desain minimalis yang ringan, gak bikin HP lemot.",
    color: "icon-gold",
    bg: "feature-card-gold",
  },
  {
    icon: <Shield size={20} />,
    title: "Aman & Terpercaya",
    desc: "Semua user terverifikasi. Transaksi COD area kampus.",
    color: "icon-sage",
    bg: "feature-card-sage",
  },
  {
    icon: <Package size={20} />,
    title: "Jastip Hyperlokal",
    desc: "Jastip khusus Malang — dari Suhat sampai Sigura-gura.",
    color: "icon-terracotta",
    bg: "feature-card-terracotta",
  },
  {
    icon: <ShoppingBag size={20} />,
    title: "Preloved Kampus",
    desc: "Marketplace barang bekas mahasiswa, harga bersahabat.",
    color: "icon-sage",
    bg: "feature-card-sage",
  },
  {
    icon: <Users size={20} />,
    title: "Komunitas Malang",
    desc: "Ribuan mahasiswa aktif — dari UB, UM, POLINEMA & more.",
    color: "icon-purple",
    bg: "feature-card-purple",
  },
  {
    icon: <MessageCircle size={20} />,
    title: "WhatsApp Native",
    desc: "Langsung chat via WA — gak perlu daftar chat baru.",
    color: "icon-gold",
    bg: "feature-card-gold",
  },
];

import { LandingFooter } from "@/components/LandingFooter";

export default function AndroidPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [activeIdx]);

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIdx((p) => (p + 1) % screenshots.length);
      setIsAnimating(false);
    }, 200);
  };

  const goPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIdx((p) => (p - 1 + screenshots.length) % screenshots.length);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="landing-root">
      {/* ═══ NAVBAR (same as LandingPage) ═══ */}
      <nav className={`landing-nav${scrolled ? " nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <span className="brand-logo">Titip.in</span>
          </Link>

          <div className="nav-links-desktop">
            <Link to="/landing#fitur" className="nav-link">Fitur</Link>
            <Link to="/landing#cara-kerja" className="nav-link">Cara Kerja</Link>
            <Link to="/landing#pricing" className="nav-link">Harga & Plan</Link>
            <Link to="/about" className="nav-link">Tentang Kami</Link>
          </div>

          <div className="nav-actions">
            <Link to="/android" className="nav-btn-ghost" style={{ display: "flex", alignItems: "center", gap: "6px", border: "1.5px solid var(--charcoal-30)", borderRadius: "9999px" }}>
              <span>📱</span> Android
            </Link>
            <Link to="/login" className="nav-btn-ghost">Masuk</Link>
            <Link to="/register" className="nav-btn-cta">Daftar Gratis</Link>
          </div>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile nav */}
        {mobileNav && (
          <div className="nav-mobile-menu">
            <Link to="/landing#fitur" className="nav-link" onClick={() => setMobileNav(false)}>Fitur</Link>
            <Link to="/landing#cara-kerja" className="nav-link" onClick={() => setMobileNav(false)}>Cara Kerja</Link>
            <Link to="/landing#pricing" className="nav-link" onClick={() => setMobileNav(false)}>Harga & Plan</Link>
            <Link to="/about" className="nav-link" onClick={() => setMobileNav(false)}>Tentang Kami</Link>
            <div className="nav-mobile-actions">
              <Link to="/android" className="nav-btn-ghost" onClick={() => setMobileNav(false)} style={{ border: "1.5px solid var(--charcoal-30)", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "6px" }}>📱 Android App</Link>
              <Link to="/login" className="nav-btn-ghost" onClick={() => setMobileNav(false)}>Masuk</Link>
              <Link to="/register" className="nav-btn-cta" onClick={() => setMobileNav(false)}>Daftar Gratis</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section
        className="hero-section"
        style={{ minHeight: "100vh", paddingTop: "calc(72px + 60px)" }}
      >
        <div className="hero-deco hero-deco-1" />
        <div className="hero-deco hero-deco-2" />

        <div className="hero-inner" style={{ gap: "48px" }}>
          {/* Copy */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Android App — Beta Tersedia
            </div>

            <h1 className="hero-title" style={{ fontSize: "clamp(36px, 5vw, 56px)" }}>
              Titip.in{" "}
              <span className="hero-title-accent">di Genggamanmu</span>
            </h1>

            <p className="hero-subtitle">
              Jastip & Preloved hyperlokal buat mahasiswa Malang, kini hadir di Android. Satu app untuk titip, beli, jual — semua langsung via WhatsApp. Gak ribet. Gak muter-muter.
            </p>

            <div className="hero-ctas">
              <a
                href="https://titipin-api.bccdev.id/api/v1/download/android"
                className="hero-btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
              >
                <Download size={18} />
                Download APK Gratis
              </a>
              <Link to="/register" className="hero-btn-secondary">
                Coba Versi Web →
              </Link>
            </div>

            <div className="hero-trust">
              <div className="hero-trust-item">
                <Smartphone size={14} />
                <span>Android 8.0+</span>
              </div>
              <div className="hero-trust-divider" />
              <div className="hero-trust-item">
                <Zap size={14} />
                <span>Gratis selamanya</span>
              </div>
              <div className="hero-trust-divider" />
              <div className="hero-trust-item">
                <Star size={14} />
                <span>5.0 rating komunitas</span>
              </div>
            </div>
          </div>

          {/* Phone Mockup Carousel */}
          <div className="hero-visual" style={{ justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
              {/* Phone */}
              <div style={{ position: "relative" }}>
                <div style={{
                  background: "var(--charcoal)",
                  borderRadius: "44px",
                  padding: "12px",
                  boxShadow: "0 32px 80px rgba(26,26,24,0.25), 0 8px 24px rgba(26,26,24,0.1)",
                  width: "220px",
                  position: "relative",
                }}>
                  <div style={{
                    background: "#111",
                    borderRadius: "36px",
                    overflow: "hidden",
                    aspectRatio: "9/19.5",
                    position: "relative",
                  }}>
                    {/* Notch */}
                    <div style={{
                      position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)",
                      width: "70px", height: "18px", background: "#111", borderRadius: "9999px", zIndex: 10
                    }} />
                    <img
                      src={screenshots[activeIdx].src}
                      alt={screenshots[activeIdx].label}
                      style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        opacity: isAnimating ? 0 : 1,
                        transition: "opacity 0.2s ease",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={goPrev}
                  className="nav-btn-ghost"
                  style={{ padding: "8px", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--charcoal-10)" }}
                >
                  <ChevronLeft size={16} />
                </button>
                <div style={{ display: "flex", gap: "6px" }}>
                  {screenshots.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      style={{
                        width: i === activeIdx ? "24px" : "8px",
                        height: "8px",
                        borderRadius: "9999px",
                        background: i === activeIdx ? "var(--terracotta)" : "var(--charcoal-30)",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={goNext}
                  className="nav-btn-ghost"
                  style={{ padding: "8px", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--charcoal-10)" }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)" }}>{screenshots[activeIdx].label}</p>
                <p style={{ fontSize: "12px", color: "var(--charcoal-60)", marginTop: "2px", maxWidth: "220px" }}>{screenshots[activeIdx].desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SCREENSHOT STRIP ═══ */}
      <section className="stats-section" style={{ padding: "48px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="section-header" style={{ marginBottom: "32px" }}>
            <span className="section-eyebrow">Tampilan App</span>
            <h2 className="section-title">Lihat Sendiri</h2>
            <p className="section-desc">Desain bersih, navigasi intuitif — premium dari genggaman tangan.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {screenshots.map((s, i) => (
              <div
                key={i}
                onClick={() => setActiveIdx(i)}
                className="showcase-card"
                style={{
                  cursor: "pointer",
                  border: `2px solid ${i === activeIdx ? "var(--terracotta)" : "var(--cream-dark)"}`,
                  transform: i === activeIdx ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.2s",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <div className="showcase-img-wrap" style={{ aspectRatio: "9/19" }}>
                  <img src={s.src} alt={s.label} className="showcase-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="showcase-info">
                  <h3 className="showcase-title">{s.label}</h3>
                  <p className="showcase-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="features-section revealed" id="fitur">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Keunggulan App</span>
            <h2 className="section-title">Kenapa Download Titip.in?</h2>
            <p className="section-desc">
              Bukan cuma marketplace biasa. Ini komunitas sesama anak kos, dirancang khusus buat kebutuhan mahasiswa Malang.
            </p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className={`feature-card ${f.bg}`}>
                <div className={`feature-icon ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DOWNLOAD CTA ═══ */}
      <section className="cta-section revealed">
        <div className="cta-inner">
          <div className="cta-deco cta-deco-1" />
          <div className="cta-deco cta-deco-2" />
          <div className="cta-content">
            <div className="cta-icon-group">
              <Smartphone size={20} />
              <Download size={20} />
              <Star size={20} />
            </div>
            <h2 className="cta-title">
              Siap buat dicoba?
              <br />
              Download sekarang, gratis!
            </h2>
            <p className="cta-desc">
              Instal, daftar, dan langsung terhubung dengan komunitas mahasiswa Malang. Fitur lengkap tanpa biaya apapun.
            </p>
            <div className="cta-actions">
              <a
                href="https://titipin-api.bccdev.id/api/v1/download/android"
                className="cta-btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
              >
                <Download size={18} />
                Download APK Sekarang
              </a>
              <Link to="/register" className="cta-btn-secondary">
                Atau coba versi web →
              </Link>
            </div>
            <p style={{ fontSize: "11px", color: "var(--charcoal-30)", marginTop: "16px" }}>
              Membutuhkan Android 8.0+. Aktifkan "Install dari sumber tidak dikenal" di pengaturan.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <LandingFooter />
    </div>
  );
}
