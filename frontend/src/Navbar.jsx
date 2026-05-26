import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      background: "white",
      borderBottom: "1px solid #eee"
    }}>
      <h2>MedBridge AI</h2>

      <div style={{ display: "flex", gap: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/how-it-works">How it works</Link>
        <Link to="/facilities">Facilities</Link>
      </div>
    </nav>
  );
}