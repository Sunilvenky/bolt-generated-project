import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Menu, X, Home, Map, Calendar, Settings, Users, Ticket, ChevronRight } from 'lucide-react';
import SideMenu from './components/SideMenu';
import TripList from './components/TripList';
import AddTrip from './components/AddTrip';
import CustomerList from './components/CRM/CustomerList';
import AddCustomer from './components/CRM/AddCustomer';
import BookingList from './components/Bookings/BookingList';
import AddBooking from './components/Bookings/AddBooking';
import TripCalendar from './components/Calendar/TripCalendar';
import SettingsPage from './components/Settings/SettingsPage';

function App() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/', active: location.pathname === '/' },
    { icon: <Map size={20} />, label: 'My Trips', path: '/trips', active: location.pathname === '/trips' },
    { icon: <Users size={20} />, label: 'CRM', path: '/crm', active: location.pathname.startsWith('/crm') },
    { icon: <Ticket size={20} />, label: 'Bookings', path: '/bookings', active: location.pathname.startsWith('/bookings') },
    { icon: <Calendar size={20} />, label: 'Calendar', path: '/calendar', active: location.pathname === '/calendar' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings', active: location.pathname === '/settings' },
  ];

  return (
    <div className="d-flex min-vh-100">
      <button
        className="d-lg-none position-fixed top-0 start-0 mt-3 ms-3 btn btn-light shadow-sm z-3"
        onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
      >
        {isSideMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <SideMenu isOpen={isSideMenuOpen} menuItems={menuItems} />

      <div className="flex-grow-1" style={{ marginLeft: '250px', width: 'calc(100% - 250px)' }}>
        <div className="container-fluid p-4">
          <div className="d-flex align-items-center mb-4">
            <span className="text-muted me-2">Home</span>
            <ChevronRight size={16} className="text-muted" />
            <span className="fw-medium">
              {location.pathname.startsWith('/crm') ? 'CRM' : 
               location.pathname.startsWith('/bookings') ? 'Bookings' :
               location.pathname === '/calendar' ? 'Calendar' :
               location.pathname === '/settings' ? 'Settings' :
               'My Trips'}
            </span>
          </div>
          
          <Routes>
            <Route path="/" element={<TripList />} />
            <Route path="/trips" element={<TripList />} />
            <Route path="/add-trip" element={<AddTrip />} />
            <Route path="/crm" element={<CustomerList />} />
            <Route path="/crm/add" element={<AddCustomer />} />
            <Route path="/bookings" element={<BookingList />} />
            <Route path="/bookings/add" element={<AddBooking />} />
            <Route path="/calendar" element={<TripCalendar />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
