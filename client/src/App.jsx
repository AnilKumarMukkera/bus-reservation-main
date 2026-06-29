import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/HomePage/Home';
import Bookings from './components/HomePage/Bookings';
import Subscription from './components/HomePage/Subscription';
import './App.css';
// Ensure PaymentPage CSS is loaded early so its scoped rules apply
import './Pages/PaymentPage.css';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Header from './components/Navigation/Header';
import Account from './components/HomePage/Account';
import CancelBooking from './components/HomePage/CancelBooking';
import Feedback from './components/HomePage/Feedback';
import FAQs from './components/HomePage/FAQs';
import Termsandconditions from './components/HomePage/Termsandconditions';
import PrivacyandPolicy from './components/HomePage/PrivacyandPolicy';
import Aboutus from './components/HomePage/Aboutus';
import BusTicket from './components/HomePage/BusTicket';
import WalletPage from './components/HomePage/WalletPage';
import ChangePassword from './components/HomePage/ChangePassword';
import BusDetailsPage from './Pages/BusDetailsPage';
import SeatLayoutPage from './Pages/SeatLayoutPage';
import PaymentPage from './Pages/PaymentPage';
 
function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/bookings"        element={<Bookings />} />
        <Route path="/subscribe"       element={<Subscription />} />
        <Route path="/profile"         element={<Account />} />
        <Route path="/cancel-booking" element={<CancelBooking />} />
        <Route path="/feedback"        element={<Feedback />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Register />} />
        <Route path="/faqs"            element={<FAQs />} />
        <Route path="/terms"           element={<Termsandconditions />} />
        <Route path="/privacy"         element={<PrivacyandPolicy />} />
        <Route path="/about"           element={<Aboutus />} />
        <Route path="/ticket"          element={<BusTicket />} />
        <Route path="/wallet"          element={<WalletPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/bus-details"     element={<BusDetailsPage />} />
        <Route path="/seat-layout/:busId" element={<SeatLayoutPage />} />
        <Route path="/payment"         element={<PaymentPage />} />
      </Routes>
    </div>
  );
}
 
export default App;
 
 