# Problem 2: Search Endpoint with Filtering and Pagination

**Difficulty:** Intermediate  
**Time Estimate:** 35-45 minutes

#### Problem Statement

Build a search endpoint handler for a product catalog. The endpoint should support filtering, sorting, and pagination.

#### Requirements

1. Filter products by: `category`, `minPrice`, `maxPrice`, `inStock` (boolean)
2. Search by `name` (case-insensitive, partial match)
3. Sort by `price` or `name` (ascending or descending)
4. Paginate results with `page` and `limit` parameters
5. Return total count along with paginated results

#### Function Signature

```javascript
/**
 * @param {Object[]} products - Array of product objects
 * @param {Object} query - Query parameters from request
 * @returns {Object} - { data: Product[], total: number, page: number, totalPages: number }
 */
function searchProducts(products, query) {
  // Your implementation here
}
```

#### Product Schema

```javascript
{
  id: number,
  name: string,
  category: string,
  price: number,
  inStock: boolean
}
```

#### Query Parameters

```javascript
{
  search?: string,        // Search term for name
  category?: string,      // Filter by category
  minPrice?: number,      // Minimum price filter
  maxPrice?: number,      // Maximum price filter
  inStock?: boolean,      // Filter by stock status
  sortBy?: 'price' | 'name',
  sortOrder?: 'asc' | 'desc',
  page?: number,          // Default: 1
  limit?: number          // Default: 10
}
```

#### Example

```javascript
const products = [
  { id: 1, name: 'Laptop Pro', category: 'electronics', price: 1200, inStock: true },
  { id: 2, name: 'Wireless Mouse', category: 'electronics', price: 29, inStock: true },
  { id: 3, name: 'Desk Chair', category: 'furniture', price: 350, inStock: false },
  // ... more products
];

const result = searchProducts(products, {
  category: 'electronics',
  minPrice: 20,
  sortBy: 'price',
  sortOrder: 'asc',
  page: 1,
  limit: 10
});

// Expected output:
{
  data: [
    { id: 2, name: 'Wireless Mouse', category: 'electronics', price: 29, inStock: true },
    { id: 1, name: 'Laptop Pro', category: 'electronics', price: 1200, inStock: true }
  ],
  total: 2,
  page: 1,
  totalPages: 1
}
```