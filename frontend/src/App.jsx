// App.jsx

import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
import HowItWorks from "./pages/HowItWorks";

import {
  Heart,
  Send,
  Shield,
  Zap,
  Menu,
  MapPin,
  Phone,
  Clock,
  Star,
  Search,
  ListFilter as Filter,
  Navigation,
  CircleAlert as AlertCircle,
  ChevronRight,
  X,
} from "lucide-react";

/* =========================================================
   MOCK DATABASE
========================================================= */

const supabase = {
  from: () => ({
    select: () => ({
      order: async () => ({
        data: [
          {
            id: 1,
            name: "Gauteng Central Medical Hub",
            address: "128 Jan Smuts Ave, Rosebank",
            city: "Johannesburg",
            province: "Gauteng",
            facility_type: "hospital",
            is_24h: true,
            rating: 4.8,
            phone: "011 555 0123",
          },
          {
            id: 2,
            name: "Cape Health Clinic",
            address: "42 Long Street, Cape Town Central",
            city: "Cape Town",
            province: "Western Cape",
            facility_type: "clinic",
            is_24h: false,
            rating: 4.2,
            phone: "021 555 4567",
          },
          {
            id: 3,
            name: "Ubuntu Pharmacy",
            address: "55 Church Street",
            city: "Pretoria",
            province: "Gauteng",
            facility_type: "pharmacy",
            is_24h: true,
            rating: 4.7,
            phone: "012 444 8888",
          },
        ],
      }),
    }),
  }),
};

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">
          <Heart size={18} fill="white" color="white" />
        </div>

        <h2>
          MedBridge <span>AI</span>
        </h2>
      </div>

      <div className="nav-links">
        <Link to="/" className="active">
          Home
        </Link>

        <Link to="/how-it-works">
          How It Works
        </Link>

        <Link to="/facilities">
          Find Facility
        </Link>

        <a href="#">Benefits</a>
      </div>

      {/* ✅ FIXED TELEGRAM BUTTON (KEPT YOUR CSS CLASS) */}
      <a
        href="https://t.me/aimedbridge_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="telegram-btn"
      >
        <Send size={18} />
        Talk To Us On Telegram
      </a>

      <button className="mobile-menu">
        <Menu size={22} />
      </button>
    </nav>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function Home() {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="badge">
          BUILT FOR SOUTH AFRICA
        </div>

        <h1>
          Your Health.
          <br />
          Our Priority.
          <br />
          <span>AI That Cares.</span>
        </h1>

        <p>
          MedBridge AI is your intelligent
          health navigator — helping millions
          of South Africans understand their
          symptoms, find care, and navigate
          the healthcare system in their own
          language.
        </p>

        <div className="hero-buttons">
          {/* ✅ FIXED BUTTON (keeps same styling class) */}
          <a
            href="https://t.me/aimedbridge_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="primary-btn"
          >
            <Zap size={18} />
            Try Telegram Bot
          </a>

          <button className="secondary-btn">
            <MapPin size={18} />
            Find A Facility
          </button>
        </div>

        <div className="hero-features">
          <div className="feature">
            <Shield size={18} />
            <span>Private & Confidential</span>
          </div>

          <div className="feature">
            <Zap size={18} />
            <span>Instant AI Guidance</span>
          </div>
        </div>
      </div>

      {/* PHONE MOCKUP (UNCHANGED) */}
      <div className="hero-right">
        <div className="phone">
          <div className="phone-top"></div>

          <div className="phone-header">
            <div className="phone-avatar">
              <Heart size={16} fill="white" color="white" />
            </div>

            <div>
              <h3>MedBridge AI</h3>
              <p>AI Health Assistant • Online</p>
            </div>
          </div>

          <div className="chat-area">
            <div className="user-message">
              I have chest pain and shortness of breath.
            </div>

            <div className="ai-card">
              <h4>⚠ Risk Level: High</h4>

              <div className="card-section">
                <strong>Possible Condition:</strong>
                <p>
                  Your symptoms may indicate a serious condition
                  requiring immediate attention.
                </p>
              </div>

              <div className="card-section">
                <strong>Recommendation:</strong>
                <p>
                  Please seek emergency medical care immediately
                  or go to the nearest hospital.
                </p>
              </div>

              <div className="urgency">
                ⚡ Urgency: Immediate
              </div>
            </div>

            <div className="chat-buttons">
              <button>Find Hospital</button>
              <button>Call 10177</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



/* =========================================================
   FACILITIES PAGE
========================================================= */

const PROVINCES = [
  "All Provinces",
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Free State",
  "Northern Cape",
];

const TYPES = [
  "All Types",
  "hospital",
  "clinic",
  "pharmacy",
  "emergency",
];

const TYPE_CONFIG = {
  hospital: {
    label: "Hospital",
    color: "var(--error-600)",
    bg: "var(--error-50)",
  },

  clinic: {
    label: "Clinic",
    color: "var(--primary-600)",
    bg: "var(--primary-50)",
  },

  pharmacy: {
    label: "Pharmacy",
    color: "var(--success-600)",
    bg: "var(--success-50)",
  },

  emergency: {
    label: "Emergency",
    color: "var(--error-600)",
    bg: "var(--error-50)",
  },
};

function Facilities() {
  const [facilities, setFacilities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [province, setProvince] =
    useState("All Provinces");

  const [type, setType] =
    useState("All Types");

  const [selected, setSelected] =
    useState(null);

  const [show24h, setShow24h] =
    useState(false);

  useEffect(() => {
    loadFacilities();
  }, []);

  async function loadFacilities() {
    setLoading(true);

    const { data } = await supabase
      .from("facilities")
      .select("*")
      .order("rating", {
        ascending: false,
      });

    setFacilities(data ?? []);

    setLoading(false);
  }

  const filtered = facilities.filter(
    (f) => {
      const matchSearch =
        !search ||
        f.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        f.city
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        f.address
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchProvince =
        province === "All Provinces" ||
        f.province === province;

      const matchType =
        type === "All Types" ||
        f.facility_type === type;

      const match24h =
        !show24h || f.is_24h;

      return (
        matchSearch &&
        matchProvince &&
        matchType &&
        match24h
      );
    }
  );

  return (
    <div className="facilities-page">
      {/* HEADER */}

      <div className="facilities-header">
        <div className="facilities-header-inner">
          <div className="facilities-title-row">
            <div className="facilities-icon">
              <MapPin size={28} />
            </div>

            <div>
              <span className="small-tag">
                BUILT FOR SOUTH AFRICA
              </span>

              <h1>
                Find Healthcare Facilities
              </h1>

              <p>
                Locate clinics, hospitals,
                and pharmacies near you
              </p>
            </div>
          </div>

          <div className="search-box">
            <Search size={20} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by facility name, suburb, city..."
            />
          </div>
        </div>
      </div>

      {/* BODY */}

      <div className="facilities-container">
        {/* FILTERS */}

        <div className="filters">
          <div className="filter-label">
            <Filter size={16} />
            Filter by:
          </div>

          <select
            value={province}
            onChange={(e) =>
              setProvince(e.target.value)
            }
          >
            {PROVINCES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "All Types"
                  ? t
                  : TYPE_CONFIG[t].label}
              </option>
            ))}
          </select>

          <button
            className={`toggle-btn ${
              show24h ? "active" : ""
            }`}
            onClick={() =>
              setShow24h(!show24h)
            }
          >
            <Clock size={15} />
            24/7 Only
          </button>

          <div className="results-pill">
            {filtered.length} found
          </div>
        </div>

        {/* GRID */}

        <div
          className={`facilities-grid ${
            selected ? "split" : ""
          }`}
        >
          {/* LEFT */}

          <div className="facilities-list">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <AlertCircle size={40} />

                <p>
                  No facilities match your
                  search.
                </p>
              </div>
            ) : (
              filtered.map((f) => (
                <FacilityCard
                  key={f.id}
                  facility={f}
                  selected={
                    selected?.id === f.id
                  }
                  onClick={() =>
                    setSelected(
                      selected?.id === f.id
                        ? null
                        : f
                    )
                  }
                />
              ))
            )}
          </div>

          {/* RIGHT */}

          {selected && (
            <FacilityDetail
              facility={selected}
              onClose={() =>
                setSelected(null)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CARD
========================================================= */

function FacilityCard({
  facility,
  selected,
  onClick,
}) {
  const typeConfig =
    TYPE_CONFIG[facility.facility_type];

  return (
    <div
      onClick={onClick}
      className={`facility-card ${
        selected ? "selected" : ""
      }`}
    >
      <div className="facility-content">
        <div className="facility-tags">
          <span
            className="type-pill"
            style={{
              background: typeConfig.bg,
              color: typeConfig.color,
            }}
          >
            {typeConfig.label}
          </span>

          {facility.is_24h && (
            <span className="emergency-pill">
              ● 24/7 EMERGENCY
            </span>
          )}
        </div>

        <h3>{facility.name}</h3>

        <div className="facility-address">
          <MapPin size={14} />
          <span>
            {facility.address},{" "}
            {facility.city}
          </span>
        </div>
      </div>

      <div className="facility-right">
        <div className="rating-box">
          <Star
            size={14}
            fill="#f59e0b"
            color="#f59e0b"
          />

          <span>{facility.rating}</span>
        </div>

        <ChevronRight size={20} />
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL PANEL
========================================================= */

function FacilityDetail({
  facility,
  onClose,
}) {
  const typeConfig =
    TYPE_CONFIG[facility.facility_type];

  return (
    <div className="detail-panel">
      <div className="detail-top">
        <span
          className="type-pill"
          style={{
            background: typeConfig.bg,
            color: typeConfig.color,
          }}
        >
          {typeConfig.label}
        </span>

        <button
          className="close-btn"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      <h2>{facility.name}</h2>

      <div className="detail-divider"></div>

      <div className="detail-info">
        <InfoRow
          icon={MapPin}
          label={`${facility.address}, ${facility.city}, ${facility.province}`}
        />

        <InfoRow
          icon={Phone}
          label={facility.phone}
        />

        <InfoRow
          icon={Clock}
          label={
            facility.is_24h
              ? "Open 24 Hours"
              : "Standard Hours"
          }
        />
      </div>

      <button className="directions-btn">
        <Navigation size={16} />
        Get Directions
      </button>
    </div>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon: Icon,
  label,
}) {
  return (
    <div className="info-row">
      <div className="info-icon">
        <Icon size={14} />
      </div>

      <span>{label}</span>
    </div>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  return (
    <>
      <footer
        style={{
          background: 'var(--neutral-900)',
          color: 'var(--neutral-400)',
          padding: '60px 0 32px',
          marginTop: 'auto',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          {/* TOP SECTION */}

          <div
            className="footer-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: 40,
              marginBottom: 48,
            }}
          >
            {/* BRAND */}

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background:
                      'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Heart
                    size={18}
                    color="white"
                    fill="white"
                  />
                </div>

                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 18,
                    color: 'white',
                  }}
                >
                  MedBridge{' '}
                  <span
                    style={{
                      color: 'var(--primary-500)',
                    }}
                  >
                    AI
                  </span>
                </span>
              </div>

              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  maxWidth: 280,
                  color: 'var(--neutral-500)',
                }}
              >
                Bridging the gap between South
                Africans and the healthcare
                they deserve. AI-powered,
                multilingual, and always
                accessible.
              </p>

              {/* SOCIALS */}

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  marginTop: 20,
                }}
              >
                {[
                  'Facebook',
                  'Twitter',
                  'Instagram',
                ].map((social) => (
                  <a
                    key={social}
                    href="#"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background:
                        'var(--neutral-800)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      color: 'var(--neutral-400)',
                      transition:
                        'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'var(--primary-500)';

                      e.currentTarget.style.color =
                        'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'var(--neutral-800)';

                      e.currentTarget.style.color =
                        'var(--neutral-400)';
                    }}
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* QUICK LINKS */}

            <div>
              <h4
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 16,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Quick Links
              </h4>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {[
                  ['Home', '/'],
                  [
                    'How It Works',
                    '/how-it-works',
                  ],
                  [
                    'Find Facility',
                    '/facilities',
                  ],
                  ['Benefits', '/benefits'],
                ].map(([label, to]) => (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      fontSize: 14,
                      color:
                        'var(--neutral-400)',
                      transition:
                        'color 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        'var(--primary-500)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        'var(--neutral-400)')
                    }
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* SERVICES */}

            <div>
              <h4
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 16,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Services
              </h4>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {[
                  'AI Triage',
                  'Facility Finder',
                  'Benefit Checker',
                  'Appointment Booking',
                  'Telegram Bot',
                ].map((service) => (
                  <span
                    key={service}
                    style={{
                      fontSize: 14,
                      color:
                        'var(--neutral-400)',
                    }}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* IMPORTANT */}

            <div>
              <h4
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 16,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Important
              </h4>

              <div
                style={{
                  background:
                    'var(--neutral-800)',
                  borderRadius:
                    'var(--radius-md)',
                  padding: 16,
                  borderLeft:
                    '3px solid var(--error-600)',
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color:
                      'var(--neutral-400)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  This is not a medical
                  diagnosis. In case of
                  emergency, please call{' '}
                  <strong
                    style={{ color: 'white' }}
                  >
                    10177
                  </strong>{' '}
                  or visit the nearest
                  hospital.
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM */}

          <div
            style={{
              borderTop:
                '1px solid var(--neutral-800)',
              paddingTop: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <p
              style={{
                fontSize: 13,
                margin: 0,
              }}
            >
              © {new Date().getFullYear()}{' '}
              MedBridge AI. All rights
              reserved. Built for South
              Africa.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 24,
                flexWrap: 'wrap',
              }}
            >
              {[
                'Privacy Policy',
                'Terms of Service',
                'Disclaimer',
              ].map((text) => (
                <a
                  key={text}
                  href="#"
                  style={{
                    fontSize: 13,
                    color:
                      'var(--neutral-500)',
                    transition:
                      'color 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color =
                      'white')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      'var(--neutral-500)')
                  }
                >
                  {text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* RESPONSIVE CSS */}

      <style>{`
      
        .container{
          width:100%;
        }

        @media (max-width: 900px){

          .footer-grid{
            grid-template-columns:1fr 1fr !important;
          }

        }

        @media (max-width: 768px){

          .footer-grid{
            grid-template-columns:1fr !important;
          }

        }

      `}</style>
    </>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <>
      <style>{`
      
      :root{

        --primary-50:#ecfeff;
        --primary-500:#0d9aa5;
        --primary-600:#0b7f88;

        --secondary-700:#0f172a;

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

        --success-50:#ecfdf5;
        --success-600:#059669;

        --error-50:#fef2f2;
        --error-600:#dc2626;

        --radius-sm:8px;
        --radius-md:12px;
        --radius-lg:20px;
        --radius-xl:28px;
        --radius-full:999px;

      }

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
        font-family:Inter,sans-serif;
      }

      body{
        background:#edf7f7;
        color:#0f172a;
      }

      a{
        text-decoration:none;
        color:inherit;
      }

      button{
        cursor:pointer;
        border:none;
      }

      /* NAVBAR */

      .navbar{
        height:90px;
        background:white;
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding:0 40px;
        border-bottom:1px solid #eee;
        position:sticky;
        top:0;
        z-index:100;
      }

      .logo{
        display:flex;
        align-items:center;
        gap:14px;
      }

      .logo-icon{
        width:50px;
        height:50px;
        border-radius:50%;
        background:#0d9aa5;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .logo h2{
        font-size:34px;
        font-weight:800;
      }

      .logo span{
        color:#0d9aa5;
      }

      .nav-links{
        display:flex;
        gap:34px;
      }

      .nav-links a{
        color:#475569;
        font-weight:600;
      }

      .active{
        background:#e6f7f6;
        color:#0d9aa5 !important;
        padding:14px 24px;
        border-radius:18px;
      }

      .telegram-btn{
        background:#0d9aa5;
        color:white;
        padding:16px 28px;
        border-radius:999px;
        display:flex;
        align-items:center;
        gap:10px;
        font-weight:700;
      }

      .mobile-menu{
        display:none;
        background:none;
      }

      /* HERO */

      .hero{
        min-height:calc(100vh - 90px);
        display:grid;
        grid-template-columns:1fr 1fr;
        align-items:center;
        padding:70px;
        gap:40px;
      }

      .badge{
        display:inline-block;
        border:2px solid #7dd3d7;
        padding:14px 24px;
        border-radius:999px;
        color:#0d7f88;
        font-weight:700;
        margin-bottom:30px;
        background:white;
      }

      .hero-left h1{
        font-size:78px;
        line-height:0.95;
        font-weight:900;
        margin-bottom:30px;
      }

      .hero-left h1 span{
        color:#0d9aa5;
      }

      .hero-left p{
        font-size:24px;
        line-height:1.7;
        color:#475569;
        margin-bottom:40px;
      }

      .hero-buttons{
        display:flex;
        gap:20px;
        margin-bottom:50px;
      }

      .primary-btn{
        background:#0d9aa5;
        color:white;
        padding:20px 30px;
        border-radius:999px;
        display:flex;
        align-items:center;
        gap:10px;
        font-weight:700;
      }

      .secondary-btn{
        background:white;
        border:2px solid #0d9aa5;
        color:#0d9aa5;
        padding:20px 30px;
        border-radius:999px;
        display:flex;
        align-items:center;
        gap:10px;
        font-weight:700;
      }

      .hero-features{
        display:flex;
        gap:50px;
        padding-top:30px;
        border-top:1px solid #ddd;
      }

      .feature{
        display:flex;
        align-items:center;
        gap:10px;
        color:#475569;
        font-weight:600;
      }

      /* PHONE */

      .hero-right{
        display:flex;
        justify-content:center;
      }

      .phone{
        width:430px;
        height:760px;
        border-radius:50px;
        border:10px solid #0f172a;
        overflow:hidden;
        background:#f1f5f9;
        position:relative;
      }

      .phone-top{
        width:120px;
        height:24px;
        background:#0f172a;
        border-radius:20px;
        position:absolute;
        top:16px;
        left:50%;
        transform:translateX(-50%);
      }

      .phone-header{
        background:#0d8789;
        color:white;
        padding:60px 24px 20px;
        display:flex;
        gap:16px;
        align-items:center;
      }

      .phone-avatar{
        width:48px;
        height:48px;
        background:white;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .chat-area{
        padding:22px;
      }

      .user-message{
        background:#0d9aa5;
        color:white;
        padding:18px;
        border-radius:22px;
        width:max-content;
        max-width:280px;
        margin-left:auto;
        margin-bottom:20px;
      }

      .ai-card{
        background:white;
        border-radius:24px;
        padding:22px;
        box-shadow:0 10px 25px rgba(0,0,0,0.08);
      }

      .card-section{
        margin-top:18px;
      }

      .urgency{
        background:#fef2f2;
        color:#ef4444;
        padding:14px;
        border-radius:12px;
        margin-top:18px;
        font-weight:700;
      }

      .chat-buttons{
        display:flex;
        gap:12px;
        margin-top:18px;
      }

      .chat-buttons button{
        border:1px solid #0d9aa5;
        background:white;
        color:#0d9aa5;
        padding:12px 18px;
        border-radius:999px;
      }

      /* FACILITIES */

      .facilities-page{
        min-height:100vh;
      }

      .facilities-header{
        background:linear-gradient(135deg,#0f172a,#1e293b);
        padding:64px 24px 48px;
      }

      .facilities-header-inner{
        max-width:1200px;
        margin:auto;
      }

      .facilities-title-row{
        display:flex;
        align-items:center;
        gap:18px;
        margin-bottom:30px;
      }

      .facilities-icon{
        width:56px;
        height:56px;
        border-radius:18px;
        background:rgba(255,255,255,0.1);
        display:flex;
        align-items:center;
        justify-content:center;
        color:#67e8f9;
      }

      .small-tag{
        color:#67e8f9;
        font-size:11px;
        font-weight:800;
      }

      .facilities-title-row h1{
        color:white;
        font-size:36px;
      }

      .facilities-title-row p{
        color:#cbd5e1;
      }

      .search-box{
        background:white;
        border-radius:20px;
        padding:14px 20px;
        display:flex;
        align-items:center;
        gap:12px;
        max-width:650px;
      }

      .search-box input{
        border:none;
        outline:none;
        width:100%;
        font-size:16px;
      }

      .facilities-container{
        max-width:1200px;
        margin:auto;
        padding:32px 24px 64px;
      }

      .filters{
        display:flex;
        gap:12px;
        flex-wrap:wrap;
        align-items:center;
        margin-bottom:24px;
      }

      .filter-label{
        display:flex;
        gap:6px;
        align-items:center;
        color:#64748b;
        font-weight:600;
      }

      .filters select{
        padding:12px 16px;
        border-radius:12px;
        border:1px solid #ddd;
      }

      .toggle-btn{
        padding:12px 16px;
        border-radius:12px;
        background:white;
        border:1px solid #ddd;
        display:flex;
        align-items:center;
        gap:8px;
      }

      .toggle-btn.active{
        background:#ecfeff;
        border:2px solid #0d9aa5;
        color:#0d9aa5;
      }

      .results-pill{
        margin-left:auto;
        background:#e2e8f0;
        padding:8px 14px;
        border-radius:999px;
        font-weight:700;
      }

      .facilities-grid{
        display:grid;
        grid-template-columns:1fr;
        gap:24px;
      }

      .facilities-grid.split{
        grid-template-columns:1fr 1fr;
      }

      .facilities-list{
        display:flex;
        flex-direction:column;
        gap:16px;
      }

      .facility-card{
        background:white;
        padding:24px;
        border-radius:24px;
        border:1px solid #e2e8f0;
        display:flex;
        justify-content:space-between;
        align-items:center;
        cursor:pointer;
      }

      .facility-card.selected{
        border:2px solid #0d9aa5;
      }

      .facility-tags{
        display:flex;
        gap:10px;
        margin-bottom:10px;
      }

      .type-pill{
        padding:6px 12px;
        border-radius:999px;
        font-size:11px;
        font-weight:700;
      }

      .emergency-pill{
        background:#fef2f2;
        color:#dc2626;
        padding:6px 12px;
        border-radius:999px;
        font-size:11px;
        font-weight:700;
      }

      .facility-card h3{
        margin-bottom:8px;
      }

      .facility-address{
        display:flex;
        gap:6px;
        color:#64748b;
        font-size:14px;
      }

      .facility-right{
        display:flex;
        align-items:center;
        gap:12px;
      }

      .rating-box{
        background:#fffbeb;
        padding:6px 10px;
        border-radius:10px;
        display:flex;
        gap:4px;
        align-items:center;
      }

      .detail-panel{
        background:white;
        padding:32px;
        border-radius:28px;
        border:1px solid #e2e8f0;
        position:sticky;
        top:120px;
        height:fit-content;
      }

      .detail-top{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:20px;
      }

      .close-btn{
        width:34px;
        height:34px;
        border-radius:50%;
        background:#f1f5f9;
      }

      .detail-divider{
        height:1px;
        background:#e2e8f0;
        margin:20px 0;
      }

      .detail-info{
        display:flex;
        flex-direction:column;
        gap:16px;
        margin-bottom:24px;
      }

      .info-row{
        display:flex;
        gap:12px;
        align-items:flex-start;
      }

      .info-icon{
        width:30px;
        height:30px;
        border-radius:8px;
        background:#ecfeff;
        color:#0d9aa5;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .directions-btn{
        width:100%;
        background:#0d9aa5;
        color:white;
        padding:16px;
        border-radius:999px;
        display:flex;
        justify-content:center;
        align-items:center;
        gap:8px;
        font-weight:700;
      }

      .footer{
        background:#0f172a;
        color:white;
        padding:24px;
        text-align:center;
      }

      .page{
        min-height:70vh;
        padding:60px;
      }

      .spinner{
        width:24px;
        height:24px;
        border:3px solid #ddd;
        border-top-color:#0d9aa5;
        border-radius:50%;
        animation:spin 0.7s linear infinite;
      }

      @keyframes spin{
        to{
          transform:rotate(360deg);
        }
      }

      @media(max-width:1000px){

        .hero{
          grid-template-columns:1fr;
        }

        .facilities-grid.split{
          grid-template-columns:1fr;
        }

      }

      @media(max-width:850px){

        .nav-links,
        .telegram-btn{
          display:none;
        }

        .mobile-menu{
          display:block;
        }

        .hero{
          padding:40px 24px;
        }

        .hero-left h1{
          font-size:52px;
        }

        .phone{
          width:100%;
          max-width:380px;
          height:720px;
        }

      }

      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/how-it-works"
              element={<HowItWorks />}
            />

            <Route
              path="/facilities"
              element={<Facilities />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}