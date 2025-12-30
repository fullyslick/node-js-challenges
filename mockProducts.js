const mockProducts = [
  // Electronics - various prices and stock status
  { id: 1, name: 'Laptop Pro', category: 'electronics', price: 1200, inStock: true },
  { id: 2, name: 'Wireless Mouse', category: 'electronics', price: 29, inStock: true },
  { id: 3, name: 'Mechanical Keyboard', category: 'electronics', price: 150, inStock: true },
  { id: 4, name: 'USB-C Hub', category: 'electronics', price: 45, inStock: false },
  { id: 5, name: 'Monitor 27 inch', category: 'electronics', price: 350, inStock: true },
  { id: 6, name: 'Webcam HD', category: 'electronics', price: 80, inStock: false },
  { id: 7, name: 'Laptop Stand', category: 'electronics', price: 55, inStock: true },

  // Furniture - various prices and stock status
  { id: 8, name: 'Desk Chair', category: 'furniture', price: 350, inStock: false },
  { id: 9, name: 'Standing Desk', category: 'furniture', price: 600, inStock: true },
  { id: 10, name: 'Bookshelf', category: 'furniture', price: 120, inStock: true },
  { id: 11, name: 'Filing Cabinet', category: 'furniture', price: 200, inStock: true },
  { id: 12, name: 'Office Desk', category: 'furniture', price: 450, inStock: false },

  // Clothing - various prices and stock status
  { id: 13, name: 'Cotton T-Shirt', category: 'clothing', price: 25, inStock: true },
  { id: 14, name: 'Denim Jeans', category: 'clothing', price: 65, inStock: true },
  { id: 15, name: 'Winter Jacket', category: 'clothing', price: 180, inStock: false },
  { id: 16, name: 'Running Shoes', category: 'clothing', price: 120, inStock: true },
  { id: 17, name: 'Wool Sweater', category: 'clothing', price: 90, inStock: true },

  // Books - lower price range
  { id: 18, name: 'JavaScript Guide', category: 'books', price: 40, inStock: true },
  { id: 19, name: 'Node.js Handbook', category: 'books', price: 35, inStock: true },
  { id: 20, name: 'Design Patterns', category: 'books', price: 55, inStock: false },
  { id: 21, name: 'Clean Code', category: 'books', price: 45, inStock: true },
  { id: 22, name: 'The Pragmatic Programmer', category: 'books', price: 50, inStock: true },

  // Sports - mixed prices
  { id: 23, name: 'Yoga Mat', category: 'sports', price: 30, inStock: true },
  { id: 24, name: 'Dumbbells Set', category: 'sports', price: 150, inStock: true },
  { id: 25, name: 'Resistance Bands', category: 'sports', price: 20, inStock: true },
  { id: 26, name: 'Exercise Bike', category: 'sports', price: 500, inStock: false },
  { id: 27, name: 'Jump Rope', category: 'sports', price: 15, inStock: true },
];

module.exports = { mockProducts };