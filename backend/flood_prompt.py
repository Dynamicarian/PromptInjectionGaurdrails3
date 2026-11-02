import asyncio
from collections import Counter

import httpx

BASE = "http://localhost:8000"


async def post_prompt(client):
    try:
        r = await client.post(BASE + "/prompt", json={"prompt": "hello world"})
        return r.status_code
    except Exception as e:
        return type(e).__name__


async def main():
    async with httpx.AsyncClient(timeout=30, limits=httpx.Limits(max_connections=200)) as c:
        tasks = [asyncio.create_task(post_prompt(c)) for _ in range(30)]
        print("Flood sent. Use the website now...")
        results = await asyncio.gather(*tasks)
    print("status codes:", dict(Counter(results)))


asyncio.run(main())