import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
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
        <div className="container">
          
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
                      'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Heart size={18} color="white" fill="white" />
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 18,
                    color: 'white',
                  }}
                >
                  MedBridge{' '}
                  <span style={{ color: 'var(--primary-400)' }}>
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
                Bridging the gap between South Africans
                and the healthcare they deserve.
                AI-powered, multilingual, and always
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
                {['Facebook', 'Twitter', 'Instagram'].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'var(--neutral-800)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        color: 'var(--neutral-400)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'var(--primary-500)';
                        e.currentTarget.style.color = 'white';
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
                  )
                )}
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
                  ['How It Works', '/how-it-works'],
                  ['Facilities', '/facilities'],
                  ['Benefits', '/benefits'],
                ].map(([label, to]) => (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      fontSize: 14,
                      color: 'var(--neutral-400)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        'var(--primary-400)')
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
                      color: 'var(--neutral-400)',
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
                  background: 'var(--neutral-800)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  borderLeft:
                    '3px solid var(--error-500)',
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--neutral-400)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  This is not a medical diagnosis.
                  In case of emergency, call{' '}
                  <strong style={{ color: 'white' }}>
                    10177
                  </strong>{' '}
                  or visit the nearest hospital.
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
              justifyContent: 'space-between',
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
              © 2025 MedBridge AI. All rights reserved.
              Built for South Africa.
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
                    color: 'var(--neutral-500)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
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
        @media (max-width: 900px) {

          .footer-grid{
            grid-template-columns: 1fr 1fr !important;
          }

        }

        @media (max-width: 768px) {

          .footer-grid{
            grid-template-columns: 1fr !important;
          }

        }
      `}</style>
    </>
  );
}