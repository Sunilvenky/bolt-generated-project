import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface TravelerDetails {
  full_name: string;
  age: number;
  mobile: string;
  email: string;
}

const AddBooking: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [formData, setFormData] = useState({
    amount_paid: 0,
    payment_mode: 'Credit Card',
    number_of_tickets: 1,
    boarding_point: '',
    remarks: '',
    traveler_details: {
      full_name: '',
      age: '',
      mobile: '',
      email: ''
    }
  });

  const calculateTotal = () => {
    const basePrice = formData.amount_paid;
    // Add coupon logic here
    return basePrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, create the booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          amount_paid: formData.amount_paid,
          payment_mode: formData.payment_mode,
          number_of_tickets: formData.number_of_tickets,
          boarding_point: formData.boarding_point,
          remarks: formData.remarks,
          status: 'Confirmed',
          ...formData.traveler_details
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Then, add or update the customer in CRM
      const { error: customerError } = await supabase
        .from('customers')
        .upsert([{
          name: formData.traveler_details.full_name,
          email: formData.traveler_details.email,
          phone: formData.traveler_details.mobile,
          status: 'Active'
        }], {
          onConflict: 'email'
        });

      if (customerError) throw customerError;

      navigate('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('traveler_')) {
      const field = name.replace('traveler_', '');
      setFormData(prev => ({
        ...prev,
        traveler_details: {
          ...prev.traveler_details,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="h3 mb-4">Add New Booking</h1>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <h5 className="card-title">Booking Details</h5>
              </div>

              <div className="col-md-6">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  name="amount_paid"
                  value={formData.amount_paid}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-select"
                  name="payment_mode"
                  value={formData.payment_mode}
                  onChange={handleChange}
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Number of Tickets</label>
                <input
                  type="number"
                  className="form-control"
                  name="number_of_tickets"
                  value={formData.number_of_tickets}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Boarding Point</label>
                <input
                  type="text"
                  className="form-control"
                  name="boarding_point"
                  value={formData.boarding_point}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <h5 className="card-title mt-4">Traveler Details</h5>
              </div>

              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="traveler_full_name"
                  value={formData.traveler_details.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  name="traveler_age"
                  value={formData.traveler_details.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="traveler_mobile"
                  value={formData.traveler_details.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="traveler_email"
                  value={formData.traveler_details.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Remarks</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Coupon Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <div className="alert alert-info mt-4">
                  Total Amount: ${calculateTotal()}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button 
                type="submit" 
                className="btn btn-primary me-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Booking...
                  </>
                ) : 'Create Booking'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/bookings')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBooking;
