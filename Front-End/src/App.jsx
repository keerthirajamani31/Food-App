import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/user/Home';
import Cart from './Pages/user/Cart';
import AboutPage from './Pages/user/AboutPage';
import ContactPage from './Pages/user/Contact';
import Login from './Component/Authentication/Login';
import Logout from './Component/Authentication/Logout';
import Orders from './Pages/Admin/Orders';
import ListItems from './Pages/Admin/ListItems';
import AddItems from './Pages/Admin/AddItems';
import AdminDashboard from './Component/Admin/AdminDashboard';
import Navbar from './Component/user/NavBar';
import AdminNavbar from './Component/Admin/AdminNavbar';
import Menu from './Pages/user/Menu/Menu';
import Footer from './Component/user/Footer'; 
import Register from './Component/Authentication/Register'
import AdminOffers from './Component/Admin/AdminOffers';
import AdminPanel from './Component/Admin/AdminPanel';
import Userorder from './Pages/user/Userorder';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <>
              <AdminNavbar />
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="add-items" element={<AddItems />} />
                <Route path="list" element={<ListItems />} />
                <Route path="adminorder" element={<Orders />} />
                <Route path='offer' element={<AdminOffers/>}/>
                <Route path='admin' element={<AdminPanel/>}/>
              </Routes>
            </>
          } />
          
          {/* User Routes */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="menu/:category" element={<Menu />} />
                <Route path="menu/:category/:itemName" element={<Menu />} />
                <Route path="cart" element={<Cart />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="login" element={<Login />} />
                <Route path="logout" element={<Logout />} />
                <Route path='register' element={<Register/>}/>
               <Route path='orders'element={<Userorder/>}/>
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;