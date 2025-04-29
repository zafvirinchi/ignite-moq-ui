import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/authApi';
import EditMaterial from './EditMaterial'; // Import the EditMaterial component

function ShowMaterial() {
  const { id } = useParams(); // Get product ID from route params
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);  // Modal visibility state
  const [selectedMaterial, setSelectedMaterial] = useState(null);  // Selected material to edit

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await API.get(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(response.data);  // Set fetched product with materials
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error('Fetch Product Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAdd = () => {
    navigate(`/materials/add`, { state: { productId: id } });  // Navigate to material addition page
  };

  const handleEdit = (product) => {
    setSelectedMaterial(product);  // Set the selected material to be edited
    setShowModal(true);  // Show the modal to edit the material
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await API.delete(`/api/materials/${materialId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh the list after deletion
      setProduct((prev) => ({
        ...prev,
        materials: prev.materials.filter((m) => m.id !== materialId),
      }));
    } catch (err) {
      console.error('Delete Material Error:', err);
      alert('Failed to delete material.');
    }
  };

  const handleModalClose = () => {
    setShowModal(false); // Close the modal
    setSelectedMaterial(null); // Reset selected material
  };

  const handleMaterialUpdated = (updatedMaterial) => {
    // Update the material in the product's materials array
    setProduct((prevState) => ({
      ...prevState,
      materials: prevState.materials.map((m) =>
        m.id === updatedMaterial.id ? updatedMaterial : m
      ),
    }));
    setShowModal(false); // Close the modal after updating
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <div className="container mt-4">
      <h2>Materials for {product.name}</h2>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={handleAdd}>Add Material</button>
        <button className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Back</button>
      </div>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {product.materials?.length > 0 ? (
            product.materials.map((material) => (
              <tr key={material.id}>
                <td>{material.description}</td>
                <td>{material.quantity}</td>
                <td>{material.rate}</td>
                <td>{material.amount}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No materials found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Material Modal */}
      {showModal && selectedMaterial && (
        <EditMaterial
          id={selectedMaterial.id}
          show={showModal}
          onClose={handleModalClose}
          onUpdated={handleMaterialUpdated}
        />
      )}
    </div>
  );
}

export default ShowMaterial;
