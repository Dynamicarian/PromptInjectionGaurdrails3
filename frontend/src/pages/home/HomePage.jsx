import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../api'
import './HomePage.css';

const MAX_PROMPT_CHARS = 5000;

function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [promptResponse, setPromptResponse] = useState(null); 
  const navigate = useNavigate(); 
 
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (prompt.trim() === "") {
      setError("Please enter a prompt before submitting");
      return;
    } 

    try {
      const response =  await api.post('/prompt', {prompt: prompt,}); 
      setPromptResponse(response.data); 
      console.log("Prompt has been send successfully");
      navigate('/results', {state: {prompt}}); 
    } catch (error)
    { 
      console.log(error.response);              
      const status = error.response?.status;

      if (status === 422) {
        setError("Your prompt is too long. The limit is 5000 characters.");
      } else if (status === 503) {
        setError("The server is busy right now. Try again in a few seconds.");
      } else if (!err.response) {
        setError("Can't reach the server. Check that the backend is running.");
      } else {
        setError("Failed to send the prompt. Please try again.");
      } 
    }; 
  }

  function onChange(e) {
    setPrompt(e.target.value);
    if (error) setError("");
  }

  return (
  <main className="home-page">
    <h1 className="home-statement">
      Prompt injection is the quiet attack on every language model app.
      Guardrail checks each prompt before your model ever sees it.
    </h1>

    <section className="home-steps">
      <h2 className="home-section-title">How it works</h2>
      <div className="steps-grid">
        <article className="step">
          <span className="step-number">01</span>
          <h3>Paste a prompt</h3>
          <p>Type or paste any instruction you plan to send to a language model.</p>
        </article>
        <article className="step">
          <span className="step-number">02</span>
          <h3>We analyse it</h3>
          <p>An SVM looks for override phrases, sensitive targets and obfuscation.</p>
        </article>
        <article className="step">
          <span className="step-number">03</span>
          <h3>See the verdict</h3>
          <p>Get an allowed or blocked result with the suspicious words highlighted.</p>
        </article>
      </div>
    </section>

    <section className="home-panel">
      <form className="home-card" onSubmit={handleSubmit} noValidate>
        <label className="home-heading" htmlFor="prompt-textarea">
          Write the prompt you want to check below
        </label>

        <textarea
          className="home-textarea"
          name="submitted-prompt"
          id="prompt-textarea"
          placeholder="Write your prompt here"
          value={prompt}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "prompt-error" : undefined}
        />

        {error && (
          <p id="prompt-error" className="home-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="home-submit">
          Check prompt
        </button>
      </form>
    </section>

    <section className="home-mission">
      <h2 className="home-section-title">Our mission</h2>
      <p className="mission-lead">
        To make large language models safer to build on, by catching prompt
        injection before it reaches the model and by showing people exactly why
        a prompt was blocked.
      </p>

      <div className="mission-points">
        <article className="mission-point">
          <h3>Protect</h3>
          <p>
            Detect attempts to override instructions, extract sensitive data or
            hide an attack behind obfuscation.
          </p>
        </article>
        <article className="mission-point">
          <h3>Explain</h3>
          <p>
            Highlight the words that triggered a decision, so a block is never a
            black box.
          </p>
        </article>
        <article className="mission-point">
          <h3>Stay open</h3>
          <p>
            Publish our data and results, so anyone can check how well the
            guardrail actually performs.
          </p>
        </article>
      </div>
    </section>

    
  </main>
);
}

export default HomePage;
