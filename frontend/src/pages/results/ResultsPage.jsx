import { Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useState, useRef } from 'react';

import ResultBanner from './components/ResultBanner.jsx';
import SubmittedPrompt from './components/SubmittedPrompt.jsx';
import GuardrailDiagnostics from './components/GuardrailDiagnostics.jsx';
import SafetyMetrics from './components/SafetyMetrics.jsx';
import PromptHistory from './components/PromptHistory.jsx';

import api from '../../api';

import { findSuspiciousSpans } from './HighlightPrompt.js';

//import { mockResult } from '../../data/mockResults.js';

import './ResultsPage.css';


function ResultsPage() {

  const location = useLocation();
  const navigate = useNavigate();
  const [submittedPrompt] = useState(() => location.state?.prompt ?? null);
  const [result, setResult] = useState(
    submittedPrompt
      ? {
        id: null,
        prompt: submittedPrompt,
        status: "pending",
        features: null,
        highlightedSpans: findSuspiciousSpans(submittedPrompt),
        attackTypeConfidences: null
      }
      : null
  );

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(!submittedPrompt);
  const [error, setError] = useState('');
  const hasSubmitted = useRef(false);


  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await api.get('/results');

        // Convert backend object into an array
        const records = Object.entries(response.data).map(([id, data]) => ({
          id: Number(id),
          prompt: data.prompt,
          checkedAt: new Date(data.timestamp * 1000).toISOString(),

          status: data.supervised.label ? "blocked" : "allowed",
          features: data.supervised.features,

          highlightedSpans: findSuspiciousSpans(data.prompt),
          attackTypeConfidences: data.attack_type?.percentages ?? null
        }));

        // Latest result first
        records.sort((a, b) => b.id - a.id);

        setHistory(records);

        // Automatically select the latest result
        if (!submittedPrompt && records.length > 0) {
          setResult(records[0]);
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load results.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [submittedPrompt]);

  //for process new submitted prompt
  useEffect(() => {
    if (!submittedPrompt || hasSubmitted.current) return;

    hasSubmitted.current = true;
    // Clear the prompt from browser navigation history
    navigate(location.pathname, {
      replace: true,
      state: null
    });
    async function submitPrompt() {
      const startTime = Date.now();
      try {
        setError("");

        // Step 1: Submit prompt
        await api.post('/prompt', {
          prompt: submittedPrompt
        });

        // Step 2: Get latest result ID
        const latestResponse = await api.get('/result/latest_id');
        const latestId = latestResponse.data;

        // Step 3: Get the prediction using its ID
        const response = await api.get('/result', {
          params: { id: latestId }
        });

        const data = response.data;

        // Check that we retrieved the correct prompt
        if (data.prompt !== submittedPrompt) {

          throw new Error("Latest result does not match submitted prompt");
        }

        // Step 4: Convert backend data for our frontend
        const completedResult = {
          id: Number(latestId),
          prompt: data.prompt,
          status: data.supervised.label ? "blocked" : "allowed",
          features: data.supervised.features,
          highlightedSpans: findSuspiciousSpans(data.prompt),
          attackTypeConfidences: data.attack_type?.percentages ?? null,
          checkedAt: new Date(data.timestamp * 1000).toISOString()
        };


        // For 1.5s
        const elapsed = Date.now() - startTime;
        // Keep Pending visible
        const remaining = Math.max(0, 1500 - elapsed);

        await new Promise(resolve => setTimeout(resolve, remaining));

        // Step 5: Update the Results Page
        setResult(completedResult);

        // Refresh Prompt History
        const historyResponse = await api.get('/results');

        // Convert and sort history
        const updatedHistory = Object.entries(historyResponse.data)
          .map(([id, data]) => ({
            id: Number(id),
            prompt: data.prompt,
            checkedAt: new Date(data.timestamp * 1000).toISOString(),
            status: data.supervised.label ? "blocked" : "allowed",
            features: data.supervised.features,
            highlightedSpans: findSuspiciousSpans(data.prompt),
            attackTypeConfidences: data.attack_type?.percentages ?? null
          }));

        updatedHistory.sort((a, b) => b.id - a.id);

        // Update Prompt History
        setHistory(updatedHistory);

      } catch (err) {
        console.error("Failed to process prompt:", err);
        setError("Unable to retrieve the completed prediction.");
      }
    }

    submitPrompt();

  }, [submittedPrompt]);



  if (loading) {
    return (
      <main className="results-page">
        <p>Loading results...</p>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="results-page">
        <p>{error || "No previous results found."}</p>
        <PromptHistory
          history={history}
          selectedId={null}
          onSelect={setResult}
        />
      </main>
    );
  }



  return (
    <main className="results-page">
      {/* Prediction status */}
      <ResultBanner status={result.status} />
      <div className="results-grid">
        <div className="results-left">
          {/* Original prompt and matched phrases */}
          <SubmittedPrompt
            prompt={result.prompt}
            highlightedSpans={result.highlightedSpans}
          />
          {/* Diagnostics - next component */}
          <GuardrailDiagnostics
            features={result.features}
            status={result.status}
          />
        </div>
        {/* Safety metrics - future component */}
        {/* The result will be NULL for allowed and pending state */}
        <SafetyMetrics
          status={result.status}
          attackTypeConfidences={
            result.status === "blocked"
              ? result.attackTypeConfidences
              : null
          }
        />
      </div>

      <div className="results-actions">
        <Link to="/">Check Another Prompt</Link>
      </div>
      <PromptHistory
        history={history}
        selectedId={result.id}
        onSelect={setResult}
      />
    </main>
  );
}
export default ResultsPage;
