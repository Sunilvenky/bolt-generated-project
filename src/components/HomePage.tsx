import React, { useState } from 'react';
import { Share, MapPin, BarChart2, Globe } from 'lucide-react';
import { Map, Marker, Popup } from 'react-map-gl';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const HomePage = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [mapFilters, setMapFilters] = useState({
    routeType: 'all',
    zoomLevel: 5
  });

  // Sample data
  const destinations = [
    {
      id: 1,
      name: 'Paris',
      coordinates: [2.3522, 48.8566],
      type: 'city',
      visitors: 1200,
      image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114'
    },
    // Add more destinations...
  ];

  const travelStats = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Travelers',
        data: [500, 800, 1200, 1500, 2000],
        backgroundColor: '#3b82f6'
      }
    ]
  };

  const destinationTypes = {
    labels: ['Cities', 'Beaches', 'Mountains'],
    datasets: [
      {
        data: [40, 35, 25],
        backgroundColor: ['#3b82f6', '#60a5fa', '#93c5fd']
      }
    ]
  };

  return (
    <div className="container-fluid p-4">
      <h1 className="h2 mb-4">Travel Dashboard</h1>

      {/* Interactive Map Section */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">
              <Globe className="me-2" />
              Explore Destinations
            </h2>
            <div className="d-flex gap-2">
              <select 
                className="form-select"
                value={mapFilters.routeType}
                onChange={(e) => setMapFilters({...mapFilters, routeType: e.target.value})}
              >
                <option value="all">All Routes</option>
                <option value="scenic">Scenic Routes</option>
                <option value="fastest">Fastest Routes</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
          
          <div className="map-container" style={{ height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
            <Map
              initialViewState={{
                longitude: 0,
                latitude: 30,
                zoom: mapFilters.zoomLevel
              }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            >
              {destinations.map(dest => (
                <Marker
                  key={dest.id}
                  longitude={dest.coordinates[0]}
                  latitude={dest.coordinates[1]}
                  onClick={() => setSelectedDestination(dest)}
                >
                  <MapPin className="text-blue-500" size={32} />
                </Marker>
              ))}

              {selectedDestination && (
                <Popup
                  longitude={selectedDestination.coordinates[0]}
                  latitude={selectedDestination.coordinates[1]}
                  onClose={() => setSelectedDestination(null)}
                >
                  <div className="p-2">
                    <img 
                      src={selectedDestination.image} 
                      alt={selectedDestination.name}
                      className="w-100 rounded mb-2"
                      style={{ height: '100px', objectFit: 'cover' }}
                    />
                    <h3 className="h5 mb-1">{selectedDestination.name}</h3>
                    <p className="text-muted small mb-2">
                      Visitors: {selectedDestination.visitors}
                    </p>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        // Add share functionality
                      }}
                    >
                      <Share size={16} className="me-1" />
                      Share
                    </button>
                  </div>
                </Popup>
              )}
            </Map>
          </div>
        </div>
      </div>

      {/* Data Visualization Section */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5 mb-3">
                <BarChart2 className="me-2" />
                Travel Statistics
              </h3>
              <Bar 
                data={travelStats} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5 mb-3">
                <PieChart className="me-2" />
                Destination Types
              </h3>
              <Pie 
                data={destinationTypes}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
