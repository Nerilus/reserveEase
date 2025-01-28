import CreateHotel from './components/createHotel/CreateHotel';
import Login from './pages/login/Login';
import RegisterForm from './pages/register/Register';
import HotelList from './components/hotelList/HotelList';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Home from './pages/home/Home';
import PrivateRoute from './router/PrivateRoute';
import ProtectedRoute from './router/PrivateRoute';
import NavBar from './components/navBar/NavBar';
// import PrivateRoute from './router/PrivateRoute';

const App: React.FC = () => {
  const baseUrl = 'http://localhost:8000/api/auth';

  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<HotelList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm baseUrl={baseUrl} />} />
        {/* <Route path="/hotels" element={<HotelList />} /> */}
        {/* Utilisation de ProtectedRoute pour une création d'hôtel réservée aux administrateurs */}
      
        <Route path="/create" element={<CreateHotel />} />
          
    
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  </Router>
  );
}

export default App;