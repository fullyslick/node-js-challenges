/**
 * Mock API Service
 * Simulates external API calls with configurable delays, responses, and failures
 */

const mockData = {
  'https://api.example.com/users': {
    users: [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
    ]
  },
  'https://api.example.com/products': {
    products: [
      { id: 101, name: 'Laptop', price: 999.99 },
      { id: 102, name: 'Mouse', price: 29.99 },
      { id: 103, name: 'Keyboard', price: 79.99 }
    ]
  },
  'https://api.example.com/orders': {
    orders: [
      { id: 1001, userId: 1, total: 1029.98, status: 'shipped' },
      { id: 1002, userId: 2, total: 79.99, status: 'pending' }
    ]
  }
};

const urlConfig = {
  'https://api.example.com/users': { delay: 100 },
  'https://api.example.com/products': { delay: 200 },
  'https://api.example.com/orders': { delay: 150 },
  'https://api.example.com/slow-endpoint': { delay: 10000 },
  'https://api.example.com/error-endpoint': { delay: 50, shouldFail: true, errorMessage: 'Internal Server Error' }
};

/**
 * Simulates a fetch request with configurable behavior
 * @param {string} url - The URL to "fetch"
 * @param {object} options - Optional overrides for delay, shouldFail, etc.
 * @returns {Promise<object>} - Resolves with mock data or rejects with error
 */
async function mockFetch(url, options = {}) {
  const config = { ...urlConfig[url], ...options };
  const delay = config.delay ?? 100;
  const shouldFail = config.shouldFail ?? false;
  const errorMessage = config.errorMessage ?? 'Request failed';

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(errorMessage));
      } else if (mockData[url]) {
        resolve(mockData[url]);
      } else {
        reject(new Error(`Unknown URL: ${url}`));
      }
    }, delay);
  });
}

/**
 * Register custom mock data for a URL
 * @param {string} url - The URL to register
 * @param {object} data - The data to return
 * @param {object} config - Optional config (delay, shouldFail, errorMessage)
 */
function registerMockUrl(url, data, config = {}) {
  mockData[url] = data;
  urlConfig[url] = { delay: 100, ...config };
}

/**
 * Clear all custom mock registrations and reset to defaults
 */
function resetMocks() {
  Object.keys(mockData).forEach(key => {
    if (!['https://api.example.com/users', 'https://api.example.com/products', 'https://api.example.com/orders'].includes(key)) {
      delete mockData[key];
      delete urlConfig[key];
    }
  });
}

module.exports = {
  mockFetch,
  registerMockUrl,
  resetMocks,
  mockData,
  urlConfig
};