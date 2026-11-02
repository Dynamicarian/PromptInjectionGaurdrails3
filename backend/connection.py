from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from concurrent.futures import ThreadPoolExecutor
from uuid import UUID
import data_report
import uvicorn
import core
import time 
import threading
import asyncio

MAX_PROMPT_CHARS = 5000 # the total number of characters allowed in a prompt
MAX_INFLIGHT = 4 # expensive job allowed at once
JOB_TIMEOUT = 10 # seconds before a job is considered timed out

executor = ThreadPoolExecutor(max_workers=MAX_INFLIGHT)
inflight = 0 

slots = threading.BoundedSemaphore(MAX_INFLIGHT)

async def run_guarded(fn, *args):
    """Run fn in the worker pool, or reject immediately with 503 if the pool is full"""
    global inflight
    if inflight >= MAX_INFLIGHT:
        raise HTTPException(
            status_code=503, 
            detail="Server busy, try again shortly", 
            headers={"Retry-After": "2"}
        )
    inflight += 1
    loop = asyncio.get_event_loop()
    fut = loop.run_in_executor(executor, fn, *args)

    def release(_):
        global inflight 
        inflight -= 1
    fut.add_done_callback(release)

    try:
        return await asyncio.wait_for(asyncio.shield(fut), timeout=JOB_TIMEOUT)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Request took too long")
    
def init_conn():
    uvicorn.run(app)

app = FastAPI()

# class Message(BaseModel):
#     message: str

# CORS (Cross-Origin Resource Sharing) middleware configuration
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    prompt: str = Field(max_length=MAX_PROMPT_CHARS)

@app.post("/prompt")
async def process_prompt(data: Prompt):
    await run_guarded(lambda: core.process_prompt(prompt=data.prompt))
    return {
        "received": data.prompt,
    }

@app.get("/results")
def get_results():
    return core.get_results()

@app.get("/result")
def get_result_by_id(id: int):
    return core.get_result(id)

@app.get("/result/latest_id")
def get_latest_result_id():
    return core.get_latest_result_id()

@app.delete("/result/delete")
def delete_result_by_id(id: int):
    core.delete_result(id)
    return { "status": "success" }

@app.get("/data")
def get_data():
    return data_report.get_data_report()

@app.get("/model_report")
def get_confusion_metrics():
    return data_report.confusion_metrics()

@app.get("/threshold_report")
def get_threshold_report():
    return data_report.threshold_metrics()


#cheap route used to prove the server is still responsive
@app.get("/health")
async def health():
    return {"state": "ok"}

# demo only: a deliberately expensive request that uses the guard
@app.get("/slow")
async def slow(seconds: float = 5):
    await run_guarded(time.sleep, min(seconds, 10))
    return {"status": "done"}

# demo only: the broken version, to show what the guard prevents
@app.get("/slow_blocking")
async def slow_blocking(seconds: float = 5):
    time.sleep(min(seconds, 10))    # blocks the whole event loop
    return {"status": "done"}