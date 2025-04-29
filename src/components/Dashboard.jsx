import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/authApi';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }

    const fetchProducts = async () => {
      try {
        const response = await API.get('/api/products', { withCredentials: true });
        console.log("response", response.data);
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Error fetching products.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleDelete = (id) => {
    API.delete(`/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  const handleShowMaterial = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <Link to="/add-product" className="btn btn-primary">Add Product</Link>
      </div>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price ($)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.amount}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info me-2" 
                      onClick={() => handleShowMaterial(product)}
                    >
                      Show Materials
                    </button>
                    <Link 
                      to={`/update-product/${product.id}`} 
                      className="btn btn-sm btn-warning me-2"
                    >
                      Update
                    </Link>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal to Show Materials */}
      {showModal && selectedProduct && (
        <div className="modal fade show" style={{ display: 'block' }} aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Materials for {selectedProduct.name}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.materials?.length > 0 ? (
                      selectedProduct.materials.map((material, index) => (
                        <tr key={index}>
                          <td>{material.description}</td>
                          <td>{material.quantity}</td>
                          <td>{material.rate}</td>
                          <td>{material.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No materials available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
