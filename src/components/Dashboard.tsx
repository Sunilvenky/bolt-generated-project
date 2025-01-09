import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const bookingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Bookings',
        data: [120, 190, 300, 500, 200, 300, 450],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [12000, 19000, 30000, 50000, 20000, 30000, 45000],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  const customerData = {
    labels: ['Business', 'Leisure', 'Group', 'Family'],
    datasets: [
      {
        label: 'Customers',
        data: [120, 190, 300, 500],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
      },
    ],
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="h3 mb-4">Dashboard Overview</h1>

      <div className="row g-4">
        {/* Bookings Chart */}
        <motion.div 
          className="col-12 col-lg-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4 }}
        >
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Monthly Bookings</h5>
              <div className="chart-container">
                <Line 
                  data={bookingData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div 
          className="col-12 col-lg-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Revenue Trends</h5>
              <div className="chart-container">
                <Bar
                  data={revenueData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Customer Demographics */}
        <motion.div 
          className="col-12 col-lg-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Customer Demographics</h5>
              <div className="chart-container">
                <Pie
                  data={customerData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
