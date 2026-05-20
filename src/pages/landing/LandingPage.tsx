import "./landing.css";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  RefreshCw,
  MessageCircle,
  Shield,
  UserPlus,
  Compass,
  Send,
  ArrowRight,
  ChevronDown,
  Package,
  ShoppingBag,
  Users,
  Star,
  MapPin,
  Zap,
  Instagram,
} from "lucide-react";
import { LandingFooter } from "@/components/LandingFooter";

/* ─────────────────────────────────────────────
   Animated counter hook
   ───────────────────────────────────────────── */
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ─────────────────────────────────────────────
   Scroll-based reveal hook
   ───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ─────────────────────────────────────────────
   LANDING PAGE
   ───────────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stat1 = useCountUp(100);
  const stat2 = useCountUp(50);
  const stat3 = useCountUp(500);

  const featuresReveal = useReveal();
  const howReveal = useReveal();
  const showcaseReveal = useReveal();
  const ctaReveal = useReveal();

  return (
    <div className="landing-root">
      {/* ═══ NAVBAR ═══ */}
      <nav className={`landing-nav${scrolled ? " nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <span className="brand-logo">Titip.in</span>
          </Link>

          <div className="nav-links-desktop">
            <a href="#fitur" className="nav-link">Fitur</a>
            <a href="#cara-kerja" className="nav-link">Cara Kerja</a>
            <a href="#pricing" className="nav-link">Harga & Plan</a>
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
            <a href="#fitur" className="nav-link" onClick={() => setMobileNav(false)}>Fitur</a>
            <a href="#cara-kerja" className="nav-link" onClick={() => setMobileNav(false)}>Cara Kerja</a>
            <a href="#pricing" className="nav-link" onClick={() => setMobileNav(false)}>Harga & Plan</a>
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
      <section className="hero-section">
        {/* Decorative elements */}
        <div className="hero-deco hero-deco-1" />
        <div className="hero-deco hero-deco-2" />
        <div className="hero-deco hero-deco-3" />

        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Platform Aktif — Malang Area
            </div>

            <h1 className="hero-title">
              Jastip & Preloved,{" "}
              <span className="hero-title-accent">Satu Platform</span>{" "}
              untuk Warga Malang
            </h1>

            <p className="hero-subtitle">
              Platform hyperlocal yang menghubungkan warga Malang untuk jasa titip dan barang preloved.
              Temukan, posting, dan langsung hubungi via WhatsApp — tanpa ribet.
            </p>

            <div className="hero-ctas">
              <Link to="/register" className="hero-btn-primary">
                Mulai Sekarang
                <ArrowRight size={18} />
              </Link>
              <a href="#fitur" className="hero-btn-secondary">
                Lihat Fitur
                <ChevronDown size={18} />
              </a>
            </div>

            <div className="hero-trust">
              <div className="hero-trust-item">
                <Zap size={14} />
                <span>Gratis selamanya</span>
              </div>
              <div className="hero-trust-divider" />
              <div className="hero-trust-item">
                <MapPin size={14} />
                <span>Khusus area Malang</span>
              </div>
              <div className="hero-trust-divider" />
              <div className="hero-trust-item">
                <MessageCircle size={14} />
                <span>Chat langsung via WA</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-mockup-browser">
              <div className="mockup-bar">
                <div className="mockup-dots">
                  <span style={{ background: "#FF6058" }} />
                  <span style={{ background: "#FFBD2E" }} />
                  <span style={{ background: "#28CA42" }} />
                </div>
                <div className="mockup-url">titip.in/beranda</div>
              </div>
              <div className="mockup-screen">
                <img
                  src="/screenshot-home.png"
                  alt="Titip.in Dashboard"
                  className="mockup-img"
                />
              </div>
            </div>
            {/* Floating cards */}
            <div className="hero-float-card float-card-1">
              <Package size={18} className="float-icon" />
              <div>
                <div className="float-label">Jastip Aktif</div>
                <div className="float-value">12 rute tersedia</div>
              </div>
            </div>
            <div className="hero-float-card float-card-2">
              <ShoppingBag size={18} className="float-icon" />
              <div>
                <div className="float-label">Preloved</div>
                <div className="float-value">50+ barang</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="stats-section">
        <div className="stats-inner">
          <div className="stat-item" ref={stat1.ref}>
            <div className="stat-number">{stat1.count}%</div>
            <div className="stat-desc">Gratis untuk semua fitur dasar</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item" ref={stat2.ref}>
            <div className="stat-number">{stat2.count}+</div>
            <div className="stat-desc">Listing aktif setiap minggu</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item" ref={stat3.ref}>
            <div className="stat-number">{stat3.count}+</div>
            <div className="stat-desc">Pengguna terhubung via WhatsApp</div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section
        className={`features-section${featuresReveal.visible ? " revealed" : ""}`}
        id="fitur"
        ref={featuresReveal.ref}
      >
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Fitur Unggulan</span>
            <h2 className="section-title">Kenapa Titip.in?</h2>
            <p className="section-desc">
              Satu platform yang menyatukan semua kebutuhan jastip dan preloved warga Malang — terstruktur, terpercaya, dan langsung terhubung.
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: <Search size={24} />,
                color: "sage",
                title: "Terpusat & Terstruktur",
                desc: "Semua informasi jastip dan preloved di satu tempat. Tidak perlu scroll grup WA yang sudah tenggelam.",
              },
              {
                icon: <RefreshCw size={24} />,
                color: "terracotta",
                title: "Dua Arah — Post & Request",
                desc: "Buka jastip atau minta dititipin. Jual barang atau cari barang. Kamu yang tentukan peranmu.",
              },
              {
                icon: <MessageCircle size={24} />,
                color: "gold",
                title: "Langsung via WhatsApp",
                desc: "Tanpa chat in-app yang ribet. Klik tombol, pesan pre-filled langsung terkirim ke WhatsApp.",
              },
              {
                icon: <Shield size={24} />,
                color: "purple",
                title: "Trust Layer",
                desc: "Profil pengguna, sistem rating, dan badge verified untuk keamanan transaksi antar pengguna.",
              },
            ].map((f, i) => (
              <div key={i} className={`feature-card feature-card-${f.color}`}>
                <div className={`feature-icon icon-${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section
        className={`how-section${howReveal.visible ? " revealed" : ""}`}
        id="cara-kerja"
        ref={howReveal.ref}
      >
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Mulai dalam 3 Langkah</span>
            <h2 className="section-title">Cara Kerjanya</h2>
            <p className="section-desc">
              Dari daftar hingga terhubung — prosesnya semudah pesan makanan online.
            </p>
          </div>

          <div className="how-steps">
            {[
              {
                num: "01",
                icon: <UserPlus size={28} />,
                title: "Daftar Gratis",
                desc: "Buat akun dalam 30 detik. Cukup nama, email, dan nomor WhatsApp.",
              },
              {
                num: "02",
                icon: <Compass size={28} />,
                title: "Jelajahi & Temukan",
                desc: "Browse jastip aktif, preloved murah, atau posting kebutuhanmu sendiri.",
              },
              {
                num: "03",
                icon: <Send size={28} />,
                title: "Hubungi via WhatsApp",
                desc: "Klik tombol WhatsApp, pesan pre-filled langsung dikirim. Deal selesai!",
              },
            ].map((step, i) => (
              <div key={i} className="how-step">
                <div className="how-step-num">{step.num}</div>
                <div className="how-step-icon">{step.icon}</div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.desc}</p>
                {i < 2 && <div className="how-step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ APP SHOWCASE ═══ */}
      <section
        className={`showcase-section${showcaseReveal.visible ? " revealed" : ""}`}
        id="showcase"
        ref={showcaseReveal.ref}
      >
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Lihat Langsung</span>
            <h2 className="section-title">Titip.in Sudah Hadir!</h2>
            <p className="section-desc">
              Buat dan Cari Jastip-Preloved mu Sekarang!.
            </p>
          </div>

          <div className="showcase-grid">
            {[
              {
                img: "/screenshot-home.png",
                title: "Home Dashboard",
                desc: "Bento grid dengan statistik real-time, jastip aktif, dan aksi cepat.",
              },
              {
                img: "/screenshot-jastip.png",
                title: "Listing Jastip",
                desc: "Daftar jastip aktif dengan filter kategori dan detail rute lengkap.",
              },
              {
                img: "/screenshot-preloved.png",
                title: "Preloved Marketplace",
                desc: "Grid barang preloved dengan foto asli, harga, dan kategori terstruktur.",
              },
            ].map((item, i) => (
              <div key={i} className="showcase-card">
                <div className="showcase-img-wrap">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="showcase-img"
                    loading="lazy"
                  />
                </div>
                <div className="showcase-info">
                  <h3 className="showcase-title">{item.title}</h3>
                  <p className="showcase-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING PLANS ═══ */}
      <section className="how-section revealed" id="pricing" style={{ background: "var(--cream-dark)", borderTop: "1.5px solid var(--border-subtle)", borderBottom: "1.5px solid var(--border-subtle)", padding: "100px 0" }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Pilihan Keanggotaan</span>
            <h2 className="section-title">Temukan Plan Terbaikmu</h2>
            <p className="section-desc">
              Gabung dengan komunitas jastip & preloved hyperlokal Malang. Pilih plan yang sesuai dengan intensitas aktivitasmu.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", maxWidth: "1000px", margin: "0 auto", alignItems: "stretch" }}>
            {[
              {
                title: "Titip Basic",
                price: "Rp 0",
                period: "selamanya",
                desc: "Cocok untuk mahasiswa yang sesekali ingin mencari jastip atau menjual barang bekas.",
                features: [
                  "Maksimal 3 item aktif",
                  "1 foto per listing",
                  "Hubungi pemilik via WhatsApp",
                  "Bebas biaya platform"
                ],
                cta: "Daftar Gratis",
                popular: false,
                color: "var(--charcoal-60)",
                badge: null
              },
              {
                title: "Titip Plus",
                price: "Rp 10.000",
                period: "/ bulan",
                desc: "Pilihan terbaik untuk mahasiswa aktif belanja & jastip rutin di area Malang.",
                features: [
                  "Maksimal 10 item aktif",
                  "Hingga 3 foto per listing",
                  "Badge premium 'Plus' di profil & listing",
                  "1 kuota Boost listing tiap bulan",
                  "Akses dashboard analitik klik WhatsApp"
                ],
                cta: "Mulai Titip Plus",
                popular: true,
                color: "var(--terracotta)",
                badge: "Terpopuler"
              },
              {
                title: "Titip Pro",
                price: "Rp 25.000",
                period: "/ bulan",
                desc: "Maksimalkan penjualan barang preloved dan kelola banyak rute jastip sekaligus.",
                features: [
                  "Maksimal 20 item aktif",
                  "Hingga 5 foto per listing",
                  "Badge eksklusif 'Pro' di profil & listing",
                  "5 kuota Boost listing tiap bulan",
                  "Analitik konversi & listing terlaris",
                  "Prioritas pencarian (Top Result)"
                ],
                cta: "Gabung Pro Sekarang",
                popular: false,
                color: "var(--gold-dark)",
                badge: "Fitur Terlengkap"
              }
            ].map((plan, i) => (
              <div 
                key={i} 
                style={{
                  background: "white",
                  border: plan.popular ? "2px solid var(--terracotta)" : "1.5px solid var(--border-subtle)",
                  borderRadius: "24px",
                  padding: "36px 28px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: plan.popular ? "0 20px 40px rgba(193,100,72,0.12)" : "var(--shadow-sm)",
                  transform: plan.popular ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.3s"
                }}
              >
                {plan.badge && (
                  <span style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: plan.popular ? "var(--terracotta)" : "var(--charcoal)",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    padding: "4px 12px",
                    borderRadius: "9999px"
                  }}>
                    {plan.badge}
                  </span>
                )}
                
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 500, color: "var(--charcoal)", marginBottom: "8px", marginTop: "4px" }}>
                  {plan.title}
                </h3>
                
                <p style={{ fontSize: "13px", color: "var(--charcoal-60)", minHeight: "40px", marginBottom: "20px", lineHeight: "1.5" }}>
                  {plan.desc}
                </p>
                
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "24px" }}>
                  <span style={{ fontSize: "32px", fontWeight: 700, color: "var(--charcoal)" }}>{plan.price}</span>
                  <span style={{ fontSize: "14px", color: "var(--charcoal-60)" }}>{plan.period}</span>
                </div>
                
                <div style={{ flex: 1, marginBottom: "32px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--charcoal-40)", marginBottom: "12px" }}>
                    FASILITAS:
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {plan.features.map((feat, fi) => (
                      <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--charcoal-80)", lineHeight: "1.4" }}>
                        <span style={{ color: plan.color, fontSize: "14px", fontWeight: 700 }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link 
                  to="/register" 
                  style={{
                    display: "block",
                    textAlign: "center",
                    background: plan.popular ? "var(--terracotta)" : "var(--charcoal)",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s"
                  }}
                  className="hover:opacity-90"
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ANDROID APP BANNER ═══ */}
      <section style={{ padding: "0 32px 80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, var(--charcoal) 0%, #2d2d2a 100%)",
            borderRadius: "24px",
            padding: "48px 48px",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "48px",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative blobs */}
            <div style={{ position: "absolute", top: "-40px", right: "200px", width: "200px", height: "200px", background: "var(--terracotta)", borderRadius: "50%", opacity: 0.08, filter: "blur(40px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-30px", right: "80px", width: "150px", height: "150px", background: "var(--sage)", borderRadius: "50%", opacity: 0.1, filter: "blur(30px)", pointerEvents: "none" }} />

            {/* Text */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "9999px", padding: "6px 14px",
                fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
                color: "var(--terracotta)", marginBottom: "20px",
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--terracotta)", display: "inline-block", animation: "pulse 2s infinite" }} />
                Tersedia di Android
              </div>

              <h2 style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 36px)",
                fontStyle: "italic", fontWeight: 400, color: "var(--cream)",
                marginBottom: "12px", lineHeight: 1.2,
              }}>
                Bawa Titip.in ke mana pun kamu pergi
              </h2>
              <p style={{ fontSize: "15px", color: "rgba(245,242,236,0.55)", lineHeight: 1.7, maxWidth: "480px", marginBottom: "28px" }}>
                App Android native dengan desain premium — lebih cepat, lebih nyaman, dan langsung ada di home screen HP kamu. Download gratis sekarang.
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <Link
                  to="/android"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "var(--terracotta)", color: "white",
                    padding: "12px 28px", borderRadius: "9999px",
                    fontSize: "14px", fontWeight: 600, textDecoration: "none",
                    transition: "all 0.2s", boxShadow: "0 4px 20px rgba(193,100,72,0.35)",
                  }}
                >
                  📱 Lihat & Download App
                </Link>
                <span style={{ fontSize: "13px", color: "rgba(245,242,236,0.35)" }}>
                  Android 8.0+ · Gratis
                </span>
              </div>
            </div>

            {/* Phone previews */}
            <div style={{ display: "flex", gap: "12px", position: "relative", zIndex: 1 }}>
              {["/screenshots/app-home.jpg", "/screenshots/app-jastip.jpg"].map((src, i) => (
                <div key={i} style={{
                  width: "100px",
                  background: "var(--charcoal)",
                  borderRadius: "20px",
                  padding: "5px",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                  transform: i === 0 ? "rotate(-4deg) translateY(8px)" : "rotate(3deg) translateY(-8px)",
                  flexShrink: 0,
                }}>
                  <div style={{ borderRadius: "15px", overflow: "hidden", aspectRatio: "9/19.5" }}>
                    <img src={src} alt="App screenshot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT US BANNER ═══ */}
      <section style={{ padding: "0 32px 80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            background: "var(--cream-dark)",
            border: "1.5px solid var(--border-subtle)",
            borderRadius: "24px",
            padding: "48px 48px",
            display: "grid",
            gap: "48px",
            alignItems: "center",
          }} className="about-us-grid-responsive">
            <div>
              <span className="section-eyebrow" style={{ color: "var(--terracotta)", fontWeight: 600 }}>TENTANG KAMI</span>
              <h2 style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)",
                fontStyle: "italic", fontWeight: 400, color: "var(--charcoal)",
                marginTop: "12px", marginBottom: "20px", lineHeight: 1.2,
              }}>
                Lahir dari Kosan,<br />Tumbuh bersama Mahasiswa Malang
              </h2>
              <p style={{ fontSize: "15px", color: "var(--charcoal-60)", lineHeight: 1.7, marginBottom: "28px" }}>
                Titip.in berawal dari sebuah keresahan sederhana di kosan daerah Suhat. Kami lelah melihat informasi jastip dan preloved yang tenggelam di ribuan chat grup WhatsApp. Dari sana, kami membangun wadah sederhana yang kini menghubungkan ribuan mahasiswa Malang.
              </p>
              <Link
                to="/about"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "var(--charcoal)", color: "var(--cream)",
                  padding: "12px 28px", borderRadius: "9999px",
                  fontSize: "14px", fontWeight: 600, textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                Baca Cerita Lengkap Kami →
              </Link>
            </div>

            {/* Visual - Bento styled stats/team */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎓</div>
                <div style={{ fontWeight: 600, color: "var(--charcoal)", fontSize: "15px" }}>Untuk Mahasiswa</div>
                <p style={{ fontSize: "12px", color: "var(--charcoal-60)", marginTop: "4px" }}>UB, UM, Polinema & kampus lainnya di Malang.</p>
              </div>
              <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🤝</div>
                <div style={{ fontWeight: 600, color: "var(--charcoal)", fontSize: "15px" }}>100% Komunitas</div>
                <p style={{ fontSize: "12px", color: "var(--charcoal-60)", marginTop: "4px" }}>Bebas biaya platform, tanpa komisi apa pun.</p>
              </div>
              <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid var(--border-subtle)", gridColumn: "span 2" }}>
                <div style={{ display: "flex", gap: "-8px", marginBottom: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--sage)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, border: "2px solid white" }}>O</div>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--terracotta)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, border: "2px solid white", marginLeft: "-8px" }}>A</div>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--gold)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, border: "2px solid white", marginLeft: "-8px" }}>F</div>
                </div>
                <div style={{ fontWeight: 600, color: "var(--charcoal)", fontSize: "15px" }}>Dibuat oleh Tim Berdedikasi</div>
                <p style={{ fontSize: "12px", color: "var(--charcoal-60)", marginTop: "4px" }}>Dikembangkan secara independen untuk solusi lokal Malang.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section
        className={`cta-section${ctaReveal.visible ? " revealed" : ""}`}
        ref={ctaReveal.ref}
      >
        <div className="cta-inner">
          <div className="cta-deco cta-deco-1" />
          <div className="cta-deco cta-deco-2" />

          <div className="cta-content">
            <div className="cta-icon-group">
              <Users size={20} />
              <Star size={20} />
              <MapPin size={20} />
            </div>
            <h2 className="cta-title">
              Jual & Cari Jastip-Preloved
              <br />
              Hanya di Titip.in
            </h2>
            <p className="cta-desc">
              Ribuan pengguna sudah menggunakan Titip.in untuk jastip dan preloved.
              Fitur dasar gratis selamanya — daftar sekarang dan mulai jelajahi.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="cta-btn-primary">
                Daftar Gratis Sekarang
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="cta-btn-secondary">
                Sudah punya akun? Masuk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <LandingFooter />
    </div>
  );
}
