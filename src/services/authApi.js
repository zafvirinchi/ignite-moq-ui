import axios from 'axios';



const API_URL = process.env.REACT_APP_API_URL;

export const signup = async (userData) => {
  return await axios.post(`${API_URL}/register`, {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    password_confirmation: userData.confirmPassword
  });
};



export const login = async (credentials) => {
  try {
    const response = await axios.post('/login', {
      email: credentials.email,
      password: credentials.password,
    });

    return response; // Return the response to the component
  } catch (error) {
    console.error("Login Error:", error);
    throw error; // Rethrow error for handling in the component
  }
};

