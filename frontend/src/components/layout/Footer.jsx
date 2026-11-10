import { NavLink } from "react-router";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Project name */}
        <span className="footer-brand">
          Prompt Injection Guardrail Checker
        </span>

        {/* Footer items */}
        <div className="footer-links">
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
