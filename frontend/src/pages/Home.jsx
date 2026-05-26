import { useState } from 'react';
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

const PROVINCES = [
  'All Provinces',
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Free State',
  'Northern Cape',
];

const TYPES = ['All Types', 'hospital', 'clinic', 'pharmacy', 'emergency'];

const TYPE_CONFIG = {
  hospital: { label: 'Hospital', color: '#00a896', bg: '#eef7f6' },
  clinic: { label: 'Clinic', color: 'var(--primary-600, #11999e)', bg: 'rgba(17,153,158,0.1)' },
  pharmacy: { label: 'Pharmacy', color: 'var(--success-600, #2e7d32)', bg: '#edf7ed' },
  emergency: { label: 'Emergency', color: '#dc2626', bg: '#fef2f2' },
};

// Local data array acting as your main dataset
const INITIAL_FACILITIES = [
  { id: 1, name: 'Gauteng Central Medical Hub', address: '128 Jan Smuts Ave, Rosebank', city: 'Johannesburg', province: 'Gauteng', facility_type: 'hospital', is_24h: true, rating: 4.8, phone: '011 555 0123' },
  { id: 2, name: 'Cape Health Clinic', address: '42 Long Street, Cape Town Central', city: 'Cape Town', province: 'Western Cape', facility_type: 'clinic', is_24h: false, rating: 4.2, phone: '021 555 4567' },
  { id: 3, name: 'Durban North 24hr Pharmacy', address: '45 Swapo Rd, Durban North', city: 'Durban', province: 'KwaZulu-Natal', facility_type: 'pharmacy', is_24h: true, rating: 4.6, phone: '031 555 7890' },
  { id: 4, name: 'Pretoria East Emergency Care', address: '98 Garsfontein Rd', city: 'Pretoria', province: 'Gauteng', facility_type: 'emergency', is_24h: true, rating: 4.9, phone: '012 555 3210' }
];

export default function Facilities() {
  const [facilities] = useState(INITIAL_FACILITIES);
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('All Provinces');
  const [type, setType] = useState('All Types');
  const [selected, setSelected] = useState(null);
  const [show24h, setShow24h] = useState(false);

  const filtered = facilities.filter((f) => {
    const matchSearch =
      !search ||
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.city?.toLowerCase().includes(search.toLowerCase()) ||
      f.address?.toLowerCase().includes(search.toLowerCase());

    const matchProvince = province === 'All Provinces' || f.province === province;
    const matchType = type === 'All Types' || f.facility_type === type;
    const match24h = !show24h || f.is_24h;

    return matchSearch && matchProvince && matchType && match24h;
  });

  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#f4f9f8', color: '#0f2d37', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f2d37, #007a78)',
          padding: '64px 24px 48px 24px',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={28} color="#00a896" />
            </div>

            <div>
              <span style={{ color: '#00a896', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                BUILT FOR SOUTH AFRICA
              </span>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Find Healthcare Facilities
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, margin: '4px 0 0 0' }}>
                Locate clinics, 24/7 hospitals, and pharmacies near you
              </p>
            </div>
          </div>

          {/* SEARCH INPUT */}
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 10px 25px -5px rgba(15,45,55,0.15)',
              maxWidth: '700px'
            }}
          >
            <Search size={20} color="#00a896" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by facility name, suburb, city..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 16,
                color: '#0f2d37',
                background: 'transparent'
              }}
            />
          </div>
        </div>
      </div>

      {/* FILTER BAR & GRID LAYOUT */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 64px' }}>
        
        {/* FILTERS */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#527883', fontSize: 14, fontWeight: 600, marginRight: 8 }}>
            <Filter size={16} color="#527883" />
            <span>Filter by:</span>
          </div>

          <div style={{ position: 'relative' }}>
            <select 
              value={province} 
              onChange={(e) => setProvince(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #cce3e1',
                background: 'white',
                color: '#0f2d37',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                paddingRight: '32px'
              }}
            >
              {PROVINCES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: '#527883' }}>▼</span>
          </div>

          <div style={{ position: 'relative' }}>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #cce3e1',
                background: 'white',
                color: '#0f2d37',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                paddingRight: '32px'
              }}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All Types' ? t : TYPE_CONFIG[t].label}
                </option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 10, color: '#527883' }}>▼</span>
          </div>

          {/* Toggle Pills */}
          <button 
            onClick={() => setShow24h(!show24h)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: show24h ? '2px solid #00a896' : '1px solid #cce3e1',
              background: show24h ? '#eef7f6' : 'white',
              color: show24h ? '#00a896' : '#0f2d37',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Clock size={15} />
            24/7 Only
          </button>

          <span style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 600, color: '#527883', background: '#e1eff0', padding: '6px 14px', borderRadius: '20px' }}>
            {filtered.length} facilities found
          </span>
        </div>

        {/* SPLIT SCREEN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 24, alignItems: 'start' }}>
          
          {/* LEFT: RESULTS COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '20px', padding: 48, textAlign: 'center', border: '1px dashed #cce3e1' }}>
                <AlertCircle size={40} color="#527883" style={{ marginBottom: 12 }} />
                <p style={{ margin: 0, fontWeight: 600, color: '#0f2d37' }}>No facilities match your parameters.</p>
                <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#527883' }}>Try adjusting your search query or region toggle.</p>
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

          {/* RIGHT: DETAIL VIEW PANEL */}
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
    color: '#527883',
    bg: '#f4f9f8',
  };

  return (
    <div
      onClick={onClick}
      style={{
        padding: '24px',
        background: 'white',
        borderRadius: '20px',
        border: selected ? '2px solid #00a896' : '1px solid #e1eff0',
        boxShadow: selected ? '0 12px 20px -8px rgba(0,168,150,0.15)' : '0 4px 12px -2px rgba(15,45,55,0.03)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
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
              borderRadius: '20px',
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
            <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              ● 24/7 EMERGENCY
            </span>
          )}
        </div>

        <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, color: '#0f2d37' }}>
          {facility.name}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#527883', fontSize: 13 }}>
          <MapPin size={14} color="#00a896" style={{ flexShrink: 0 }} />
          <span>{facility.address}, {facility.city}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {facility.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fffbeb', padding: '6px 10px', borderRadius: '10px', border: '1px solid #fde68a' }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#b45309' }}>{facility.rating}</span>
          </div>
        )}
        <ChevronRight size={20} color={selected ? '#00a896' : '#cce3e1'} />
      </div>
    </div>
  );
}

/* ---------------- DETAIL VIEW COMPONENT ---------------- */

function FacilityDetail({ facility, onClose }) {
  const typeConfig = TYPE_CONFIG[facility.facility_type] || {
    label: facility.facility_type,
    color: '#527883',
    bg: '#f4f9f8',
  };

  return (
    <div 
      style={{ 
        padding: '32px', 
        background: 'white', 
        borderRadius: '24px',
        border: '1px solid #e1eff0',
        boxShadow: '0 20px 40px -4px rgba(15,45,55,0.08)',
        position: 'sticky',
        top: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <span
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
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
            background: '#f4f9f8',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#0f2d37'
          }}
        >
          <X size={18} />
        </button>
      </div>

      <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 800, color: '#0f2d37', lineHeight: 1.2 }}>
        {facility.name}
      </h2>

      <hr style={{ border: 'none', borderTop: '1px solid #e1eff0', margin: '20px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        <InfoRow icon={MapPin} label={`${facility.address}, ${facility.city}, ${facility.province}`} />
        {facility.phone && (
          <InfoRow icon={Phone} label={facility.phone} href={`tel:${facility.phone}`} />
        )}
        <InfoRow 
          icon={Clock} 
          label={facility.is_24h ? 'Open 24 Hours, 7 Days a week' : 'Standard Operating Hours'} 
          subColor={facility.is_24h ? '#dc2626' : '#527883'}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button 
          style={{ 
            flex: 1, 
            background: '#00a896', 
            color: 'white', 
            border: 'none', 
            padding: '14px', 
            borderRadius: '14px', 
            fontWeight: 700, 
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
      <div style={{ width: 28, height: 28, borderRadius: '8px', background: '#eef7f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        <Icon size={14} color="#00a896" />
      </div>
      <span style={{ fontSize: 15, color: subColor || '#334e56', fontWeight: 500, lineHeight: 1.4 }}>{label}</span>
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