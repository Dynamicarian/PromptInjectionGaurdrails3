import asyncio
import time 
from collections import Counter 

import httpx 

BASE = "http://localhost:8000"

async def timed(client, path): 
    start = time.perf_counter()
    try:
        r = await client.get(BASE + path)
        return r.status_code, time.perf_counter() - start
    except Exception as e: 
        return type(e).__name__, time.perf_counter() - start

async def test_one_expensive(slow_path):
    print(f"\n--- One expensive request ({slow_path}), then 5 health checks ---")
    async with httpx.AsyncClient(timeout=30) as c:
        slow = asyncio.create_task(timed(c, slow_path))
        await asyncio.sleep(0.5)                       # let it start
        for i in range(5):
            status, secs = await timed(c, "/health")
            print(f"health {i + 1}: {status} in {secs * 1000:.0f} ms")
        status, secs = await slow
        print(f"expensive request finished: {status} in {secs:.1f} s")


async def test_flood(n=50):
    print(f"\n--- {n} expensive requests at once ---")
    async with httpx.AsyncClient(
        timeout=30, limits=httpx.Limits(max_connections=200)
    ) as c:
        flood = [asyncio.create_task(timed(c, "/slow?seconds=2")) for _ in range(n)]
        await asyncio.sleep(0.5)
        status, secs = await timed(c, "/health")
        print(f"health during flood: {status} in {secs * 1000:.0f} ms")
        results = await asyncio.gather(*flood)
    print("status codes:", dict(Counter(s for s, _ in results)))


async def main():
    await test_one_expensive("/slow_blocking?seconds=5")   # BAD: health checks stall
    await test_one_expensive("/slow?seconds=5")            # GOOD: health stays fast
    await test_flood()

if __name__ == "__main__":
    asyncio.run(main())