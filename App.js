import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

// Header Component
import { FaLaptop, FaGamepad, FaHome } from 'react-icons/fa';

function Header({ cartItemCount, setCategory }) {
  return (
    <header className="container mt-3">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="mb-0">LaraGear</h1>
        <nav className="d-flex align-items-center">
        <Link 
  to="/" 
  className="btn btn-outline-secondary me-3" 
  style={{ fontSize: '1.0rem' }}
>
  Produits
</Link>
          
          {/* Navbar Menu for Categories */}
          <div className="d-flex">
            <button className="btn btn-outline-secondary me-3" onClick={() => setCategory('gaming')}>
              <FaGamepad style={{ fontSize: '1.5rem' }} /> Gaming
            </button>
            <button className="btn btn-outline-secondary me-3" onClick={() => setCategory('work')}>
              <FaLaptop style={{ fontSize: '1.5rem' }} /> Work
            </button>
            <button className="btn btn-outline-secondary me-3" onClick={() => setCategory('')}>
              <FaHome style={{ fontSize: '1.5rem' }} /> All 
            </button>
          </div>
          
          {/* Cart Icon */}
          <Link to="/cart" className="text-black position-relative">
            <FaShoppingCart style={{ fontSize: '2.5rem', color: 'black' }} />
            {cartItemCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '1rem' }}
              >
                {cartItemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}


// Product Detail Component
function ProductDetail({ products, addToCart }) {
  const { productId } = useParams();
  const product = products.find(p => p.id === parseInt(productId));

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <div className="row">
          <div className="col-md-6 text-center mb-3">
            <img 
              src={product.thumbnail} 
              alt={product.title} 
              className="img-fluid rounded border" 
              style={{ maxHeight: '400px' }}
            />
          </div>
          <div className="col-md-6">
            <h1 className="display-5">{product.title}</h1>
            <h3 className="text-primary mt-3">{product.price} DH</h3>
            <p className="lead mt-4">{product.description}</p>
            <button 
              className="btn btn-primary btn-lg mt-3"
              onClick={() => addToCart(product)} // Added the functionality here
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Component
function Product({ product, addToCart, cartQuantity, updateQuantity }) {
  return (
    <div className="col-md-3 mb-4">
      <div className="card shadow-sm">
        <Link to={`/product/${product.id}`}>
          <img className="card-img-top" src={product.thumbnail} alt={product.title} />
        </Link>
        <div className="card-body">
          <p className="card-title">{product.title}</p>
          <p className="card-text">{product.price}</p>
          <div className="d-flex justify-content-between align-items-center">
            {cartQuantity > 0 ? (
              <div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(product, -1)}>-</button>
                <span className="mx-2">{cartQuantity}</span>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(product, 1)}>+</button>
              </div>
            ) : (
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addToCart(product)}>
                Ajouter au panier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ProductList Component
function ProductList({ products, addToCart, updateQuantity, cart, category }) {
  const getCartQuantity = (productId) => {
    const productInCart = cart.find(item => item.id === productId);
    return productInCart ? productInCart.quantity : 0;
  };

  const filteredProducts = products.filter(product =>
    category ? product.category === category : true
  );

  return (
    <div className="container">
      <h1 className="my-4 text-center">Nos Produits</h1>

      <div className="row">
        {filteredProducts.map((product) => (
          <Product
            key={product.id}
            product={product}
            addToCart={addToCart}
            updateQuantity={updateQuantity}
            cartQuantity={getCartQuantity(product.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Cart Component
function Cart({ cartItems, updateQuantity, removeFromCart }) {
  const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.price.replace(" DH", "")) * item.quantity, 0).toFixed(2);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Votre Panier</h1>
      {cartItems.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          Votre panier est vide.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">Prix</th>
                <th scope="col">Quantité</th>
                <th scope="col">Total</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  <td>
                    <div className="d-flex justify-content-between align-items-center">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item, -1)}>-</button>
                      <span className="mx-2">{item.quantity}</span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item, 1)}>+</button>
                    </div>
                  </td>
                  <td>{(parseFloat(item.price.replace(" DH", "")) * item.quantity).toFixed(2)} DH</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-end">
            <h4 className="mt-3">Total: {totalPrice} DH</h4>
          </div>
        </div>
      )}
    </div>
  );
}

// App Component with Routing and Cart Functionality
function App() {
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('');

  const products = [
    { id: 1, title: 'PC Portable Gamer HP VICTUS', price: '7490 DH', thumbnail: 'gamer.jpeg', category: 'gaming', description: 'Description for gaming PC' },
    { id: 2, title: 'PC Portable Gamer HP VICTUS', price: '2190 DH', thumbnail: 'pc.jpeg', category: 'gaming', description: 'Description for gaming PC' },
    { id: 3, title: 'PC Portable Chromebook Acer', price: '3640 DH', thumbnail: 'hp.jpeg', category: 'work', description: 'Description for work PC' },
    { id: 4, title: 'PC Portable - HUAWEI', price: '1270 DH', thumbnail: 'pc3.gif', category: 'work', description: 'Description for work PC' },
  ];

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (product, amount) => {
    setCart((prevCart) => {
      return prevCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: Math.max(item.quantity + amount, 0) }
          : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  return (
    <Router>
      <Header cartItemCount={cart.length} setCategory={setCategory} />
      <Routes>
        <Route 
          path="/" 
          element={<ProductList products={products} addToCart={addToCart} updateQuantity={updateQuantity} cart={cart} category={category} />} 
        />
        <Route 
          path="/cart" 
          element={<Cart cartItems={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} 
        />
        <Route 
          path="/product/:productId" 
          element={<ProductDetail products={products} addToCart={addToCart} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
