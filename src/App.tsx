import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TripList from './components/TripList';
import AddTrip from './components/AddTrip';
import SettingsPage from './components/Settings/SettingsPage';
import CustomerList from './components/CRM/CustomerList';
import AddCustomer from './components/CRM/AddCustomer';
import TripCalendar from './components/Calendar/TripCalendar';
import BookingList from './components/Bookings/BookingList';
import AddBooking from './components/Bookings/AddBooking';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/trips" element={<TripList />} />
      <Route path="/add-trip" element={<AddTrip />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/crm" element={<CustomerList />} />
      <Route path="/crm/add" element={<AddCustomer />} />
      <Route path="/calendar" element={<TripCalendar />} />
      <Route path="/bookings" element={<BookingList />} />
      <Route path="/bookings/add" element={<AddBooking />} />
    </Routes>
  );
}

export default App;
