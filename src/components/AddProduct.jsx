import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    materials: [],
  });

  const [material, setMaterial] = useState({ name: '', quantity: '' });

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
    setProductData({
      ...productData,
      materials: [...productData.materials, material],
    });
    setMaterial({ name: '', quantity: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/products', productData)
      .then(() => {
        alert('Product added successfully!');
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Error adding product:', error);
      });
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleProductChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Product Description"
          value={productData.description}
          onChange={handleProductChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={productData.price}
          onChange={handleProductChange}
          required
        />

        <h3>Add Materials</h3>
        <input
          type="text"
          name="name"
          placeholder="Material Name"
          value={material.name}
          onChange={handleMaterialChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Material Quantity"
          value={material.quantity}
          onChange={handleMaterialChange}
        />
        <button type="button" onClick={addMaterial}>Add Material</button>

        <button type="submit">Submit Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
