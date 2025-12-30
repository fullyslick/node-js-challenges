### Problem 1: Async Parallel Data Fetcher

**Difficulty:** Intermediate  
**Time Estimate:** 30-40 minutes

#### Problem Statement

You are building a search endpoint that aggregates data from multiple external services. Implement a function that fetches data from multiple URLs in parallel and returns the combined results.

#### Requirements

1. Fetch data from all URLs in **parallel** (not sequentially)
2. If any request fails, include an error object for that URL instead of failing entirely
3. Return results in the same order as the input URLs
4. Implement a timeout - if a request takes longer than `timeoutMs`, treat it as failed
5. The function should never throw - always return a results array

#### Function Signature

```javascript
/**
 * @param {string[]} urls - Array of URLs to fetch
 * @param {number} timeoutMs - Timeout in milliseconds for each request
 * @returns {Promise<Array>}
 */
async function fetchAllWithTimeout(urls, timeoutMs) {
  // Your implementation here
}
```

#### Example

```javascript
const urls = [
  'https://api.example.com/users',
  'https://api.example.com/products',
  'https://api.example.com/slow-endpoint' // This one times out
];

const results = await fetchAllWithTimeout(urls, 5000);

// Expected output:
[
  { url: 'https://api.example.com/users', data: { users: [...] } },
  { url: 'https://api.example.com/products', data: { products: [...] } },
  { url: 'https://api.example.com/slow-endpoint', error: 'Request timed out' }
]
```

#### Test Cases to Consider

- All requests succeed
- All requests fail
- Mixed success/failure
- Empty URLs array
- Timeout edge cases