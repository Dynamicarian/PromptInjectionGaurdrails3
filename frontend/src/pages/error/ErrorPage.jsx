import { Link, useParams, useSearchParams } from "react-router";
import "./NotFound.css";

export default function ErrorPage({ code, message, onRetry }) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const display_code = code ?? params.code;

  return (
    <main className="notfound">
      <p className="notfound-code">{display_code}</p>
      <h1 className="notfound-title">Something went wrong</h1>
      <p className="notfound-text">
        {message ?? searchParams.get("message") ?? "An unexpected error occurred."}
      </p>
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