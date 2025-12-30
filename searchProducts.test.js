const { mockProducts } = require('./mockProducts');
const { searchProducts } = require('./searchProducts');

describe('searchProducts', () => {
  describe('basic functionality', () => {
    it('should return all products with default pagination when no filters applied', () => {
      const result = searchProducts(mockProducts, {});

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('totalPages');
      expect(result.page).toBe(1);
      expect(result.data.length).toBeLessThanOrEqual(10);
      expect(result.total).toBe(mockProducts.length);
    });

    it('should return empty array when products array is empty', () => {
      const result = searchProducts([], {});

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('category filtering', () => {
    it('should filter products by category', () => {
      const result = searchProducts(mockProducts, { category: 'electronics' });

      expect(result.data.every(p => p.category === 'electronics')).toBe(true);
      expect(result.total).toBe(7);
    });

    it('should return empty results for non-existent category', () => {
      const result = searchProducts(mockProducts, { category: 'nonexistent' });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('price filtering', () => {
    it('should filter products by minPrice', () => {
      const result = searchProducts(mockProducts, { minPrice: 100 });

      expect(result.data.every(p => p.price >= 100)).toBe(true);
    });

    it('should filter products by maxPrice', () => {
      const result = searchProducts(mockProducts, { maxPrice: 50 });

      expect(result.data.every(p => p.price <= 50)).toBe(true);
    });

    it('should filter products by price range (minPrice and maxPrice)', () => {
      const result = searchProducts(mockProducts, { minPrice: 50, maxPrice: 150 });

      expect(result.data.every(p => p.price >= 50 && p.price <= 150)).toBe(true);
    });

    it('should return empty results when price range has no matches', () => {
      const result = searchProducts(mockProducts, { minPrice: 5000, maxPrice: 6000 });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('stock filtering', () => {
    it('should filter products that are in stock', () => {
      const result = searchProducts(mockProducts, { inStock: true });

      expect(result.data.every(p => p.inStock === true)).toBe(true);
    });

    it('should filter products that are out of stock', () => {
      const result = searchProducts(mockProducts, { inStock: false });

      expect(result.data.every(p => p.inStock === false)).toBe(true);
    });
  });

  describe('name search', () => {
    it('should search products by name (partial match)', () => {
      const result = searchProducts(mockProducts, { search: 'Laptop' });

      expect(result.data.every(p => p.name.toLowerCase().includes('laptop'))).toBe(true);
      expect(result.total).toBe(2); // Laptop Pro and Laptop Stand
    });

    it('should search products by name (case-insensitive)', () => {
      const result = searchProducts(mockProducts, { search: 'laptop' });

      expect(result.total).toBe(2);
      expect(result.data.some(p => p.name === 'Laptop Pro')).toBe(true);
      expect(result.data.some(p => p.name === 'Laptop Stand')).toBe(true);
    });

    it('should return empty results for non-matching search term', () => {
      const result = searchProducts(mockProducts, { search: 'xyz123' });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('sorting', () => {
    it('should sort products by price ascending', () => {
      const result = searchProducts(mockProducts, { sortBy: 'price', sortOrder: 'asc', limit: 100 });

      for (let i = 1; i < result.data.length; i++) {
        expect(result.data[i].price).toBeGreaterThanOrEqual(result.data[i - 1].price);
      }
    });

    it('should sort products by price descending', () => {
      const result = searchProducts(mockProducts, { sortBy: 'price', sortOrder: 'desc', limit: 100 });

      for (let i = 1; i < result.data.length; i++) {
        expect(result.data[i].price).toBeLessThanOrEqual(result.data[i - 1].price);
      }
    });

    it('should sort products by name ascending', () => {
      const result = searchProducts(mockProducts, { sortBy: 'name', sortOrder: 'asc', limit: 100 });

      for (let i = 1; i < result.data.length; i++) {
        expect(result.data[i].name.localeCompare(result.data[i - 1].name)).toBeGreaterThanOrEqual(0);
      }
    });

    it('should sort products by name descending', () => {
      const result = searchProducts(mockProducts, { sortBy: 'name', sortOrder: 'desc', limit: 100 });

      for (let i = 1; i < result.data.length; i++) {
        expect(result.data[i].name.localeCompare(result.data[i - 1].name)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('pagination', () => {
    it('should return first page with default limit of 10', () => {
      const result = searchProducts(mockProducts, { page: 1 });

      expect(result.data.length).toBe(10);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(3);
    });

    it('should return correct page with custom limit', () => {
      const result = searchProducts(mockProducts, { page: 2, limit: 5 });

      expect(result.data.length).toBe(5);
      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(6);
    });

    it('should return last page with remaining items', () => {
      const result = searchProducts(mockProducts, { page: 3, limit: 10 });

      expect(result.data.length).toBe(7); // 27 total, page 3 with limit 10 = 7 remaining
      expect(result.page).toBe(3);
    });

    it('should return empty data for page beyond total pages', () => {
      const result = searchProducts(mockProducts, { page: 100, limit: 10 });

      expect(result.data).toEqual([]);
      expect(result.page).toBe(100);
      expect(result.total).toBe(27);
    });

    it('should default to page 1 when page is not provided', () => {
      const result = searchProducts(mockProducts, { limit: 5 });

      expect(result.page).toBe(1);
    });

    it('should default to limit 10 when limit is not provided', () => {
      const result = searchProducts(mockProducts, {});

      expect(result.data.length).toBe(10);
    });
  });

  describe('combined filters', () => {
    it('should apply category and price filters together', () => {
      const result = searchProducts(mockProducts, {
        category: 'electronics',
        minPrice: 50,
        maxPrice: 200
      });

      expect(result.data.every(p =>
        p.category === 'electronics' &&
        p.price >= 50 &&
        p.price <= 200
      )).toBe(true);
    });

    it('should apply search, category and inStock filters together', () => {
      const result = searchProducts(mockProducts, {
        search: 'desk',
        inStock: true
      });

      expect(result.data.every(p =>
        p.name.toLowerCase().includes('desk') &&
        p.inStock === true
      )).toBe(true);
    });

    it('should apply all filters with sorting and pagination', () => {
      const result = searchProducts(mockProducts, {
        category: 'electronics',
        minPrice: 20,
        inStock: true,
        sortBy: 'price',
        sortOrder: 'asc',
        page: 1,
        limit: 10
      });

      expect(result.data.every(p =>
        p.category === 'electronics' &&
        p.price >= 20 &&
        p.inStock === true
      )).toBe(true);

      for (let i = 1; i < result.data.length; i++) {
        expect(result.data[i].price).toBeGreaterThanOrEqual(result.data[i - 1].price);
      }
    });
  });

  describe('example from README', () => {
    it('should match the expected output from README example', () => {
      const result = searchProducts(mockProducts, {
        category: 'electronics',
        minPrice: 20,
        sortBy: 'price',
        sortOrder: 'asc',
        page: 1,
        limit: 10
      });

      expect(result.data[0].name).toBe('Wireless Mouse');
      expect(result.data[0].price).toBe(29);
      expect(result.data.every(p => p.category === 'electronics' && p.price >= 20)).toBe(true);
    });
  });
});