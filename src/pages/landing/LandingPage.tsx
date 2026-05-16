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
            <a href="#showcase" className="nav-link">Preview</a>
            <Link to="/about" className="nav-link">Tentang Kami</Link>
          </div>

          <div className="nav-actions">
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
            <a href="#showcase" className="nav-link" onClick={() => setMobileNav(false)}>Preview</a>
            <Link to="/about" className="nav-link" onClick={() => setMobileNav(false)}>Tentang Kami</Link>
            <div className="nav-mobile-actions">
              <Link to="/login" className="nav-btn-ghost">Masuk</Link>
              <Link to="/register" className="nav-btn-cta">Daftar Gratis</Link>
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
            <h2 className="section-title">Platform yang Sudah Siap Pakai</h2>
            <p className="section-desc">
              Bukan sekadar mockup — ini produk nyata yang sudah bisa kamu gunakan hari ini.
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
              <a href="#fitur">Fitur</a>
              <a href="#cara-kerja">Cara Kerja</a>
              <a href="#showcase">Preview</a>
              <Link to="/about">Tentang Kami</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Akun</div>
              <Link to="/login">Masuk</Link>
              <Link to="/register">Daftar</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Hubungi Kami</div>
              <a href="mailto:support@titipin.me" className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                support@titipin.me
              </a>
              <a href="https://instagram.com/titipin.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                @titipin.me
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Titip.in — Buat & Cari Jastip-Preloved dengan Mudah</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
