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
      console.log(error.response);               // useful while debugging
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
      <h1 className="home-title">Prompt Injection Guardrail Checker</h1>

      <form className="home-card" onSubmit={handleSubmit} noValidate>
        <label className="home-heading" htmlFor="prompt-textarea">
          Write the instruction
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
          Submit
        </button>
      </form>
    </main>
  );
}

export default HomePage;
