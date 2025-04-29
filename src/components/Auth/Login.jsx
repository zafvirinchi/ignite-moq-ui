import '../../i18N/i18n'; 
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Login,fetchCsrfToken } from '../../services/authApi';
import { useNavigate, Link } from 'react-router-dom'; // Link imported here
import Layout from '../../components/Layout'; // Layout imported here

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isSaving, setIsSaving] = useState(false); // isSaving state added

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true); // start saving

    try {

      await fetchCsrfToken();

      const response = await Login(formData);
      const token = response.access_token;
      console.log("token",token);
      localStorage.setItem('authToken',JSON.stringify(token));

      alert(t('login.success'));
      navigate('/dashboard');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(t('login.error'));
    } finally {
      setIsSaving(false); // stop saving
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
              <div className="card-body p-4 p-sm-5">
                <h5 className="card-title text-center mb-5 fw-light fs-5">{t('login.title')}</h5>

                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="floatingEmail"
                      placeholder={t('login.email')}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                   <label htmlFor="floatingEmail">{t('login.email')}</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="floatingPassword"
                      placeholder={t('login.password')}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="floatingPassword">{t('login.password')}</label>
                  </div>

                  <div className="d-grid">
                    <button
                      disabled={isSaving}
                      type="submit"
                      className="btn btn-primary btn-login text-uppercase fw-bold"
                    >
                      {isSaving ? t('login.saving') : t('login.submit')}
                    </button>
                  </div>

                  <hr className="my-4" />

                  <div className="d-grid">
                    <Link
                      className="btn btn-outline-primary btn-login text-uppercase fw-bold"
                      to="/signup"
                    >
                      {t('login.createAccount')}
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
