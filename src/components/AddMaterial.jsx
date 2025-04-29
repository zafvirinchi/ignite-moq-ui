import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/authApi';

function AddMaterial() {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.state?.productId;

  const [form, setForm] = useState({
    description: '',
    quantity: '',
    rate: '',
  });

  const [error, setError] = useState(null);

  if (!productId) {
    return <div className="alert alert-danger">Product ID is missing.</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem('authToken');

    try {
      await API.post(
        '/api/product-materials',
        {
          ...form,
          product_id: productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/materials/${productId}`);
    } catch (err) {
      console.error('Add Material Error:', err);
      setError('Failed to add material.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Material</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Rate</label>
          <input
            type="number"
            className="form-control"
            name="rate"
            value={form.rate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success me-2">Add</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
}

export default AddMaterial;
