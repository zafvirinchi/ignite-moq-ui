import React, { useEffect, useState } from 'react';
import API from '../services/authApi';

const EditMaterial = ({ id, show, onClose, onUpdated }) => {
  const [material, setMaterial] = useState({
    name: '',
    unit: '',
    quantity: '',
    rate: '',
  });

  const [error, setError] = useState('');

  // Fetch the material data on modal open
  useEffect(() => {
    if (show && id) {
      const fetchMaterial = async () => {
        try {
          const response = await API.get(`/api/product-materials/${id}`);
          setMaterial(response.data);
        } catch (err) {
          console.error('Fetch Material Error:', err);
          setError('Failed to fetch material.');
        }
      };
      fetchMaterial();
    }
  }, [id, show]);

  // Handle input field changes
  const handleChange = (e) => {
    setMaterial({ ...material, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for quantity and rate
    if (parseFloat(material.quantity) <= 0 || parseFloat(material.rate) <= 0) {
      setError('Quantity and Rate must be greater than 0.');
      return;
    }

    try {
      await API.put(`/api/product-materials/${id}`, material);
      onUpdated(); // Refresh parent list
      onClose();   // Close modal
    } catch (err) {
      console.error('Update Error:', err);
      setError('Failed to update material.');
    }
  };

  if (!show) return null; // Do not render anything if show is false

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Material</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {/* Display error if any */}
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label>Name</label>
                <input
                  name="name"
                  className="form-control"
                  value={material.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Unit</label>
                <input
                  name="unit"
                  className="form-control"
                  value={material.unit}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  className="form-control"
                  value={material.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="mb-3">
                <label>Rate</label>
                <input
                  name="rate"
                  type="number"
                  className="form-control"
                  value={material.rate}
                  onChange={handleChange}
                  min="0.01"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="submit" className="btn btn-primary">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMaterial;
