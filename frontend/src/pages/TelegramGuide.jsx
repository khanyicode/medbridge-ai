// TelegramGuide.jsx

import { useState } from "react";
import {
  MessageCircle,
  Zap,
  Globe,
  MapPin,
  Shield,
  Phone,
  ChevronRight,
  Bot,
  HeartPulse,
  CheckCircle2,
  Sparkles,
  Lock,
} from "lucide-react";

import { Link } from "react-router-dom";

/* =========================================================
   FEATURES
========================================================= */

const FEATURES = [
  {
    icon: MessageCircle,
    title: "Natural Conversation",
    desc: "Describe your symptoms naturally. No medical jargon required.",
    color: "#0d9aa5",
    bg: "#ecfeff",
  },

  {
    icon: Zap,
    title: "Instant AI Guidance",
    desc: "Receive urgency assessments and next-step recommendations instantly.",
    color: "#d97706",
    bg: "#fffbeb",
  },

  {
    icon: Globe,
    title: "11 Official Languages",
    desc: "Talk to MedBridge AI in your preferred South African language.",
    color: "#2563eb",
    bg: "#eff6ff",
  },

  {
    icon: MapPin,
    title: "Find Nearby Facilities",
    desc: "Locate clinics, hospitals, pharmacies, and emergency care near you.",
    color: "#059669",
    bg: "#ecfdf5",
  },

  {
    icon: Shield,
    title: "Medical Aid Benefits",
    desc: "Instantly verify Discovery Health benefits and coverage eligibility.",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },

  {
    icon: Phone,
    title: "No App Required",
    desc: "Everything works directly inside Telegram with zero setup complexity.",
    color: "#db2777",
    bg: "#fdf2f8",
  },
];

/* =========================================================
   STEPS
========================================================= */

const STEPS = [
  {
    num: "01",
    title: "Open Telegram",
    desc: "Download Telegram or open the app on your device.",
  },

  {
    num: "02",
    title: "Start MedBridge AI",
    desc: "Search for @MedBridgeAI_bot or use the launch button below.",
  },

  {
    num: "03",
    title: "Select Your Language",
    desc: "Choose your preferred language from the onboarding menu.",
  },

  {
    num: "04",
    title: "Describe Symptoms",
    desc: "Tell the AI how you're feeling using normal everyday language.",
  },

  {
    num: "05",
    title: "Receive Guidance",
    desc: "Get triage guidance, urgency recommendations, and healthcare support.",
  },
];

/* =========================================================
   FAQ
========================================================= */

const FAQ = [
  {
    q: "Is my health information private?",
    a: "Yes. Conversations are encrypted and securely handled with strict privacy protections.",
  },

  {
    q: "Does MedBridge AI replace doctors?",
    a: "No. MedBridge AI provides guidance and navigation support, not medical diagnosis.",
  },

  {
    q: "What happens during emergencies?",
    a: "Call 10177 immediately or visit your nearest emergency healthcare facility.",
  },

  {
    q: "Is MedBridge AI free?",
    a: "Yes. The platform is completely free to use.",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TelegramGuide() {
  return (
    <>
      <style>{`

      :root{

        --primary-50:#ecfeff;
        --primary-100:#cffafe;
        --primary-500:#0d9aa5;
        --primary-600:#0b7f88;

        --neutral-50:#f8fafc;
        --neutral-100:#f1f5f9;
        --neutral-200:#e2e8f0;
        --neutral-300:#cbd5e1;
        --neutral-400:#94a3b8;
        --neutral-500:#64748b;
        --neutral-600:#475569;
        --neutral-700:#334155;
        --neutral-800:#1e293b;
        --neutral-900:#0f172a;

        --radius-sm:12px;
        --radius-md:18px;
        --radius-lg:28px;
        --radius-xl:40px;
        --radius-full:999px;

        --shadow-md:0 10px 30px rgba(0,0,0,0.06);
        --shadow-lg:0 20px 50px rgba(0,0,0,0.10);

        --font-sans:Inter,sans-serif;
        --font-display:Inter,sans-serif;

      }

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      body{
        font-family:var(--font-sans);
        background:#f4fbfb;
      }

      a{
        text-decoration:none;
      }

      .container{
        width:100%;
        max-width:1200px;
        margin:auto;
        padding:0 24px;
      }

      /* =========================================================
         HERO
      ========================================================= */

      .hero{
        position:relative;
        overflow:hidden;

        background:
        linear-gradient(
          135deg,
          #f0fdfd 0%,
          #e6f7f7 45%,
          #e0f2fe 100%
        );

        padding:100px 0;
      }

      .hero::before{
        content:"";
        position:absolute;
        width:420px;
        height:420px;
        background:rgba(13,154,165,0.08);
        border-radius:50%;
        top:-120px;
        right:-100px;
      }

      .hero-grid{
        display:grid;
        grid-template-columns:1.1fr 0.9fr;
        gap:50px;
        align-items:center;
      }

      .hero-badge{
        display:inline-flex;
        align-items:center;
        gap:8px;

        padding:10px 18px;

        border-radius:999px;

        background:white;

        border:1px solid #c8f3f5;

        font-size:13px;
        font-weight:700;

        color:var(--primary-600);

        margin-bottom:22px;
      }

      .hero-title{
        font-size:68px;
        line-height:1;
        font-weight:900;
        letter-spacing:-0.04em;

        color:var(--neutral-900);

        margin-bottom:24px;
      }

      .hero-title span{
        color:var(--primary-500);
      }

      .hero-subtitle{
        font-size:19px;
        line-height:1.7;
        color:var(--neutral-600);

        max-width:620px;

        margin-bottom:34px;
      }

      .hero-buttons{
        display:flex;
        gap:16px;
        flex-wrap:wrap;
      }

      .btn-primary{
        background:var(--primary-500);
        color:white;

        padding:18px 28px;

        border-radius:999px;

        font-weight:700;

        display:inline-flex;
        align-items:center;
        gap:10px;

        box-shadow:var(--shadow-md);
      }

      .btn-primary:hover{
        transform:translateY(-2px);
      }

      .btn-secondary{
        background:white;

        color:var(--neutral-800);

        border:2px solid var(--neutral-200);

        padding:18px 28px;

        border-radius:999px;

        font-weight:700;

        display:inline-flex;
        align-items:center;
        gap:10px;
      }

      /* =========================================================
         PHONE MOCKUP
      ========================================================= */

      .phone{
        width:100%;
        max-width:380px;

        background:#0f172a;

        border-radius:42px;

        padding:14px;

        margin:auto;

        box-shadow:0 30px 60px rgba(15,23,42,0.25);
      }

      .phone-screen{
        background:#f8fafc;
        border-radius:30px;
        overflow:hidden;
      }

      .phone-header{
        background:#0d9aa5;
        color:white;
        padding:22px;

        display:flex;
        align-items:center;
        gap:14px;
      }

      .phone-avatar{
        width:48px;
        height:48px;
        border-radius:16px;
        background:white;

        display:flex;
        align-items:center;
        justify-content:center;
      }

      .chat-area{
        padding:22px;
      }

      .chat-user{
        background:#0d9aa5;
        color:white;

        padding:16px;

        border-radius:22px 22px 6px 22px;

        margin-left:auto;

        max-width:85%;

        margin-bottom:18px;

        font-size:14px;
        line-height:1.6;
      }

      .chat-ai{
        background:white;

        border:1px solid var(--neutral-200);

        padding:18px;

        border-radius:22px 22px 22px 6px;

        box-shadow:var(--shadow-md);

        font-size:14px;
        line-height:1.7;
      }

      .urgency-pill{
        display:inline-flex;
        align-items:center;
        gap:6px;

        margin-top:14px;

        background:#fef2f2;
        color:#dc2626;

        padding:8px 12px;

        border-radius:999px;

        font-size:12px;
        font-weight:700;
      }

      /* =========================================================
         FEATURES
      ========================================================= */

      .section{
        padding:100px 0;
      }

      .section-title{
        text-align:center;
        margin-bottom:60px;
      }

      .section-title span{
        color:var(--primary-500);
        font-size:13px;
        font-weight:800;
        letter-spacing:0.08em;
        text-transform:uppercase;
      }

      .section-title h2{
        font-size:44px;
        font-weight:800;
        color:var(--neutral-900);

        margin-top:12px;
      }

      .section-title p{
        color:var(--neutral-500);
        font-size:18px;

        margin-top:14px;
      }

      .features-grid{
        display:grid;
        grid-template-columns:
        repeat(auto-fit,minmax(280px,1fr));

        gap:24px;
      }

      .feature-card{
        background:white;

        border:1px solid var(--neutral-200);

        border-radius:30px;

        padding:30px;

        transition:0.2s ease;

        box-shadow:var(--shadow-md);
      }

      .feature-card:hover{
        transform:translateY(-4px);
      }

      .feature-icon{
        width:62px;
        height:62px;

        border-radius:18px;

        display:flex;
        align-items:center;
        justify-content:center;

        margin-bottom:18px;
      }

      .feature-card h3{
        font-size:20px;
        font-weight:700;
        color:var(--neutral-900);

        margin-bottom:10px;
      }

      .feature-card p{
        color:var(--neutral-500);
        line-height:1.7;
      }

      /* =========================================================
         STEPS
      ========================================================= */

      .steps-grid{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
        gap:24px;
      }

      .step-card{
        background:white;

        border-radius:30px;

        padding:30px;

        border:1px solid var(--neutral-200);

        box-shadow:var(--shadow-md);
      }

      .step-number{
        width:58px;
        height:58px;

        border-radius:18px;

        background:var(--primary-50);

        color:var(--primary-600);

        font-size:22px;
        font-weight:800;

        display:flex;
        align-items:center;
        justify-content:center;

        margin-bottom:20px;
      }

      .step-card h3{
        font-size:20px;
        margin-bottom:10px;
      }

      .step-card p{
        color:var(--neutral-500);
        line-height:1.7;
      }

      /* =========================================================
         FAQ
      ========================================================= */

      .faq-container{
        max-width:900px;
        margin:auto;
      }

      .faq-card{
        background:white;

        border:1px solid var(--neutral-200);

        border-radius:24px;

        padding:24px;

        margin-bottom:16px;

        cursor:pointer;

        box-shadow:var(--shadow-md);
      }

      .faq-question{
        display:flex;
        justify-content:space-between;
        align-items:center;
      }

      .faq-question h3{
        font-size:17px;
        font-weight:700;
        color:var(--neutral-900);
      }

      .faq-answer{
        margin-top:18px;
        color:var(--neutral-500);
        line-height:1.7;
      }

      /* =========================================================
         CTA
      ========================================================= */

      .cta{
        background:
        linear-gradient(
          135deg,
          #0f172a,
          #1e293b
        );

        border-radius:40px;

        padding:70px;

        text-align:center;

        color:white;
      }

      .cta h2{
        font-size:44px;
        margin-bottom:18px;
      }

      .cta p{
        color:#cbd5e1;
        font-size:18px;
        margin-bottom:34px;
      }

      /* =========================================================
         MOBILE
      ========================================================= */

      @media(max-width:900px){

        .hero-grid{
          grid-template-columns:1fr;
        }

        .hero-title{
          font-size:50px;
        }

      }

      @media(max-width:768px){

        .hero{
          padding:70px 0;
        }

        .hero-title{
          font-size:40px;
        }

        .section-title h2{
          font-size:34px;
        }

        .cta{
          padding:40px 24px;
        }

        .cta h2{
          font-size:32px;
        }

      }

      `}</style>

      <div style={{ flex: 1 }}>

        {/* HERO */}

        <section className="hero">

          <div className="container">

            <div className="hero-grid">

              {/* LEFT */}

              <div>

                <div className="hero-badge">
                  <Sparkles size={14} />
                  BUILT FOR SOUTH AFRICA
                </div>

                <h1 className="hero-title">
                  Healthcare Support
                  <br />
                  Directly on
                  <br />
                  <span>Telegram.</span>
                </h1>

                <p className="hero-subtitle">
                  MedBridge AI helps South Africans
                  understand symptoms, locate nearby
                  healthcare facilities, and access
                  instant AI-powered guidance through
                  a simple Telegram chat.
                </p>

                <div className="hero-buttons">

                  <a
                    href="https://t.me/MedBridgeAI_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <Bot size={18} />

                    Open Telegram Bot

                    <ChevronRight size={18} />
                  </a>

                  <Link
                    to="/facilities"
                    className="btn-secondary"
                  >
                    <MapPin size={18} />

                    Find Facilities
                  </Link>

                </div>

              </div>

              {/* RIGHT */}

              <div>

                <div className="phone">

                  <div className="phone-screen">

                    <div className="phone-header">

                      <div className="phone-avatar">
                        <HeartPulse
                          size={22}
                          color="#0d9aa5"
                        />
                      </div>

                      <div>
                        <h3
                          style={{
                            fontWeight: 700,
                            marginBottom: 4,
                          }}
                        >
                          MedBridge AI
                        </h3>

                        <p
                          style={{
                            opacity: 0.85,
                            fontSize: 13,
                          }}
                        >
                          AI Health Assistant
                        </p>
                      </div>

                    </div>

                    <div className="chat-area">

                      <div className="chat-user">
                        I have chest pain and shortness
                        of breath.
                      </div>

                      <div className="chat-ai">

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 12,
                            color: "#dc2626",
                            fontWeight: 700,
                          }}
                        >
                          <AlertIcon />

                          High Risk Detected
                        </div>

                        <p>
                          Your symptoms may indicate a
                          serious condition requiring
                          immediate medical attention.
                        </p>

                        <div className="urgency-pill">
                          <CheckCircle2 size={14} />
                          Urgency: Immediate
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section className="section">

          <div className="container">

            <div className="section-title">
              <span>Features</span>

              <h2>
                Everything You Need
              </h2>

              <p>
                AI-powered healthcare navigation built
                for accessibility and simplicity.
              </p>
            </div>

            <div className="features-grid">

              {FEATURES.map((f) => {
                const Icon = f.icon;

                return (
                  <div
                    key={f.title}
                    className="feature-card"
                  >

                    <div
                      className="feature-icon"
                      style={{
                        background: f.bg,
                      }}
                    >
                      <Icon
                        size={26}
                        color={f.color}
                      />
                    </div>

                    <h3>{f.title}</h3>

                    <p>{f.desc}</p>

                  </div>
                );
              })}

            </div>

          </div>

        </section>

        {/* STEPS */}

        <section
          className="section"
          style={{
            background: "#f8fafc",
          }}
        >

          <div className="container">

            <div className="section-title">

              <span>How It Works</span>

              <h2>
                Start in Minutes
              </h2>

              <p>
                No complicated setup. Just open Telegram
                and begin chatting.
              </p>

            </div>

            <div className="steps-grid">

              {STEPS.map((s) => (
                <div
                  key={s.num}
                  className="step-card"
                >

                  <div className="step-number">
                    {s.num}
                  </div>

                  <h3>{s.title}</h3>

                  <p>{s.desc}</p>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* FAQ */}

        <section className="section">

          <div className="container">

            <div className="section-title">

              <span>FAQ</span>

              <h2>
                Common Questions
              </h2>

            </div>

            <div className="faq-container">

              {FAQ.map((item, i) => (
                <FAQItem
                  key={i}
                  question={item.q}
                  answer={item.a}
                />
              ))}

            </div>

          </div>

        </section>

        {/* CTA */}

        <section
          className="section"
          style={{
            paddingTop: 0,
          }}
        >

          <div className="container">

            <div className="cta">

              <h2>
                Start Using MedBridge AI
              </h2>

              <p>
                Healthcare guidance should be accessible
                to everyone.
              </p>

              <a
                href="https://t.me/MedBridgeAI_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Bot size={18} />

                Launch Telegram Bot

                <ChevronRight size={18} />
              </a>

            </div>

          </div>

        </section>

      </div>
    </>
  );
}

/* =========================================================
   FAQ ITEM
========================================================= */

function FAQItem({ question, answer }) {
  const [open, setOpen] =
    useState(false);

  return (
    <div
      className="faq-card"
      onClick={() => setOpen(!open)}
    >

      <div className="faq-question">

        <h3>{question}</h3>

        <ChevronRight
          size={18}
          style={{
            transform: open
              ? "rotate(90deg)"
              : "rotate(0deg)",

            transition: "0.2s ease",
          }}
        />

      </div>

      {open && (
        <div className="faq-answer">
          {answer}
        </div>
      )}

    </div>
  );
}

/* =========================================================
   SMALL ALERT ICON
========================================================= */

function AlertIcon() {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: 999,
        background: "#fee2e2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        color: "#dc2626",
        fontWeight: 800,
      }}
    >
      !
    </div>
  );
}