import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiSearch, FiHeart, FiUser, FiStar } from 'react-icons/fi';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { id: 'all', name: 'All' },
    { id: "men's clothing", name: 'Men' },
    { id: "women's clothing", name: 'Women' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'jewelery', name: 'Jewelry' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FiStar key={i} className="fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FiStar key="half" className="text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FiStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiShoppingCart className="text-white text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">KingsMart</h1>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                <FiShoppingCart className="text-xl" />
                <span className="text-xs">Cart</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                <FiHeart className="text-xl" />
                <span className="text-xs">Wishlist</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                <FiUser className="text-xl" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 pb-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
              <div className="relative aspect-square p-4 bg-gray-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors">
                  <FiHeart className="text-gray-600 hover:text-red-500" />
                </button>
              </div>
              
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
                  {product.title}
                </h3>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating.rate)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.rating.count})
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">
                    {product.category}
                  </span>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;