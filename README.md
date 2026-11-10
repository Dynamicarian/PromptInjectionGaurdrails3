# PromptInjectionGaurdrails3

## How to run:
1. Install python 3.14.4
2. Install pip 26.2.1
3. Navigate to backend:
```bash
cd backend
```
4. Create venv:
```bash
python -m venv .venv
```
5. Activate venv (windows powershell):
```bash
venv\Scripts\Activate.ps1
```
6. Install requirements:
```bash
pip install -r requirements.txt
```
7. Start backend api:
```bash
python -m main
```
8. Open new terminal
I usually have both open at once. The new terminal if for the frontend.
9. Navigate to frontend:
```bash
cd frontend
```
10. Install dependencies:
```bash
npm install
```
11. Run frontend:
```bash
npm run dev
```
12. you can click on the link to localhost in fronend terminal<br>
usually: http://localhost:5173/
13. To use test page go to http://localhost:5173/test
<br>
Test page code is here: [frontend\src\pages\test\TestPage.jsx](frontend\src\pages\test\TestPage.jsx)

### Also
Exit out of either by going to the terminal and pressing Ctrl + C.
<br>
You will need to stop and start the backend every time you make changes.<br>
Frontend usually updates in real time.
<br>
You can delete [results.db](backend\results.db) at any point. When you restart the backend a new, empty results.db will be created if one is not already present.
<br><br>
Prompts normalisation should happen in here:
[backend\core.py](backend\core.py)
under the comment: <br>"here is where prompt should be normalised"

### Architecture Diagram

![alt text](image.png)

# Threat Model 
Before establishing defensive safeguards, it is critical to define the specific threat landscape facing this application. In our achitecture comprising a FastAPI backend,sequential result IDs, and asynchronous prompt processing presents distinct attack surfaces that require targeted mitigation. 
## Who would want to attack your application? 
The primary adversaries facing this application includes a person that wants an injection to get past the guardrail. Furthermore, attackers or bots that actively scanning seeking to exploit resource limits or unvalidated inputs. Hackers who wants to manipulate a web applications database and gain unauthorised access, control.  
## What are they trying to achieve? 
### Denial of Service via Concurrency and Payload Flooding: 
 - Objective: Exhaust server resources, block thread pools, and render the application unresponsive. 
 - Method: An attacker can script rapid fire requests to the prompt end point or send maximium length payloads designed to maximize processing overhead. Because the application handles intensive backend tasks via a restricted work pool, an unmanaged flood of traffic locks up available slots, forcing legitimate users to experience frequent 503 or 504 erros. 
### SQL Injection via Unsanitized Parameters:
- Objective: Bypass authentication mechanisms, extract sensitive table records, or alter database states through raw query manipulation.
- Method: If user-supplied inputs—such as prompt strings or query parameters like result IDs—are concatenated directly into SQL queries without proper parameterization or ORM abstraction, an attacker can inject malicious SQL syntax. This enables unauthorized read access to historical user prompt.
## What can they actually do it? 
Successful execution of these attacks would severely degrade user trust, violate data privacy standards, and compromise system availability. By explicitly identifying these vectors resource exhaustion via DoS and query manipulation via SQLi. We establish the foundational justification for the multi-layered defensive controls implemented in section 2.7, including strict input sanitization, parameterized queries, and concurrency guards.

# Advanced attack 
The Advanced Security feature protects the Prompt Injection Guardrail against **Unicode-based detection evasion attacks**, where attackers use visually similar characters to disguise malicious prompts and bypass detection.
### How It Works
1. **Evasion Attack:** Converts standard characters into fullwidth Unicode characters to test whether malicious prompts can bypass the detection model.
2. **NFKC Defence:** Normalises Unicode characters before passing prompts to the machine-learning model while preserving the original input for display.
3. **Security Evaluation:** Compares malicious and benign prompt classifications before and after implementing the defence.
4. **Performance Benchmarking:** Measures the additional processing time introduced by NFKC normalisation.
### Experimental Results
The experiment used **40 malicious and 40 benign prompts**, testing both their original and fullwidth versions.
### Performance Cost
The benchmark used **80 prompts**, with 20 repetitions per timing sample and 200 samples per variant.
The results indicate that NFKC normalisation significantly reduces the success of the tested evasion attacks while introducing minimal preprocessing overhead.
### Advanced Security Evaluation Page
The application includes an Advanced Security Evaluation webpage at `/security-results` to visualise the experimental findings.


