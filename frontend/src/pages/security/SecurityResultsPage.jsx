import securityResults from "../../data/securityResults.json";
import SecuritySummary from "./components/SecuritySummary.jsx";
import SecurityBarChart from "./components/SecurityBarChart.jsx";
import SecurityConfusionMatrix from "./components/SecurityConfusionMatrix.jsx";
import SecurityPromptTable from "./components/SecurityPromptTable.jsx";
import normalizationBenchmark from "../../data/normalizationBenchmark.json";
import SecurityPerformanceChart from "./components/SecurityPerformanceChart.jsx";



import "./SecurityResultsPage.css";

export default function SecurityResultsPage() {

    return (
        <main className="security-results-page">

            <header className="security-page-header">
                <h1>Advanced Security Evaluation</h1>

                <p>
                    Detection evasion testing using fullwidth Unicode
                    characters and NFKC normalisation.
                </p>

                <span>
                    {securityResults.length / 2} base prompts tested
                </span>
            </header>

            <SecuritySummary records={securityResults}/>
            <SecurityBarChart records={securityResults}/>
            <SecurityConfusionMatrix records={securityResults}/>
            <SecurityPromptTable records={securityResults}/>
            <SecurityPerformanceChart records={normalizationBenchmark}/>

        </main>
    );
}
