// src/components/Auth/Login.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { login } from '../../services/authApi';
import { useNavigate } from 'react-router-dom'; // for redirecting after login

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(formData); // call login API
      const token = response.data.token; // depends on your Laravel API response

      // Store token to localStorage
      localStorage.setItem('authToken', token);

      alert(t('login.success'));
      navigate('/products'); // or home/dashboard
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(t('login.error'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{t('login.title')}</h2>
      <div>
        <label>{t('login.email')}</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>{t('login.password')}</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">{t('login.submit')}</button>
    </form>
  );
}
