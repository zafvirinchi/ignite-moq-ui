import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signup } from '../../services/authApi';

export default function Signup() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(t('signup.passwordMismatch'));
      return;
    }

    try {
      await signup(formData);
      alert(t('signup.success'));
      // Redirect to login page if needed
    } catch (error) {
      console.error(error);
      alert(t('signup.error'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>{t('signup.name')}</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('signup.namePlaceholder')}
        />
      </div>
      <div>
        <label>{t('signup.email')}</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('signup.emailPlaceholder')}
        />
      </div>
      <div>
        <label>{t('signup.password')}</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={t('signup.passwordPlaceholder')}
        />
      </div>
      <div>
        <label>{t('signup.confirmPassword')}</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder={t('signup.confirmPasswordPlaceholder')}
        />
      </div>
      <button type="submit">{t('signup.submit')}</button>
    </form>
  );
}
