import React from 'react';
import { useNavigate } from 'react-router-dom';

const trips = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&h=250',
    title: 'Beach Resort Stay',
    location: 'Maldives',
    date: 'Mar 15 - Mar 20, 2024',
    status: 'Upcoming'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&h=250',
    title: 'City Break',
    location: 'Paris, France',
    date: 'Apr 5 - Apr 10, 2024',
    status: 'Planning'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=400&h=250',
    title: 'Mountain Retreat',
    location: 'Swiss Alps',
    date: 'May 1 - May 7, 2024',
    status: 'Confirmed'
  }
];

const TripList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">My Trips</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/add-trip')}
        >
          Add New Trip
        </button>
      </div>

      <div className="row g-4">
        {trips.map((trip) => (
          <div key={trip.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <img
                src={trip.image}
                alt={trip.title}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{trip.title}</h5>
                <p className="card-text text-muted small mb-2">{trip.location}</p>
                <p className="card-text text-muted small mb-3">{trip.date}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className={`badge ${
                    trip.status === 'Upcoming' ? 'bg-primary' :
                    trip.status === 'Planning' ? 'bg-warning' :
                    'bg-success'
                  }`}>
                    {trip.status}
                  </span>
                  <button className="btn btn-outline-primary btn-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TripList;
