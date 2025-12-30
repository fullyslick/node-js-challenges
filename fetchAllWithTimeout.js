const { mockFetch } = require('./mockApi');
/**
 * Fetches data from multiple URLs in parallel with timeout handling
 * @param {string[]} urls - Array of URLs to fetch
 * @param {number} timeoutMs - Timeout in milliseconds for each request
 * @returns {Promise<Array<{url: string, data?: any, error?: string}>>}
 */
async function fetchAllWithTimeout(urls, timeoutMs) {
  const requests = await Promise.allSettled(
    urls.map((urlItem) =>
      // Promise.race returns whichever promise settles first - either the fetch succeeds/fails, or the timeout rejects
      Promise.race([
        mockFetch(urlItem),
        new Promise((_, reject) =>
          setTimeout(() => {
            reject('timed out');
          }, timeoutMs),
        ),
      ]),
    ),
  );

  // Transform Promise.allSettled results into {url, data?, error?} format
  const results = requests.map((req, index) => {
    return {
      url: urls[index],
      ...(req.status === 'fulfilled' && { data: req.value }),
      ...(req.status === 'rejected' && { error: req.reason }),
    };
  });

  return results;
}

module.exports = { fetchAllWithTimeout };
