import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { PlusCircle } from 'lucide-react';

interface Booking {
  id: string;
  full_name: string;
  amount_paid: number;
  number_of_tickets: number;
  boarding_point: string;
  created_at: string;
  status: string;
}

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Bookings</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/bookings/add')}
        >
          <PlusCircle size={20} className="me-2" />
          Add Booking
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer Name</th>
                    <th>Amount Paid</th>
                    <th>Tickets</th>
                    <th>Boarding Point</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id.slice(0, 8)}</td>
                      <td>{booking.full_name}</td>
                      <td>${booking.amount_paid}</td>
                      <td>{booking.number_of_tickets}</td>
                      <td>{booking.boarding_point}</td>
                      <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          booking.status === 'Confirmed' ? 'bg-success' :
                          booking.status === 'Pending' ? 'bg-warning' :
                          'bg-secondary'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/bookings/${booking.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingList;
