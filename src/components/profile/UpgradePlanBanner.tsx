import React, { useState, useRef } from "react";
import { Zap, Sparkles, Check, X, Upload, Loader2, ImagePlus, QrCode } from "lucide-react";
import { UserTier, TIER_LIMITS, TIER_BOOST_QUOTA } from "@/types/api";
import { uploadImage } from "@/lib/uploadApi";
import { useUpgradeSubscription } from "@/hooks/useAnalytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ── Plan definitions ──────────────────────────────────────────────────

interface UpgradePlanBannerProps {
  currentTier: UserTier;
}

const PLANS = [
  {
    tier: "basic" as UserTier,
    label: "Basic",
    price: "Gratis",
    priceDetail: "",
    headerBg: "bg-charcoal-10",
    headerText: "text-charcoal-60",
    borderClass: "border-charcoal-20",
    features: [
      `${TIER_LIMITS.basic} item aktif per kategori`,
      "Fitur dasar listing & request",
      "Chat via WhatsApp",
    ],
    notIncluded: ["Badge tier", "Boost listing", "Analitik"],
  },
  {
    tier: "plus" as UserTier,
    label: "Plus",
    price: "Rp 10.000",
    priceDetail: "/bulan",
    headerBg: "bg-gradient-to-br from-violet-500 to-indigo-500",
    headerText: "text-white",
    borderClass: "border-violet-300",
    highlight: true,
    Icon: Sparkles,
    features: [
      `${TIER_LIMITS.plus} item aktif per kategori`,
      `${TIER_BOOST_QUOTA.plus} boost quota per bulan`,
      "Badge ✨ Plus di listing",
      "Analitik: views & klik WA",
    ],
    notIncluded: ["Listing terbaik & konversi"],
  },
  {
    tier: "pro" as UserTier,
    label: "Pro",
    price: "Rp 25.000",
    priceDetail: "/bulan",
    headerBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    headerText: "text-white",
    borderClass: "border-amber-300",
    Icon: Zap,
    features: [
      `${TIER_LIMITS.pro} item aktif per kategori`,
      `${TIER_BOOST_QUOTA.pro} boost quota per bulan`,
      "Badge ⚡ Pro di listing",
      "Analitik lengkap + konversi",
      "Kuota foto lebih banyak",
    ],
    notIncluded: [],
  },
];

const TIER_ORDER: Record<UserTier, number> = { basic: 0, plus: 1, pro: 2 };

// ── QRIS Upgrade Dialog ───────────────────────────────────────────────

interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  targetTier: Exclude<UserTier, "basic">;
  targetPlan: (typeof PLANS)[number];
  currentTier: UserTier;
}

function UpgradeDialog({ open, onClose, targetTier, targetPlan, currentTier }: UpgradeDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upgradeMutation = useUpgradeSubscription();

  const handleClose = () => {
    setStep(1);
    setProofFile(null);
    setProofPreview(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar yang diizinkan (JPG, PNG, dll).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5 MB.");
      return;
    }
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!proofFile) {
      toast.error("Silakan upload bukti pembayaran terlebih dahulu.");
      return;
    }
    setUploading(true);
    try {
      const proofUrl = await uploadImage(proofFile);
      await upgradeMutation.mutateAsync({ tier: targetTier, payment_proof_url: proofUrl });
      handleClose();
    } catch (err: any) {
      // Error handled by mutation's onError
    } finally {
      setUploading(false);
    }
  };

  const isSubmitting = uploading || upgradeMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-display text-[22px] flex items-center gap-2">
            {targetPlan.Icon && <targetPlan.Icon size={20} />}
            Upgrade ke Titip {targetPlan.label}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Scan QRIS di bawah untuk melakukan pembayaran, lalu lanjut ke langkah berikutnya."
              : "Upload bukti transfer/screenshot pembayaran Anda."}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-2">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                  step >= s
                    ? "bg-charcoal text-white"
                    : "bg-charcoal-10 text-charcoal-40"
                }`}
              >
                {s}
              </div>
              {s < 2 && (
                <div className={`flex-1 h-0.5 rounded transition-all ${step > s ? "bg-charcoal" : "bg-charcoal-10"}`} />
              )}
            </React.Fragment>
          ))}
          <span className="text-[12px] text-charcoal-50 ml-1">
            {step === 1 ? "Scan QRIS" : "Upload Bukti"}
          </span>
        </div>

        {step === 1 ? (
          /* ── Step 1: QRIS ── */
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="bg-gradient-to-br from-charcoal-5 to-charcoal-10 rounded-2xl p-4 border border-subtle w-full flex flex-col items-center">
              {/* Price badge */}
              <div className={`text-[13px] font-bold px-4 py-1.5 rounded-full text-white mb-4 ${targetPlan.headerBg}`}>
                {targetPlan.price}{targetPlan.priceDetail}
              </div>

              {/* QRIS image — centered, with object-position to crop decorative edges */}
              <div className="w-[240px] h-[240px] overflow-hidden rounded-xl shadow-md bg-white flex items-center justify-center">
                <img
                  src="/qris.png"
                  alt="QRIS Titip.in"
                  className="w-[290px] h-[290px] object-cover object-center"
                  style={{ marginTop: "-16px" }}
                />
              </div>

              <div className="mt-3 text-[12px] text-charcoal-50 text-center">
                <strong className="text-charcoal">TITIP.IN — JASTIP &amp; PRELOVED</strong><br />
                NMID: ID1026474410242
              </div>
            </div>

            <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 text-[12px] text-amber-800">
              <strong>📌 Instruksi:</strong>
              <ol className="list-decimal list-inside mt-1 space-y-0.5">
                <li>Buka aplikasi e-wallet/banking Anda</li>
                <li>Pilih fitur Scan QR / QRIS</li>
                <li>Scan kode QR di atas lalu bayar <strong>{targetPlan.price}</strong></li>
                <li>Simpan screenshot/bukti pembayaran</li>
              </ol>
            </div>

            <Button
              className="w-full rounded-full"
              onClick={() => setStep(2)}
            >
              Sudah Bayar — Upload Bukti →
            </Button>
          </div>
        ) : (
          /* ── Step 2: Upload bukti ── */
          <div className="flex flex-col gap-4 py-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {proofPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-subtle shadow-sm">
                <img src={proofPreview} alt="Bukti" className="w-full max-h-60 object-contain bg-charcoal-5" />
                <button
                  onClick={() => { setProofFile(null); setProofPreview(null); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-charcoal/70 text-white rounded-full flex items-center justify-center hover:bg-charcoal transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-40 rounded-xl border-2 border-dashed border-charcoal-20 hover:border-charcoal-40 bg-charcoal-5 hover:bg-charcoal-10 transition-all flex flex-col items-center justify-center gap-2 text-charcoal-50 hover:text-charcoal"
              >
                <ImagePlus size={32} />
                <span className="text-[13px] font-medium">Klik untuk pilih gambar bukti</span>
                <span className="text-[11px] text-charcoal-40">JPG / PNG / WEBP · Maks 5 MB</span>
              </button>
            )}

            {proofFile && !proofPreview && null}

            <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-[12px] text-violet-800">
              Setelah submit, admin akan memverifikasi pembayaran dan upgrade tier Anda. Proses biasanya selesai dalam <strong>1×24 jam</strong>.
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="rounded-full flex-1"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                ← Kembali
              </Button>
              <Button
                className="rounded-full flex-1"
                onClick={handleSubmit}
                disabled={!proofFile || isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" /> Mengirim...</>
                ) : (
                  <><Upload size={16} className="mr-2" /> Kirim Permintaan</>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Main Banner Component ─────────────────────────────────────────────

export function UpgradePlanBanner({ currentTier }: UpgradePlanBannerProps) {
  const [upgradeDialog, setUpgradeDialog] = useState<{
    open: boolean;
    targetTier: Exclude<UserTier, "basic">;
    plan: (typeof PLANS)[number];
  } | null>(null);

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-display text-[20px] font-medium text-charcoal">Upgrade Plan</h2>
        {currentTier !== "pro" && (
          <span className="text-[11px] bg-gradient-to-r from-violet-500 to-orange-400 text-white font-bold px-2 py-0.5 rounded-full">
            Buka Lebih Banyak Fitur
          </span>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.tier === currentTier;
          const canUpgrade = TIER_ORDER[plan.tier] > TIER_ORDER[currentTier];

          return (
            <div
              key={plan.tier}
              className={`relative rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                isCurrent
                  ? "border-sage-dark shadow-md"
                  : plan.highlight
                  ? `${plan.borderClass} shadow-lg shadow-violet-100`
                  : plan.borderClass
              }`}
            >
              {plan.tier === "plus" && currentTier === "basic" && (
                <div className="absolute top-2 right-2 bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase">
                  Populer
                </div>
              )}

              {/* Header */}
              <div className={`${plan.headerBg} px-4 pt-4 pb-3`}>
                <div className={`flex items-center gap-1.5 font-bold text-[15px] ${plan.headerText}`}>
                  {plan.Icon && <plan.Icon size={14} fill="currentColor" />}
                  Titip {plan.label}
                </div>
                <div className={`text-[11px] mt-0.5 font-medium ${plan.headerText} opacity-90`}>
                  {plan.price}{plan.priceDetail}
                </div>
              </div>

              {/* Features */}
              <div className="px-4 py-3 space-y-1.5 bg-elevated">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] text-charcoal">
                    <Check size={12} className="text-sage-dark mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] text-charcoal-30 line-through">
                    <span className="w-3 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-4 pb-4 bg-elevated">
                {isCurrent ? (
                  <div className="text-center text-[11px] text-sage-dark bg-sage-pale border border-sage-dark/30 font-bold py-1.5 rounded-lg">
                    Plan Saat Ini
                  </div>
                ) : canUpgrade ? (
                  <button
                    onClick={() =>
                      setUpgradeDialog({
                        open: true,
                        targetTier: plan.tier as Exclude<UserTier, "basic">,
                        plan,
                      })
                    }
                    className={`flex items-center justify-center gap-1.5 w-full text-[12px] font-semibold py-1.5 rounded-lg text-white transition-opacity hover:opacity-90 ${plan.headerBg}`}
                  >
                    <QrCode size={13} />
                    Upgrade — Bayar QRIS
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-charcoal-40 font-medium py-1.5 border border-charcoal-20 bg-charcoal-10 rounded-lg">
                    Tersedia
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-charcoal-40 mt-3 text-center">
        Upgrade dilakukan via QRIS. Admin akan memverifikasi pembayaran dan mengaktifkan plan Anda.
      </p>

      {/* QRIS Upgrade Dialog */}
      {upgradeDialog && (
        <UpgradeDialog
          open={upgradeDialog.open}
          onClose={() => setUpgradeDialog(null)}
          targetTier={upgradeDialog.targetTier}
          targetPlan={upgradeDialog.plan}
          currentTier={currentTier}
        />
      )}
    </div>
  );
}
