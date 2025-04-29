import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/authApi';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBOQModal, setShowBOQModal] = useState(false);
  const [boqQuantity, setBoqQuantity] = useState('');
  const [boqResult, setBoqResult] = useState(null);
  const [boqError, setBoqError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await API.get('/api/products', { withCredentials: true });
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Error fetching products.');
        console.error('Fetch Products Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleShowMaterial = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleShowBOQModal = (product) => {
    setSelectedProduct(product);
    setBoqQuantity('');
    setBoqResult(null);
    setBoqError(null);
    setShowBOQModal(true);
  };

  const handleCloseBOQModal = () => {
    setShowBOQModal(false);
    setSelectedProduct(null);
  };

  const handleCalculateBOQ = async () => {
    if (!boqQuantity || isNaN(boqQuantity)) {
      setBoqError('Please enter a valid quantity.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await API.post(
        '/api/products/calculate-amount',
        {
          product_id: selectedProduct.id,
          quantity: parseInt(boqQuantity, 10),
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBoqResult(response.data);
      setBoqError(null);
    } catch (err) {
      setBoqResult(null);
      setBoqError('Failed to calculate BOQ.');
      console.error('BOQ Calculation Error:', err);
    }
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
                <th>Quantity</th>
                <th>Material Cost (%)</th>
                <th>Waste Amount ($)</th>
                <th>Labour Amount ($)</th>
                <th>Equipment Cost ($)</th>
                <th>Other Amount($)</th>
                <th>Margin Amount($)</th>
                <th>Total Amount($)</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.quantity}</td>
                  <td>{product.waste_amount}</td>
                  <td>{product.labour_amount}</td>
                  <td>{product.equipment_cost}</td>
                  <td>{product.other_amount}</td>
                  <td>{product.margin_amount}</td>
                  <td>{product.amount}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleShowMaterial(product)}
                    >
                      Show Materials
                    </button>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleShowBOQModal(product)}
                    >
                      BOQ
                    </button>
                    <Link
                      to={`/update-product/${product.id}`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Update
                    </Link>
                    <Link
                      to={`/delete-product/${product.id}`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Materials Modal */}
      {showModal && selectedProduct && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog" role="document">
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
                      selectedProduct.materials.map((material, idx) => (
                        <tr key={idx}>
                          <td>{material.description}</td>
                          <td>{material.quantity}</td>
                          <td>{material.rate}</td>
                          <td>{material.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No materials available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOQ Modal */}
      {showBOQModal && selectedProduct && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Calculate BOQ for {selectedProduct.name}</h5>
                <button type="button" className="btn-close" onClick={handleCloseBOQModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={boqQuantity}
                    onChange={(e) => setBoqQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>

                <button className="btn btn-primary" onClick={handleCalculateBOQ}>
                  Calculate
                </button>

                {boqError && <div className="alert alert-danger mt-3">{boqError}</div>}

                {boqResult && (
                  <div className="mt-4">
                    <h6>BOQ Calculation Result</h6>
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th>Product Name</th>
                          <td>{boqResult.product_name}</td>
                        </tr>
                        <tr>
                          <th>Given Quantity</th>
                          <td>{boqResult.given_quantity}</td>
                        </tr>
                        <tr>
                          <th>Sub Total</th>
                          <td>${parseFloat(boqResult.sub_total).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <th>Calculated Amount</th>
                          <td><strong>${parseFloat(boqResult.calculated_amount).toFixed(2)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseBOQModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
