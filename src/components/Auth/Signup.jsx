import '../../i18N/i18n';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Signup } from '../../services/authApi'; // assume you will create signup API call
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';

export default function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isSaving, setIsSaving] = useState(false);

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

    setIsSaving(true);

    try {
      const response = await Signup(formData); 
      const token = response.access_token;

      localStorage.setItem('authToken', token);

      alert(t('signup.success'));
      navigate('/');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(t('signup.error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
              <div className="card-body p-4 p-sm-5">
                <h5 className="card-title text-center mb-5 fw-light fs-5">{t('signup.title')}</h5>

                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      id="floatingName"
                      placeholder={t('signup.name')}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="floatingName">{t('signup.name')}</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="floatingEmail"
                      placeholder={t('signup.email')}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="floatingEmail">{t('signup.email')}</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="floatingPassword"
                      placeholder={t('signup.password')}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="floatingPassword">{t('signup.password')}</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      id="floatingConfirmPassword"
                      placeholder={t('signup.confirmPassword')}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="floatingConfirmPassword">{t('signup.confirmPassword')}</label>
                  </div>

                  <div className="d-grid">
                    <button
                      disabled={isSaving}
                      type="submit"
                      className="btn btn-primary btn-login text-uppercase fw-bold"
                    >
                      {isSaving ? t('signup.saving') : t('signup.submit')}
                    </button>
                  </div>

                  <hr className="my-4" />

                  <div className="d-grid">
                    <Link
                      className="btn btn-outline-primary btn-login text-uppercase fw-bold"
                      to="/"
                    >
                      {t('signup.backToLogin')}
                    </Link>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
