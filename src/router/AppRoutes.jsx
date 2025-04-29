import { Routes, Route } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import AddProduct from '../components/AddProduct';
import UpdateProduct from '../components/UpdateProduct';
import Dashboard from '../components/Dashboard';
import DeleteProduct from '../components/DeleteProduct';
import ShowMaterial from '../components/ShowMaterial';
import EditMaterial from '../components/EditMaterial';
import AddMaterial from '../components/AddMaterial';
import DeleteMaterial from '../components/DeleteMaterial';

export default function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/update-product/:id" element={<UpdateProduct />} />
      <Route path="/delete-product/:id" element={<DeleteProduct />} />
      <Route path="/materials/:id" element={<ShowMaterial />} />
      <Route path="/materials/add" element={<AddMaterial />} />
      <Route path="/materials/delete/:id" element={<DeleteMaterial />} />
    </Routes>
  );
}
