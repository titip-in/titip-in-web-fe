import { StatCard } from "@/components/home/StatCard";
import { JastipCard } from "@/components/home/JastipCard";
import { ActivityFeed } from "@/components/home/ActivityFeed";
import { useAuthStore } from "@/stores/authStore";

export default function HomePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      {/* Hero Section */}
      <section className="hero bg-charcoal rounded-2xl p-10 relative overflow-hidden mb-8 min-h-[220px] flex items-center">
        <div className="hero-blobs">
          <div className="hero-blob w-[200px] h-[200px] bg-sage opacity-10 absolute rounded-full -top-[60px] -right-[40px]"></div>
          <div className="hero-blob w-[120px] h-[120px] bg-terracotta opacity-15 absolute rounded-full -bottom-[30px] right-[200px]"></div>
          <div className="hero-blob w-[80px] h-[80px] bg-gold opacity-10 absolute rounded-full top-[20px] right-[160px]"></div>
        </div>
        
        <div className="hero-content relative z-[1] max-w-[560px]">
          <div className="hero-tag text-[11px] font-semibold tracking-[2px] text-sage uppercase mb-3">Selamat Datang</div>
          <h1 className="hero-title font-display text-[42px] font-light italic text-cream leading-[1.1] mb-3">
            Hai, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="hero-desc text-[15px] text-cream/45 leading-[1.6] mb-6 max-w-[440px]">
            Ada rencana pulang kampung minggu ini? Yuk, buka jastip untuk teman-teman kampus yang butuh titip barang.
          </p>
          <div className="hero-actions flex gap-3">
            <button className="btn btn-md btn-terra bg-terracotta text-white rounded-full font-body font-semibold px-6 py-3 text-[14px] hover:bg-terracotta-dark shadow-sm transition-all duration-100 ease-out hover:shadow-md">
              Buka Jastip Baru
            </button>
            <button className="btn btn-md btn-soft bg-cream/10 text-cream border border-cream/10 rounded-full font-body font-semibold px-6 py-3 text-[14px] hover:bg-cream/15 transition-all duration-100 ease-out">
              Cari Jastip
            </button>
          </div>
        </div>

        <div className="hero-stats absolute right-10 top-1/2 -translate-y-1/2 flex gap-4 z-[1]">
          <div className="hero-stat bg-cream/5 border border-cream/10 rounded-xl p-5 text-center min-w-[120px] backdrop-blur-[8px]">
            <div className="hero-stat-num font-display text-[36px] font-light text-cream leading-[1] mb-1">Rp1.2M</div>
            <div className="hero-stat-label text-[10px] text-cream/40 font-medium tracking-[0.5px]">PENDAPATAN</div>
          </div>
          <div className="hero-stat bg-cream/5 border border-cream/10 rounded-xl p-5 text-center min-w-[120px] backdrop-blur-[8px]">
            <div className="hero-stat-num font-display text-[36px] font-light text-cream leading-[1] mb-1">12</div>
            <div className="hero-stat-label text-[10px] text-cream/40 font-medium tracking-[0.5px]">TRX AKTIF</div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="stats-grid grid grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="📦"
          iconBgClass="bg-sage-pale text-sage-dark"
          label="TOTAL JASTIP"
          value="48"
          delta={{ value: "12% bulan ini", isUp: true }}
        />
        <StatCard
          icon="🛍️"
          iconBgClass="bg-terracotta-pale text-terracotta-dark"
          label="BARANG PRELOVED"
          value="15"
          delta={{ value: "3 terjual hari ini", isUp: true }}
        />
        <StatCard
          icon="⭐"
          iconBgClass="bg-gold-pale text-gold-dark"
          label="RATING SAYA"
          value="4.9"
        />
        <StatCard
          icon="💬"
          iconBgClass="bg-cream-dark text-charcoal"
          label="PESAN BELUM DIBACA"
          value="3"
        />
      </div>

      {/* Content Grid */}
      <div className="content-grid grid grid-cols-[1fr_380px] gap-6 mb-10">
        
        {/* Left Col: Jastip List */}
        <div className="left-panel">
          <div className="section-header flex justify-between items-center mb-5">
            <div>
              <h2 className="section-title font-display text-[22px] font-medium text-charcoal">Jastip Tersedia</h2>
              <div className="section-subtitle text-[13px] text-charcoal-60 mt-[2px]">Rute dari dan ke Malang Raya</div>
            </div>
            <button className="text-[13px] font-semibold text-terracotta hover:text-terracotta-dark transition-colors">Lihat Semua Rute</button>
          </div>

          <div className="jastip-grid flex flex-col gap-4">
            <JastipCard 
              user={{ name: "Nadia Shafira", avatarClass: "bg-gradient-to-br from-sage to-sage-dark", avatarInitial: "N" }}
              timeAgo="2 jam lalu"
              status="Aktif"
              route={{ from: "Surabaya", to: "Malang" }}
              tags={["Food & Snack", "Dokumen", "Paket Kecil"]}
              deadline="Besok, 16:00"
              actionText="Titip Barang"
            />
            <JastipCard 
              user={{ name: "Bima Arya", avatarClass: "bg-gradient-to-br from-terracotta to-terracotta-dark", avatarInitial: "B" }}
              timeAgo="5 jam lalu"
              status="Aktif"
              route={{ from: "Jakarta", to: "Malang" }}
              tags={["Gadget", "Buku", "Pakaian"]}
              deadline="Senin, 10:00"
              actionText="Titip Barang"
            />
            <JastipCard 
              user={{ name: "Dimas Anggara", avatarClass: "bg-gradient-to-br from-gold to-gold-dark", avatarInitial: "D" }}
              timeAgo="1 hari lalu"
              status="Pending"
              route={{ from: "Bandung", to: "Malang" }}
              tags={["Sepatu", "Aksesoris"]}
              deadline="Rabu, 14:00"
              actionText="Lihat Detail"
            />
          </div>
        </div>

        {/* Right Col: Activity Feed */}
        <div className="right-panel flex flex-col gap-6">
          <ActivityFeed 
            items={[
              {
                dotClass: "bg-sage",
                title: <span><strong className="font-semibold text-charcoal">Nadia</strong> menerima permintaan jastip Lapis Kukus Pahlawan Anda.</span>,
                time: "10 menit yang lalu"
              },
              {
                dotClass: "bg-terracotta",
                title: <span>Pesanan sepatu preloved Anda telah <strong>dikirim</strong> oleh seller.</span>,
                time: "2 jam yang lalu"
              },
              {
                dotClass: "bg-gold",
                title: <span>Dana sebesar <strong>Rp150.000</strong> telah ditambahkan ke dompet Anda.</span>,
                time: "Kemarin, 14:30"
              },
              {
                dotClass: "bg-cream-dark",
                title: <span><strong className="font-semibold text-charcoal">Bima</strong> membalas pesan Anda mengenai jastip Jakarta.</span>,
                time: "Kemarin, 09:15"
              }
            ]}
          />

          <div className="promo-card bg-gradient-to-br from-sage to-sage-dark rounded-xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full"></div>
            <h3 className="font-display text-[18px] font-medium mb-2 relative z-[1]">Jadilah Trusted Jastipper!</h3>
            <p className="text-[13px] text-white/80 mb-4 relative z-[1]">Dapatkan badge verifikasi dan tingkatkan kepercayaan penitip pada layanan Anda.</p>
            <button className="bg-white text-sage-dark text-[12px] font-bold py-2 px-4 rounded-full border-none cursor-pointer relative z-[1] transition-transform duration-200 hover:scale-[1.02]">
              Verifikasi Sekarang
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
