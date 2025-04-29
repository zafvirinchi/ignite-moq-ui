import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../services/authApi';

function DeleteProduct() {
  const [productData, setProductData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch product details (optional: just to show what you're deleting)
    API.get(`/api/products/${id}`)
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setErrorMessage('Failed to fetch product details.');
      });
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      await API.delete(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Product deleted successfully!');
      setErrorMessage('');

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Failed to delete the product. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Delete Product</h2>

      {/* Success Alert */}
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

      {/* Error Alert */}
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

      {/* Show Product Details (optional) */}
      {productData && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">{productData.name}</h5>
            <p className="card-text">{productData.description}</p>
            <p className="card-text">
              <strong>Price:</strong> ${productData.price}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button className="btn btn-danger me-2" onClick={handleDelete}>
          Delete Product
        </button>
        <Link to="/dashboard" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </div>
  );
}

export default DeleteProduct;
