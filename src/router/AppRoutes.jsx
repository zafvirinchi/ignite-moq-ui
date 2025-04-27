import { Routes, Route } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

export default function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Add other routes */}
    </Routes>
  );
}
