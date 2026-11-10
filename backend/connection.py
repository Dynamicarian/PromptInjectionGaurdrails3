from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
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
MAX_INFLIGHT = 4 # expensive job allowed at once change to 1 to test the behavior when the limit is reached
JOB_TIMEOUT = 10  # seconds before a job is considered timed out change it to 1 to test the timeout behavior

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
    #await asyncio.sleep(5)

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
@app.middleware("http")
async def catch_all(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception:
        return JSONResponse({"detail": "Something went wrong."}, status_code=500)

@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    return JSONResponse({"detail": "Invalid request."}, status_code=422)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["content-type"],
)

class Prompt(BaseModel):
    prompt: str = Field(max_length=MAX_PROMPT_CHARS)

@app.post("/prompt")
async def process_prompt(data: Prompt):
    try:
        await run_guarded(lambda: core.process_prompt(prompt=data.prompt))
    except HTTPException:
        raise  # keep the 503 / 504 from run_guarded
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to process prompt")
    return {
        "received": data.prompt,
    }

@app.get("/results")
def get_results():
    try:
        return core.get_results()
    except Exception:
        raise HTTPException(status_code=500, detail="Could not load results")

@app.get("/result")
def get_result_by_id(id: int):
    try:
        return core.get_result(id)
    except Exception:
        raise HTTPException(status_code=404, detail="Result not found")

@app.get("/result/latest_id")
def get_latest_result_id():
    try:
        return core.get_latest_result_id()
    except Exception:
        raise HTTPException(status_code=404, detail="No results found")

@app.delete("/result/delete")
def delete_result_by_id(id: int):
    try:
        core.delete_result(id)
    except Exception:
        raise HTTPException(status_code=404, detail="Result not found")
    return { "status": "success" }

@app.get("/data")
def get_data():
    try:
        return data_report.get_data_report()
    except Exception:
        raise HTTPException(status_code=500, detail="Could not load data report")

@app.get("/model_report")
def get_confusion_metrics():
    try:
        return data_report.confusion_metrics()
    except Exception:
        raise HTTPException(status_code=500, detail="Could not load model report")

@app.get("/threshold_report")
def get_threshold_report():
    try:
        return data_report.threshold_metrics()
    except Exception:
        raise HTTPException(status_code=500, detail="Could not load threshold report")

#expensive and fast endpoints for testing the behavior of the server under load
@app.get("/expensive")
async def expensive_request():
    # Simulate a heavy 5-second operation
    # time.sleep(5)  # This would block the server, so we use asyncio.sleep instead
    await asyncio.sleep(5)
    return {"status": "expensive task complete"}

@app.get("/fast")
def fast_request():
    return {"status": "quick response"}