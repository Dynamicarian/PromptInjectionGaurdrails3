import './AboutUs.css'

const CHARACTERISTICS = [
  'A light weigth model that can be used to detect malicious prompt',
  'An accuracy of more than 80%',
  'Free to use for all customers'
];

const TEAM = [
  { name: 'Tristain Dinning', role: 'Team Lead' },
  { name: 'Benjamin Lee', role: 'Senior Research Scientist' },
  { name: 'Tisang Lim', role: 'Quality Assurance' },
];

// TODO: replace these answers with your real content
const FAQS = [
  {
    question: 'What is prompt injection?',
    answer:
      'Prompt injection is an attack where input to a language model contains instructions that try to override the developer’s original instructions.',
  },
  {
    question: 'How does the guardrail checker work?',
    answer:
      'You submit a prompt and the checker analyses it for signs of injection, then reports the result on the Results page.',
  },
  {
    question: 'Is my data stored or logged?',
    answer: 'It is both stored and logged. It is logged to detect prompt injection and stored to display your chat history. ',
  },
  {
    question: 'Can I integrate this into my own application?',
    answer: 'No, you can not intergrate this into your own application as this is the first version. We are developing so that users can intergrate this in their own application. ',
  },
  {
    question: 'What types of attacks does it detect?',
    answer: 'It detect attack type such as obfuscation, role playing, data leakage, code execution, and jailbreaking',
  },
];

const CONTACT_EMAIL = 'thisemailwillchange@gmail.com';

function Chevron() {
  return (
    <svg className="about-chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ContactUs() {
  return (
    <section className="about-card" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="about-card-title">Contact Us</h2>
      <p className="about-card-subtitle">Got questions or suggestions? We'd love to hear from you.</p>

      <p className="about-direct">
        Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </section>
  );
}

function AboutUs() {
  return (
    <main className="about-page">
      <div className="about-hero">
        <section className="about-intro">
          <h1>About This Project</h1>
          <p className="about-lead">Be less worried about your LLM security, you developed the LLM we make sure the input prompt is SAFE
             with our up to data advanced AI model. Make the input safe again.  
          </p>

          <ol className="about-characteristics">
            {CHARACTERISTICS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>

          <hr className="about-divider" />

          <h2 className="about-label">Team Members</h2>
          <ul className="about-team">
            {TEAM.map((member) => (
              <li key={member.name}>
                <span className="about-team-name">{member.name}</span>
                <span className="about-team-role">{member.role}</span>
              </li>
            ))}
          </ul>
        </section>

        <ContactUs />
      </div>

      <section className="about-faq" aria-labelledby="faq-heading">
        <p className="about-label">Frequently Asked Questions</p>
        <h2 id="faq-heading">FAQ</h2>
        <p className="about-faq-intro">
          Common questions about how the Prompt Injection Guardrail Checker works, data handling, and integration.
        </p>

        <div className="about-faq-list">
          {FAQS.map((faq) => (
            <details key={faq.question} className="about-faq-item">
              <summary>
                <span>{faq.question}</span>
                <Chevron />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AboutUs;