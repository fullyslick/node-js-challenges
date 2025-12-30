const filterByCategory = (products, category) => {
  if (!category) {
    return products;
  }

  return products.filter((product) => product.category === category);
};

const filterByPrice = (products, minPrice, maxPrice) => {
  if (minPrice === undefined && maxPrice === undefined) {
    return products;
  }

  const productsByMinPrice =
    minPrice !== undefined ? products.filter((product) => product.price >= minPrice) : products;

  return maxPrice !== undefined
    ? productsByMinPrice.filter((product) => product.price <= maxPrice)
    : productsByMinPrice;
};

const filterByStockStatus = (products, inStock) => {
  if (inStock === undefined) {
    return products;
  }

  return products.filter((product) => product.inStock === inStock);
};

const filterBySearchTerm = (products, term) => {
  if (!term) {
    return products;
  }
  const regex = new RegExp(term, 'i');

  return products.filter((product) => regex.test(product.name));
};

const sortProducts = (products, sortBy, sortOrder = 'asc') => {
  if (!sortBy) {
    return products;
  }

  if (sortBy === 'price') {
    return products.toSorted((a, b) => {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });
  }

  if (sortBy === 'name') {
    return products.toSorted((a, b) => {
      return sortOrder === 'asc'
        ? a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        : b.name.toLowerCase().localeCompare(a.name.toLowerCase());
    });
  }
};

const paginateProducts = (products, page = 1, limit = 10) => {
  const total = products.length;

  const totalPages = Math.ceil(total / limit);

  const data = products.filter(
    (product, index) => index >= page * limit - limit && index < page * limit,
  );

  return { data, total, page, totalPages };
};
/**
 * @param {Object[]} products - Array of product objects
 * @param {Object} query - Query parameters from request
 * @returns {Object} - { data: Product[], total: number, page: number, totalPages: number }
 */
function searchProducts(products, query) {
  // Your implementation here
  if (!Array.isArray(products)) {
    return { data: [], total: 0, page: 1, totalPages: 0 };
  }

  const { category, search, minPrice, maxPrice, inStock, sortBy, sortOrder, page, limit } = query;

  const productsByCategory = filterByCategory(products, category);

  const productByPrice = filterByPrice(productsByCategory, minPrice, maxPrice);

  const productsByStock = filterByStockStatus(productByPrice, inStock);

  const productsBySearchTerm = filterBySearchTerm(productsByStock, search);

  const sortedProducts = sortProducts(productsBySearchTerm, sortBy, sortOrder);

  const result = paginateProducts(sortedProducts, page, limit);

  return result;
}

module.exports = { searchProducts };
