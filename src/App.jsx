import React, { useState, useEffect } from 'react';
import './App.css';

const Search = ({ onSearch }) => (
  <div className="search-container">
    <input
      type="text"
      id="search"
      placeholder="Search products..."
      onChange={(e) => onSearch(e.target.value)}
    />
  </div>
);

const ProductCard = ({ product, onToggleLike, onDelete }) => (
  <div className="product-card">
    <img src={product.img} alt={product.name} />
    <h3>{product.name}</h3>
    <p>{product.info}</p>
    <p>Price: ${product.price}</p>
    <button className="like" onClick={() => onToggleLike(product.id)}>
      {product.liked ? 'Unlike' : 'Like'}
    </button>
    <button className="delete" onClick={() => onDelete(product.id)}>
      Delete
    </button>
  </div>
);

const AddProductForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [info, setInfo] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    if (!name || !img || !info || isNaN(parseFloat(price))) {
      alert('Please fill out all fields correctly.');
      return;
    }
    onSubmit({ name, img, info, price: parseFloat(price) });
    setName('');
    setImg('');
    setInfo('');
    setPrice('');
  };

  return (
    <div className="add-product-form">
      <h3>Add New Product</h3>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Image URL"
        value={img}
        onChange={(e) => setImg(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Info"
        value={info}
        onChange={(e) => setInfo(e.target.value)}
      />
      <input
        type="number"
        placeholder="Product Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const toggleLike = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, liked: !p.liked } : p))
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now().toString(), liked: false };
    setProducts((prev) => [...prev, newProduct]);
    setFormVisible(false);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Search onSearch={setSearchTerm} />
      <div className="products-container">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onToggleLike={toggleLike}
            onDelete={deleteProduct}
          />
        ))}
      </div>
      {isFormVisible && (
        <AddProductForm
        onSubmit={addProduct}
        onCancel={() => setFormVisible(false)}
      />
    )}
    <button onClick={() => setFormVisible(true)} style={{ marginTop: '20px' }}>
      Add Product
    </button>
  </div>
);
};

export default App;

