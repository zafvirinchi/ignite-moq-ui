import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateProduct() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    materials: [],
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch product data for updating
    axios.get(`/api/products/${id}`)
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
  }, [id]);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/products/${id}`, productData)
      .then(() => {
        alert('Product updated successfully!');
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Error updating product:', error);
      });
  };

  return (
    <div>
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleProductChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Product Description"
          value={productData.description}
          onChange={handleProductChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={productData.price}
          onChange={handleProductChange}
        />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateProduct;
