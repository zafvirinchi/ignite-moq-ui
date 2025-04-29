import { Routes, Route } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import AddProduct from '../components/AddProduct';
import UpdateProduct from '../components/UpdateProduct';
import Dashboard from '../components/Dashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/update-product/:id" element={<UpdateProduct />} />

      
    </Routes>
  );
}
