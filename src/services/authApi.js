import axios from 'axios';

axios.defaults.withCredentials = true;

console.log(process.env.REACT_APP_API_URL);
const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, 
});

// Fetch CSRF token and store it
// const fetchCsrfToken = async () => {
//   const response = await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
//   // Laravel route to fetch CSRF token
//   return response;
// };

// Fetch CSRF token and store it
export const fetchCsrfToken = async () => {
  const response = await API.get('/sanctum/csrf-cookie', { withCredentials: true });
  return response;
};

export const Signup = async (userData) => {
  
  try{
    await fetchCsrfToken();
    const response = await API.post('/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.confirmPassword
    });
    const token = response.access_token;
    localStorage.setItem('access_token', token);
 
    // Set Authorization header for future requests
    API.defaults.headers['Authorization'] = `Bearer ${token}`;
 
     return response; 
    
  }catch (error) { 
    console.error("Signup Error:", error);
    alert('Signup failed!');
    }
}
  



export const Login = async (credentials) => {
  try {

    // First, fetch the CSRF token before making the login request
    await fetchCsrfToken();

    const response = await API.post('/login', {
      email: credentials.email,
      password: credentials.password,
    });
   // Save token to localStorage
   const token = response.access_token;
   localStorage.setItem('access_token', token);

   // Set Authorization header for future requests
   API.defaults.headers['Authorization'] = `Bearer ${token}`;


    return response; 
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export default API;

