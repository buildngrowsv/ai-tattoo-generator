# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke/smoke.spec.ts >> API route sanity >> POST /api/generate returns structured error on empty body
- Location: tests/smoke/smoke.spec.ts:61:7

# Error details

```
Error: apiRequestContext.post: connect ECONNREFUSED ::1:3847
Call log:
  - → POST http://localhost:3847/api/generate
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - Content-Type: application/json
    - content-length: 2

```