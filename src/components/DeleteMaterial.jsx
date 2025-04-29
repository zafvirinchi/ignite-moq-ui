import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/authApi';

function DeleteMaterial() {
  const { id } = useParams(); // material ID
  const navigate = useNavigate();

  useEffect(() => {
    const confirmAndDelete = async () => {
      const confirm = window.confirm('Are you sure you want to delete this material?');
      if (!confirm) {
        navigate(-1); // go back if not confirmed
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        await API.delete(`/api/product-materials/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert('Material deleted successfully.');
        navigate(-1); // go back to previous screen
      } catch (error) {
        console.error('Delete Material Error:', error);
        alert('Failed to delete material.');
        navigate(-1); // still go back
      }
    };

    confirmAndDelete();
  }, [id, navigate]);

  return <div>Processing deletion...</div>;
}

export default DeleteMaterial;
