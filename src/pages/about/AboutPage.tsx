import "./about.css";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Mail, ArrowLeft, Users, Shield, Zap, Instagram } from "lucide-react";
import { LandingFooter } from "@/components/LandingFooter";

/* ─────────────────────────────────────────────
   Fade-in on scroll hook
   ───────────────────────────────────────────── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─────────────────────────────────────────────
   Team member data
   ───────────────────────────────────────────── */
const TEAM = [
  {
    name: "Oktavianus Samuel Minarto",
    initials: "O",
    role: "Project Manager & Engineer",
    email: "okta@titipin.me",
    desc: "Menginisiasi ide Titip.in sekaligus memimpin arsitektur sistem dan pengembangan platform web. Bertanggung jawab atas visi produk, roadmap, dan kualitas teknis keseluruhan.",
    photo: new URL("../../assets/team/okta.jpg", import.meta.url).href,
    gradient: "linear-gradient(135deg, #8FAF8A 0%, #5a7a55 100%)",
  },
  {
    name: "Alberd Juniawan Pasunda",
    initials: "A",
    role: "Engineer",
    email: "alberd@titipin.me",
    desc: "Mengembangkan dan memelihara backend API serta infrastruktur Titip.in. Memastikan performa sistem, keamanan data, dan stabilitas layanan bagi seluruh pengguna.",
    photo: null as string | null,
    gradient: "linear-gradient(135deg, #C0836A 0%, #8b4f38 100%)",
  },
  {
    name: "Fathan Rafif Ryansyah",
    initials: "F",
    role: "Analyst & QA",
    email: "fathan@titipin.me",
    desc: "Menganalisis kebutuhan pasar dan perilaku pengguna, serta melakukan QA pada fitur-fitur dan fungsionalitas Titip.in untuk memastikan kualitas layanan terbaik.",
    photo: new URL("../../assets/team/fathan.jpg", import.meta.url).href,
    gradient: "linear-gradient(135deg, #D4A856 0%, #a07a2e 100%)",
  },
];

const VALUES = [
  {
    icon: <Users size={26} />,
    iconBg: "#F0F4EF",
    iconColor: "#5a7a55",
    title: "Komunitas",
    body: "Dibangun oleh mahasiswa Malang, untuk mahasiswa Malang. Setiap fitur lahir dari kebutuhan nyata yang kami rasakan sendiri sebagai bagian dari komunitas ini.",
  },
  {
    icon: <Shield size={26} />,
    iconBg: "#FDF2EE",
    iconColor: "#8b4f38",
    title: "Kepercayaan",
    body: "Profil terverifikasi, komunikasi langsung via WhatsApp, tanpa perantara tersembunyi. Kami percaya transaksi paling aman terjadi saat kedua pihak bisa saling mengenal.",
  },
  {
    icon: <Zap size={26} />,
    iconBg: "#FDF8EE",
    iconColor: "#a07a2e",
    title: "Efisiensi",
    body: "Satu klik untuk terhubung ke jastip atau barang yang kamu butuhkan. Tidak ada proses panjang, tidak ada ongkir platform — langsung ke orangnya.",
  },
];

/* ─────────────────────────────────────────────
   Fade section wrapper
   ───────────────────────────────────────────── */
function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useFadeIn();
  return (
    <div ref={ref} className="about-fade-in" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */
export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="about-root">
      {/* ── NAVBAR ── */}
      <nav className={`about-nav${scrolled ? " scrolled" : ""}`}>
        <div className="about-nav-inner">
          <Link to="/landing" className="about-brand">Titip.in</Link>
          <span style={{ flex: 1 }} />
          <Link to="/landing" className="about-nav-back">
            <ArrowLeft size={15} />
            Kembali
          </Link>
          <Link to="/register" className="about-nav-cta">Mulai Gratis</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero-blob-1" />
        <div className="about-hero-blob-2" />
        <div className="about-hero-blob-3" />
        <div className="about-hero-inner">
          <div className="about-hero-label">Tentang Kami</div>
          <h1 className="about-hero-title">
            Lahir dari keresahan,<br />
            <span>tumbuh dari komunitas.</span>
          </h1>
          <p className="about-hero-sub">
            Titip.in adalah platform hyperlocal untuk jastip dan preloved warga Malang khususnya mahasiswa —
            sebuah jawaban atas ekosistem yang terlalu tersebar dan terlalu berantakan.
          </p>
          <div className="about-hero-pills">
            <span className="about-hero-pill">📍 Malang Area</span>
            <span className="about-hero-pill">🎓 Untuk Warga Malang</span>
            <span className="about-hero-pill">💬 Langsung via WhatsApp</span>
            <span className="about-hero-pill">🆓 Gratis Selamanya</span>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="about-story">
        <div className="about-section" style={{ paddingTop: 96, paddingBottom: 96 }}>
          <FadeSection>
            <div className="about-story-grid">
              <div>
                <div className="about-section-label">Latar Belakang</div>
                <h2 className="about-section-title">Satu masalah,<br />ribuan mahasiswa.</h2>
                <div className="about-story-paragraphs">
                  <p>
                    Siapa yang tidak kenal <strong>grup WhatsApp "UB Mager"</strong>? Atau menfess UB
                    yang setiap hari dibanjiri pesan "WTB/WTS barang bekas"? Ekosistem jastip dan
                    preloved di Malang itu nyata, ramai, dan bergairah — tapi tersebar di mana-mana.
                  </p>
                  <p>
                    Informasi tenggelam dalam hitungan menit. Tidak ada pencarian, tidak ada filter
                    lokasi, tidak ada cara untuk tahu mana yang masih aktif. Provider jastip harus
                    posting di 5 grup berbeda. Buyer harus scroll ratusan chat untuk menemukan
                    satu barang yang dicari.
                  </p>
                  <p>
                    Kami merasakan sendiri frustrasi itu. Dan dari sana, ide Titip.in lahir — bukan
                    sebagai startup besar, tapi sebagai <strong>solusi sederhana dari mahasiswa,
                      untuk mahasiswa</strong>.
                  </p>
                  <p>
                    Harapan kami sederhana: jadikan Titip.in sebagai <strong>wadah tunggal </strong>
                    bagi warga Malang yang ingin mencari tambahan uang jajan lewat jastip, atau
                    menjual barang bekas layak pakai mereka — tanpa ribet, tanpa biaya platform,
                    langsung terhubung via WhatsApp yang sudah familiar.
                  </p>
                </div>
              </div>
              <div className="about-story-quote">
                <p className="about-story-quote-text">
                  "Ekosistem jastip dan preloved di Malang itu ada dan besar. Yang kurang hanyalah
                  satu tempat yang menyatukannya."
                </p>
                <div className="about-story-quote-source">— Tim Titip.in, 2026</div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="about-stats">
        <div className="about-stats-inner">
          <FadeSection delay={0}>
            <div className="about-stat-item">
              <div className="about-stat-num">4<span>+</span></div>
              <div className="about-stat-label">Fitur Utama Tersedia di Titip.in</div>
            </div>
          </FadeSection>
          <FadeSection delay={100}>
            <div className="about-stat-item">
              <div className="about-stat-num">2<span> Arah</span></div>
              <div className="about-stat-label">Jastip & Preloved (Tersedia + Request)</div>
            </div>
          </FadeSection>
          <FadeSection delay={200}>
            <div className="about-stat-item">
              <div className="about-stat-num">1<span>×</span></div>
              <div className="about-stat-label">Klik untuk Terhubung via WhatsApp</div>
            </div>
          </FadeSection>
        </div>
      </div>

      {/* ── VALUES ── */}
      <section className="about-section">
        <FadeSection>
          <div className="about-section-label">Filosofi</div>
          <h2 className="about-section-title">Tiga pilar yang<br />menopang Titip.in.</h2>
          <p className="about-section-body">
            Setiap keputusan desain dan produk yang kami buat selalu berpijak pada tiga nilai ini.
          </p>
        </FadeSection>
        <div className="about-values-grid">
          {VALUES.map((v, i) => (
            <FadeSection key={v.title} delay={i * 120}>
              <div className="about-value-card">
                <div
                  className="about-value-icon"
                  style={{ background: v.iconBg, color: v.iconColor }}
                >
                  {v.icon}
                </div>
                <div className="about-value-title">{v.title}</div>
                <p className="about-value-body">{v.body}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="about-team-section">
        <div className="about-team-inner">
          <FadeSection>
            <div className="about-team-header">
              <div className="about-team-label">Tim Kami</div>
              <h2 className="about-team-title">
                Orang-orang di balik<br />Titip.in.
              </h2>
            </div>
          </FadeSection>
          <div className="about-team-grid">
            {TEAM.map((member, i) => (
              <FadeSection key={member.email} delay={i * 150}>
                <div className="about-team-card">
                  <div className="about-team-avatar">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} />
                    ) : (
                      <div
                        className="about-team-avatar-placeholder"
                        style={{ background: member.gradient }}
                      >
                        {member.initials}
                      </div>
                    )}
                  </div>
                  <div className="about-team-name">{member.name}</div>
                  <div className="about-team-role">{member.role}</div>
                  <p className="about-team-desc">{member.desc}</p>
                  <a href={`mailto:${member.email}`} className="about-team-email">
                    <Mail size={13} />
                    {member.email}
                  </a>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM SECTION ── */}
      <section className="about-instagram">
        <div className="about-section">
          <FadeSection>
            <div className="about-instagram-card">
              <div className="about-instagram-icon">
                <Instagram size={40} />
              </div>
              <h2 className="about-instagram-title">Ikuti Perjalanan Kami</h2>
              <p className="about-instagram-body">
                Dapatkan update terbaru, tips jastip, dan penawaran preloved terbaik langsung di feed kamu.
              </p>
              <a 
                href="https://instagram.com/titipin.me" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="about-instagram-link"
              >
                @titipin.me
              </a>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta">
        <div className="about-cta-blob-1" />
        <div className="about-cta-blob-2" />
        <FadeSection>
          <div className="about-cta-inner">
            <h2 className="about-cta-title">
              Bergabunglah dengan<br /> Titip.in.
            </h2>
            <p className="about-cta-sub">
              Gratis selamanya. Tidak perlu kartu kredit. Langsung daftar dan mulai
              temukan jastip atau jual barang bekas kamu hari ini.
            </p>
            <div className="about-cta-actions">
              <Link to="/register" className="about-cta-btn-primary">Daftar Sekarang</Link>
              <Link to="/landing" className="about-cta-btn-ghost">Pelajari Lebih Lanjut</Link>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* ── FOOTER ── */}
      <LandingFooter />
    </div>
  );
}
