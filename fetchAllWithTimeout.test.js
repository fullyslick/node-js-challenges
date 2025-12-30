const { registerMockUrl, resetMocks } = require('./mockApi');
const { fetchAllWithTimeout } = require('./fetchAllWithTimeout');

describe('fetchAllWithTimeout', () => {
  afterEach(() => {
    resetMocks();
  });

  describe('successful requests', () => {
    test('should return data for all successful requests', async () => {
      const urls = ['https://api.example.com/users', 'https://api.example.com/products'];

      const results = await fetchAllWithTimeout(urls, 5000);

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({
        url: 'https://api.example.com/users',
        data: expect.objectContaining({ users: expect.any(Array) }),
      });
      expect(results[1]).toEqual({
        url: 'https://api.example.com/products',
        data: expect.objectContaining({ products: expect.any(Array) }),
      });
    });

    test('should return results in the same order as input URLs', async () => {
      const urls = [
        'https://api.example.com/products',
        'https://api.example.com/users',
        'https://api.example.com/orders',
      ];

      const results = await fetchAllWithTimeout(urls, 5000);

      expect(results[0].url).toBe('https://api.example.com/products');
      expect(results[1].url).toBe('https://api.example.com/users');
      expect(results[2].url).toBe('https://api.example.com/orders');
    });
  });

  describe('failed requests', () => {
    test('should return error object when request fails', async () => {
      const urls = ['https://api.example.com/error-endpoint'];

      const results = await fetchAllWithTimeout(urls, 5000);

      expect(results).toHaveLength(1);
      expect(results[0].url).toBe('https://api.example.com/error-endpoint');
      expect(results[0].error).toBeDefined();
      expect(results[0].data).toBeUndefined();
    });

    test('should handle all requests failing', async () => {
      registerMockUrl('https://api.example.com/fail1', null, {
        shouldFail: true,
        errorMessage: 'Error 1',
      });
      registerMockUrl('https://api.example.com/fail2', null, {
        shouldFail: true,
        errorMessage: 'Error 2',
      });

      const urls = ['https://api.example.com/fail1', 'https://api.example.com/fail2'];

      const results = await fetchAllWithTimeout(urls, 5000);

      expect(results).toHaveLength(2);
      expect(results[0].error).toBeDefined();
      expect(results[1].error).toBeDefined();
    });

    test('should return error for unknown URLs', async () => {
      const urls = ['https://api.example.com/unknown-endpoint'];

      const results = await fetchAllWithTimeout(urls, 5000);

      expect(results).toHaveLength(1);
      expect(results[0].error).toBeDefined();
    });
  });

  describe('mixed success and failure', () => {
    test('should handle mixed success and failure results', async () => {
      const urls = [
        'https://api.example.com/users',
        'https://api.example.com/error-endpoint',
        'https://api.example.com/products',
      ];

      const results = await fetchAllWithTimeout(urls, 5000);

      expect(results).toHaveLength(3);
      expect(results[0].data).toBeDefined();
      expect(results[0].error).toBeUndefined();
      expect(results[1].error).toBeDefined();
      expect(results[1].data).toBeUndefined();
      expect(results[2].data).toBeDefined();
      expect(results[2].error).toBeUndefined();
    });
  });

  describe('timeout handling', () => {
    test('should return timeout error when request exceeds timeout', async () => {
      const urls = ['https://api.example.com/slow-endpoint'];

      const results = await fetchAllWithTimeout(urls, 100);

      expect(results).toHaveLength(1);
      expect(results[0].url).toBe('https://api.example.com/slow-endpoint');
      expect(results[0].error).toMatch(/timed?\s*out/i);
    });

    test('should succeed when timeout is longer than request duration', async () => {
      const urls = ['https://api.example.com/users'];

      const results = await fetchAllWithTimeout(urls, 5000);

      expect(results[0].data).toBeDefined();
      expect(results[0].error).toBeUndefined();
    });

    test('should handle mix of timed out and successful requests', async () => {
      const urls = ['https://api.example.com/users', 'https://api.example.com/slow-endpoint'];

      const results = await fetchAllWithTimeout(urls, 500);

      expect(results[0].data).toBeDefined();
      expect(results[1].error).toMatch(/timed?\s*out/i);
    });
  });

  describe('empty and edge cases', () => {
    test('should return empty array for empty URLs array', async () => {
      const results = await fetchAllWithTimeout([], 5000);

      expect(results).toEqual([]);
    });

    test('should handle single URL', async () => {
      const urls = ['https://api.example.com/users'];

      const results = await fetchAllWithTimeout(urls, 5000);

      expect(results).toHaveLength(1);
      expect(results[0].data).toBeDefined();
    });

    test('should never throw an error', async () => {
      const urls = [
        'https://api.example.com/error-endpoint',
        'https://api.example.com/unknown',
        'https://api.example.com/slow-endpoint',
      ];

      await expect(fetchAllWithTimeout(urls, 100)).resolves.toBeDefined();
    });
  });

  describe('parallel execution', () => {
    test('should fetch URLs in parallel, not sequentially', async () => {
      registerMockUrl('https://api.example.com/parallel1', { id: 1 }, { delay: 200 });
      registerMockUrl('https://api.example.com/parallel2', { id: 2 }, { delay: 200 });
      registerMockUrl('https://api.example.com/parallel3', { id: 3 }, { delay: 200 });

      const urls = [
        'https://api.example.com/parallel1',
        'https://api.example.com/parallel2',
        'https://api.example.com/parallel3',
      ];

      const startTime = Date.now();
      await fetchAllWithTimeout(urls, 5000);
      const duration = Date.now() - startTime;

      // If sequential, would take ~600ms. Parallel should be ~200ms (+ some overhead)
      expect(duration).toBeLessThan(400);
    });
  });
});
