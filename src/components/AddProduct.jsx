import React, { useState } from 'react';
import API from '../services/authApi';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    quantity: '',
    waste_percentage: '',
    labour_percentage: '',
    equipment_cost: '',
    other_percentage: '',
    margin_percentage: '',
    materials: [],
  });

  const [material, setMaterial] = useState({ description: '', rate: '', quantity: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setMaterial({ ...material, [name]: value });
  };

  const addMaterial = (e) => {
    e.preventDefault();
    if (!material.description || !material.rate) {
      setErrorMessage('Please fill both material description and rate.');
      return;
    }

    setProductData({
      ...productData,
      materials: [...productData.materials, material],
    });
    setMaterial({ description: '', rate: '' });
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API.post('/api/products', productData)
      .then(() => {
        setSuccessMessage('Product added successfully!');
        setErrorMessage('');

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      })
      .catch((error) => {
        console.error('Error adding product:', error);
        setErrorMessage('Failed to add product. Please try again.');
        setSuccessMessage('');

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Add New Product</h2>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setSuccessMessage('')}
          ></button>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setErrorMessage('')}
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleProductChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Product Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={productData.description}
            onChange={handleProductChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Quantity</label>
            <input type="number" className="form-control" name="quantity" value={productData.quantity} onChange={handleProductChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Waste Percentage</label>
            <input type="number" className="form-control" name="waste_percentage" value={productData.waste_percentage} onChange={handleProductChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Labour Percentage</label>
            <input type="number" className="form-control" name="labour_percentage" value={productData.labour_percentage} onChange={handleProductChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Equipment Cost</label>
            <input type="number" className="form-control" name="equipment_cost" value={productData.equipment_cost} onChange={handleProductChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Other Percentage</label>
            <input type="number" className="form-control" name="other_percentage" value={productData.other_percentage} onChange={handleProductChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Margin Percentage</label>
            <input type="number" className="form-control" name="margin_percentage" value={productData.margin_percentage} onChange={handleProductChange} required />
          </div>
        </div>

        <h4>Add Materials</h4>
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Material Description"
              name="description"
              value={material.description}
              onChange={handleMaterialChange}
            />
          </div>
          <div className="col-md-5">
            <input
              type="number"
              className="form-control"
              placeholder="Material Rate"
              name="rate"
              value={material.rate}
              onChange={handleMaterialChange}
            />
          </div>
          <div className="col-md-5">
            <input
              type="number"
              className="form-control"
              placeholder="Material Quantity"
              name="quantity"
              value={material.quantity}
              onChange={handleMaterialChange}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-primary w-100"
              onClick={addMaterial}
              type="button"
            >
              Add Material
            </button>
          </div>
        </div>

        {productData.materials.length > 0 && (
          <div className="mt-4">
            <h5>Materials List</h5>
            <ul className="list-group">
              {productData.materials.map((mat, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {mat.description} - {mat.rate} - {mat.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 d-flex justify-content-between">
          <button type="submit" className="btn btn-success w-100 me-2">
            Submit Product
          </button>
          <button
            type="button"
            className="btn btn-secondary w-100"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
