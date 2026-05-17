import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Smartphone, ArrowRight } from "lucide-react";

export function AndroidDownloadCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the CTA
    const isDismissed = localStorage.getItem("titipin_android_cta_dismissed");
    if (isDismissed) return;

    // Show after 10 seconds of activity in the web app
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("titipin_android_cta_dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "90%",
        maxWidth: "500px",
        animation: "slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {/* Styles inline to support instant visual injection without modifying multiple files */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -32px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1.5px solid var(--terracotta-dark)",
          borderRadius: "16px",
          padding: "16px 20px",
          boxShadow: "0 20px 40px rgba(26,26,24,0.12), 0 1px 3px rgba(26,26,24,0.05)",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "none",
            border: "none",
            color: "var(--charcoal-60)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "50%",
            transition: "background 0.2s",
          }}
          className="hover:bg-charcoal-10"
          aria-label="Tutup"
        >
          <X size={15} />
        </button>

        {/* Icon */}
        <div
          style={{
            background: "var(--terracotta-dark)",
            color: "white",
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Smartphone size={20} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, paddingRight: "16px" }}>
          <h4
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--charcoal)",
              margin: 0,
            }}
          >
            Cobain Titip.in Versi Android!
          </h4>
          <p
            style={{
              fontSize: "12px",
              color: "var(--charcoal-60)",
              margin: "4px 0 0 0",
              lineHeight: 1.4,
            }}
          >
            Lebih ringan, cepat, dan terhubung WhatsApp native.
          </p>
        </div>

        {/* Action Button */}
        <Link
          to="/android"
          onClick={() => setIsVisible(false)}
          style={{
            background: "var(--charcoal)",
            color: "var(--cream)",
            padding: "8px 14px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 600,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
          className="hover:bg-charcoal-80"
        >
          Coba <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
