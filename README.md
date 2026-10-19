# PromptInjectionGaurdrails3

## TEMP:
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
.\.venv\Scripts\Activate.ps1
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