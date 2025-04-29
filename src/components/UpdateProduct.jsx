import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../services/authApi';

function UpdateProduct() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    materials: [],
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch product data for updating
    API.get(`/api/products/${id}`)
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setErrorMessage('Failed to fetch product details.');
      });
  }, [id]);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      await API.put(`/api/products/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      setSuccessMessage('Product updated successfully!');
      setErrorMessage('');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('Failed to update product. Please try again.');
      setSuccessMessage('');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Update Product</h2>

      {/* Success Message */}
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

      {/* Error Message */}
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

      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Enter Product Name"
            value={productData.name}
            onChange={handleProductChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Description</label>
          <input
            type="text"
            name="description"
            className="form-control"
            placeholder="Enter Product Description"
            value={productData.description}
            onChange={handleProductChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            placeholder="Enter Product Price"
            value={productData.price}
            onChange={handleProductChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Product'}
        </button>
      </form>

      <div className="mt-3">
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default UpdateProduct;
