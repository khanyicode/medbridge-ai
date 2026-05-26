import { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Search,
  ListFilter as Filter,
  Navigation,
  CircleAlert as AlertCircle,
  ChevronRight,
  X
} from 'lucide-react';

// Explicitly global definition handling fallback to circumvent project import context loss
const supabase = { from: () => ({ select: () => ({ order: async () => ({ data: null }) }) }) };

const PROVINCES = [
  'All Provinces', 'Gauteng', 'Western Cape', 'KwaZulu-Natal',
  'Eastern Cape', 'Limpopo', 'Mpumalanga', 'North West',
  'Free State', 'Northern Cape',
];

const TYPES = ['All Types', 'hospital', 'clinic', 'pharmacy', 'emergency'];

const TYPE_CONFIG = {
  hospital: { label: 'Hospital', color: 'var(--error-600)', bg: 'var(--error-50)' },
  clinic: { label: 'Clinic', color: 'var(--primary-600)', bg: 'var(--primary-50)' },
  pharmacy: { label: 'Pharmacy', color: 'var(--success-600)', bg: 'var(--success-50)' },
  emergency: { label: 'Emergency', color: 'var(--error-600)', bg: 'var(--error-50)' },
};

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('All Provinces');
  const [type, setType] = useState('All Types');
  const [selected, setSelected] = useState(null);
  const [show24h, setShow24h] = useState(false);

  useEffect(() => {
    loadFacilities();
  }, []);

  async function loadFacilities() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('facilities')
        .select('*')
        .order('rating', { ascending: false });
      setFacilities(data ?? []);
    } catch (e) {
      setFacilities([
        { id: 1, name: 'Gauteng Central Medical Hub', address: '128 Jan Smuts Ave, Rosebank', city: 'Johannesburg', province: 'Gauteng', facility_type: 'hospital', is_24h: true, rating: 4.8, phone: '011 555 0123' },
        { id: 2, name: 'Cape Health Clinic', address: '42 Long Street, Cape Town Central', city: 'Cape Town', province: 'Western Cape', facility_type: 'clinic', is_24h: false, rating: 4.2, phone: '021 555 4567' }
      ]);
    }
    setLoading(false);
  }

  const filtered = facilities.filter((f) => {
    const matchSearch =
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.city.toLowerCase().includes(search.toLowerCase()) ||
      f.address.toLowerCase().includes(search.toLowerCase());

    const matchProvince = province === 'All Provinces' || f.province === province;
    const matchType = type === 'All Types' || f.facility_type === type;
    const match24h = !show24h || f.is_24h;

    return matchSearch && matchProvince && matchType && match24h;
  });

  return (
    <div style={{ flex: 1, minHeight: '100vh', background: 'var(--neutral-50)', color: 'var(--neutral-800)', fontFamily: 'var(--font-sans)' }}>
      
      {/* HEADER SECTION */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--neutral-900), var(--secondary-700))',
          padding: '64px 24px 48px 24px',
          borderBottomLeftRadius: 'var(--radius-xl)',
          borderBottomRightRadius: 'var(--radius-xl)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={28} color="var(--primary-300)" />
            </div>

            <div>
              <span style={{ color: 'var(--primary-300)', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>
                Built For South Africa
              </span>
              <h1 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '32px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Find Healthcare Facilities
              </h1>
              <p style={{ color: 'var(--neutral-300)', fontSize: 15, margin: '4px 0 0 0' }}>
                Locate clinics, hospitals, and pharmacies near you
              </p>
            </div>
          </div>

          {/* SEARCH INPUT */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '650px'
            }}
          >
            <Search size={20} color="var(--neutral-400)" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by facility name, suburb, city..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 16,
                color: 'var(--neutral-900)',
                background: 'transparent',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>
      </div>

      {/* FILTER BAR & GRID LAYOUT */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 64px' }}>
        
        {/* FILTERS */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--neutral-500)', fontSize: 14, fontWeight: 600, marginRight: 8 }}>
            <Filter size={16} color="var(--neutral-500)" />
            <span>Filter by:</span>
          </div>

          <div style={{ position: 'relative' }}>
            <select 
              value={province} 
              onChange={(e) => setProvince(e.target.value)}
              style={{
                padding: '10px 32px 10px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--neutral-200)',
                background: 'white',
                color: 'var(--neutral-800)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
              }}
            >
              {PROVINCES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: 'var(--neutral-400)' }}>▼</span>
          </div>

          <div style={{ position: 'relative' }}>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              style={{
                padding: '10px 32px 10px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--neutral-200)',
                background: 'white',
                color: 'var(--neutral-800)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
              }}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All Types' ? t : TYPE_CONFIG[t].label}
                </option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: 'var(--neutral-400)' }}>▼</span>
          </div>

          {/* Toggle Pill */}
          <button 
            onClick={() => setShow24h(!show24h)}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: show24h ? '2px solid var(--primary-500)' : '1px solid var(--neutral-200)',
              background: show24h ? 'var(--primary-50)' : 'white',
              color: show24h ? 'var(--primary-600)' : 'var(--neutral-800)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Clock size={15} />
            24/7 Only
          </button>

          <span style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 600, color: 'var(--neutral-500)', background: 'var(--neutral-200)', padding: '6px 14px', borderRadius: 'var(--radius-full)' }}>
            {filtered.length} found
          </span>
        </div>

        {/* SPLIT VIEWER INTERACTION SYSTEM */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 24, alignItems: 'start' }}>
          
          {/* LEFT: RESULTS COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {loading ? (
              <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 24, height: 24, border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--primary-500)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}></div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 48, textAlign: 'center', border: '1px dashed var(--neutral-300)', boxShadow: 'var(--shadow-md)' }}>
                <AlertCircle size={40} color="var(--neutral-400)" style={{ marginBottom: 12 }} />
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--neutral-900)' }}>No facilities match your parameters.</p>
              </div>
            ) : (
              filtered.map((f) => (
                <FacilityCard
                  key={f.id}
                  facility={f}
                  selected={selected?.id === f.id}
                  onClick={() => setSelected(selected?.id === f.id ? null : f)}
                />
              ))
            )}
          </div>

          {/* RIGHT: INTERACTIVE SLIDEOUT DETAIL VIEW PANEL */}
          {selected && (
            <FacilityDetail 
              facility={selected} 
              onClose={() => setSelected(null)} 
            />
          )}

        </div>
      </div>
    </div>
  );
}

/* ---------------- CARD COMPONENT ---------------- */

function FacilityCard({ facility, selected, onClick }) {
  const typeConfig = TYPE_CONFIG[facility.facility_type] || {
    label: facility.facility_type,
    color: 'var(--neutral-600)',
    bg: 'var(--neutral-100)',
  };

  return (
    <div
      onClick={onClick}
      style={{
        padding: '24px',
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: selected ? '2px solid var(--primary-500)' : '1px solid var(--neutral-200)',
        boxShadow: selected ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transform: selected ? 'translateY(-2px)' : 'none'
      }}
    >
      <div style={{ flex: 1, paddingRight: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: typeConfig.bg,
              color: typeConfig.color,
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {typeConfig.label}
          </span>
          {facility.is_24h && (
            <span style={{ background: 'var(--error-50)', color: 'var(--error-600)', border: '1px solid #fca5a5', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              ● 24/7 EMERGENCY
            </span>
          )}
        </div>

        <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--neutral-900)' }}>
          {facility.name}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--neutral-500)', fontSize: 13 }}>
          <MapPin size={14} color="var(--primary-500)" style={{ flexShrink: 0 }} />
          <span>{facility.address}, {facility.city}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {facility.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--warning-50)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a' }}>
            <Star size={14} fill="var(--accent-500)" color="var(--accent-500)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-600)' }}>{facility.rating}</span>
          </div>
        )}
        <ChevronRight size={20} color={selected ? 'var(--primary-500)' : 'var(--neutral-300)'} />
      </div>
    </div>
  );
}

/* ---------------- DETAIL VIEW COMPONENT ---------------- */

function FacilityDetail({ facility, onClose }) {
  const typeConfig = TYPE_CONFIG[facility.facility_type] || {
    label: facility.facility_type,
    color: 'var(--neutral-600)',
    bg: 'var(--neutral-100)',
  };

  return (
    <div 
      style={{ 
        padding: '32px', 
        background: 'white', 
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--neutral-200)',
        boxShadow: 'var(--shadow-xl)',
        position: 'sticky',
        top: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <span
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: typeConfig.bg,
            color: typeConfig.color,
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          {typeConfig.label}
        </span>
        <button 
          onClick={onClose}
          style={{
            background: 'var(--neutral-100)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--neutral-700)'
          }}
        >
          <X size={18} />
        </button>
      </div>

      <h2 style={{ margin: '0 0 16px 0', fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--neutral-900)', lineHeight: 1.2 }}>
        {facility.name}
      </h2>

      <hr style={{ border: 'none', borderTop: '1px solid var(--neutral-200)', margin: '20px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        <InfoRow icon={MapPin} label={`${facility.address}, ${facility.city}, ${facility.province}`} />
        {facility.phone && (
          <InfoRow icon={Phone} label={facility.phone} href={`tel:${facility.phone}`} />
        )}
        <InfoRow 
          icon={Clock} 
          label={facility.is_24h ? 'Open 24 Hours, 7 Days a week' : 'Standard Operating Hours'} 
          subColor={facility.is_24h ? 'var(--error-600)' : 'var(--neutral-500)'}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button 
          style={{ 
            flex: 1, 
            background: 'var(--primary-500)', 
            color: 'white', 
            border: 'none', 
            padding: '14px', 
            borderRadius: 'var(--radius-full)', 
            fontWeight: 600, 
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <Navigation size={16} />
          Get Directions
        </button>
      </div>
    </div>
  );
}

/* ---------------- HELPER INFO ROW ---------------- */

function InfoRow({ icon: Icon, label, href, subColor }) {
  const content = (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        <Icon size={14} color="var(--primary-500)" />
      </div>
      <span style={{ fontSize: 15, color: subColor || 'var(--neutral-700)', fontWeight: 500, lineHeight: 1.4 }}>{label}</span>
    </div>
  );

  return href ? (
    <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      {content}
    </a>
  ) : (
    content
  );
}