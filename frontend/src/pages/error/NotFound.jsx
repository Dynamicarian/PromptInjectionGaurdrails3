import { Link, useLocation } from "react-router-dom";
import "../styles/notfound.css";

export default function NotFound() {
  const location = useLocation();

  return (
    <main className="notfound">
      <p className="notfound-code">404</p>
      <h1 className="notfound-title">Page not found</h1>
      <p className="notfound-text">
        There is nothing at <code>{location.pathname}</code>. The link may be
        broken, or the page may have moved.
      </p>
      <div className="notfound-actions">
        <Link to="/" className="notfound-button">Go to home</Link>
        <button className="notfound-button secondary" onClick={() => window.history.back()}>
          Go back
        </button>
      </div>
    </main>
  );
}