import { useState } from "react";
import {
  MessageCircle,
  Zap,
  Globe,
  MapPin,
  Shield,
  Phone,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "Natural Conversation",
    desc: "Just describe how you feel in your own words. No medical jargon needed.",
    color: "#0d9aa5",
    bg: "#ecfeff",
  },
  {
    icon: Zap,
    title: "Instant Guidance",
    desc: "Get AI-powered triage and urgency assessment in seconds.",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    icon: Globe,
    title: "Your Language",
    desc: "Chat in any of South Africa's 11 official languages.",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    icon: MapPin,
    title: "Find Facilities",
    desc: "Discover nearby clinics and hospitals instantly.",
    color: "#16a34a",
    bg: "#ecfdf5",
  },
  {
    icon: Shield,
    title: "Check Benefits",
    desc: "Verify your Discovery Health benefits instantly.",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    icon: Phone,
    title: "No App Needed",
    desc: "Access everything via Telegram instantly.",
    color: "#db2777",
    bg: "#fdf2f8",
  },
];

export default function HowItWorks() {
  return (
    <>
      <div className="page">

        {/* HERO */}
        <section className="hero">
          <div className="hero-inner">

            <div className="hero-badge">
              <MessageCircle size={14} />
              MEDBRIDGE AI ON TELEGRAM
            </div>

            <h1 className="hero-title">
              Healthcare Guidance<br />
              Powered by AI on Telegram
            </h1>

            <p className="hero-subtitle">
              Instant symptom guidance, nearby clinics, and health support — all
              inside a simple chat.
            </p>

            <div className="hero-buttons">

              {/* FIXED TELEGRAM LINK */}
              <a
                href="https://t.me/aimedbridge_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Open Telegram Bot <ChevronRight size={18} />
              </a>

              <Link to="/facilities" className="btn-secondary">
                Find Facilities <MapPin size={18} />
              </Link>

            </div>

          </div>
        </section>

        {/* FEATURES */}
        <section className="section">
          <div className="container">

            <h2 className="section-title">What MedBridge AI Does</h2>

            <div className="grid">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div className="card" key={f.title}>
                    <div className="icon" style={{ background: f.bg }}>
                      <Icon size={22} color={f.color} />
                    </div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <h2>Start Using MedBridge AI Today</h2>
          <p>No downloads. No complexity. Just chat.</p>

          {/* FIXED TELEGRAM LINK */}
          <a
            href="https://t.me/aimedbridge_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Open Telegram <ChevronRight size={18} />
          </a>
        </section>

      </div>

      {/* CSS (UNCHANGED) */}
      <style>{`
        * {
          box-sizing: border-box;
          font-family: Inter, sans-serif;
        }

        body {
          margin: 0;
          background: #f8fafc;
          color: #0f172a;
        }

        .page {
          width: 100%;
        }

        .hero {
          padding: 120px 20px;
          background: linear-gradient(135deg, #e6fffb, #f0f9ff);
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .hero-inner {
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          padding: 8px 16px;
          border-radius: 999px;
          background: white;
          border: 1px solid #dbeafe;
          font-size: 12px;
          font-weight: 700;
          color: #0d9aa5;
          margin-bottom: 20px;
        }

        .hero-title {
          font-size: 54px;
          font-weight: 900;
          line-height: 1.1;
          margin: 0;
          letter-spacing: -1px;
        }

        .hero-subtitle {
          margin-top: 18px;
          font-size: 18px;
          color: #475569;
          max-width: 600px;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          gap: 14px;
          margin-top: 30px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-primary {
          background: #0d9aa5;
          color: white;
          padding: 14px 22px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 14px 22px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .section {
          padding: 90px 20px;
        }

        .container {
          max-width: 1100px;
          margin: auto;
        }

        .section-title {
          text-align: center;
          font-size: 34px;
          font-weight: 800;
          margin-bottom: 40px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .card {
          background: white;
          padding: 22px;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
        }

        .icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .card p {
          color: #64748b;
        }

        .cta {
          text-align: center;
          padding: 90px 20px;
          background: linear-gradient(135deg, #0d9aa5, #0b7f88);
          color: white;
          max-width: 1000px;
          margin: 80px auto;
          border-radius: 40px;
        }

        .cta h2 {
          font-size: 34px;
          margin-bottom: 10px;
        }

        .cta p {
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
}