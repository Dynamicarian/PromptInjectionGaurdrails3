import { Link, useParams } from "react-router";
import { ERRORS } from "./errorContent";
import "./NotFound.css";

export default function ErrorPage({ code, message, onRetry }) {
  const params = useParams();
  const key = code ?? params.code;                  // prop wins, then /error/:code
  const info = ERRORS[key] ?? ERRORS.default;

  return (
    <main className="notfound">
      <p className="notfound-code">{info.status}</p>
      <h1 className="notfound-title">{info.title}</h1>
      <p className="notfound-text">{message ?? info.text}</p>
      <div className="notfound-actions">
        <Link to="/" className="notfound-button">Go to home</Link>
        {onRetry && (
          <button className="notfound-button secondary" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </main>
  );
}