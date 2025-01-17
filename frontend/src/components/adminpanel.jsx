import React, { useState, useEffect } from 'react';
import './adminpanel.css';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminPanel = () => {
  const [userData, setUserData] = useState(null);
  const [metrics, setMetrics] = useState({
    realTimeUsers: 0,
    totalSessions: 0,
    totalPageViews: 0,
    screenPageViews: 0,
    avgSessionDuration: 0,
  });
  const [sessionChartData, setSessionChartData] = useState(null);
  const [pageViewChartData, setPageViewChartData] = useState(null);
  const [blogLikesData, setBlogLikesData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/login');
    } else {
      setUserData({ username: 'Admin User' });
      fetchAnalyticsData();
      fetchBlogLikesData();
    }
  }, [navigate]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics');
      const { success, data } = await response.json();

      if (success && data.length > 0) {
        const labels = data.map((item) => item.date); // Dates for the X-axis
        const sessions = data.map((item) => parseInt(item.sessions, 10)); // Total sessions
        const pageViews = data.map((item) => parseInt(item.pageViews, 10)); // Total pageviews
        const activeUsers = data.map((item) => parseInt(item.activeUsers, 10)); // Active users
        const screenPageViews = data.map((item) => parseInt(item.screenPageViews, 10)); // Screen views
        const avgSessionDuration = data.map((item) => parseFloat(item.averageSessionDuration)); // Average session duration

        // Set Metrics
        setMetrics({
          realTimeUsers: activeUsers.reduce((acc, curr) => acc + curr, 0),
          totalSessions: sessions.reduce((acc, curr) => acc + curr, 0),
          totalPageViews: pageViews.reduce((acc, curr) => acc + curr, 0),
          screenPageViews: screenPageViews.reduce((acc, curr) => acc + curr, 0),
          avgSessionDuration: (avgSessionDuration.reduce((acc, curr) => acc + curr, 0) / avgSessionDuration.length).toFixed(2),
        });

        // Set Sessions Chart Data
        setSessionChartData({
          labels,
          datasets: [
            {
              label: 'Sessions Over Time',
              data: sessions,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.3,
            },
          ],
        });

        // Set Page Views and Active Users Chart Data
        setPageViewChartData({
          labels,
          datasets: [
            {
              label: 'Page Views',
              data: pageViews,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.3,
            },
            {
              label: 'Active Users',
              data: activeUsers,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.3,
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const fetchBlogLikesData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogroutes/blogs');
      const blogs = response.data;

      if (blogs && blogs.length > 0) {
        const labels = blogs.map((blog) => blog.title); // Blog titles
        const likes = blogs.map((blog) => blog.likes); // Blog likes

        // Set Blog Likes Chart Data
        setBlogLikesData({
          labels,
          datasets: [
            {
              label: 'Blog Likes',
              data: likes,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching blog likes data:', error);
    }
  };

  return (
    <div className="unique-admin-panel-container">
      <div className="unique-admin-panel-sidebar">
        <div className="unique-admin-panel-logo">Polar Painting Admin Dashboard</div>
        <ul className="unique-admin-panel-menu">
          <li className="unique-admin-panel-menu-item">Dashboard</li>
          <li
            className="unique-admin-panel-menu-item"
            onClick={() => navigate('/adminblog')}
          >
            Add Blog
          </li>
          <li
            className="unique-admin-panel-menu-item"
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/home');
            }}
          >
            Logout
          </li>
        </ul>
      </div>
      <div className="unique-admin-panel-main-content">
        <div className="unique-admin-panel-header">
          <h1>Welcome, {userData ? userData.username : 'Loading...'}</h1>
        </div>
        <div className="unique-admin-panel-dashboard">
          {/* Summary Metrics */}
          <div className="unique-admin-panel-summary">
            <div className="unique-admin-panel-card">
              <div className="unique-admin-panel-card-header">Real-Time Active Users</div>
              <div className="unique-admin-panel-card-body">{metrics.realTimeUsers}</div>
            </div>
            <div className="unique-admin-panel-card">
              <div className="unique-admin-panel-card-header">Total Sessions</div>
              <div className="unique-admin-panel-card-body">{metrics.totalSessions}</div>
            </div>
            <div className="unique-admin-panel-card">
              <div className="unique-admin-panel-card-header">Total Page Views</div>
              <div className="unique-admin-panel-card-body">{metrics.totalPageViews}</div>
            </div>
            <div className="unique-admin-panel-card">
              <div className="unique-admin-panel-card-header">Screen Page Views</div>
              <div className="unique-admin-panel-card-body">{metrics.screenPageViews}</div>
            </div>
            <div className="unique-admin-panel-card">
              <div className="unique-admin-panel-card-header">Average Session Duration (s)</div>
              <div className="unique-admin-panel-card-body">{metrics.avgSessionDuration}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="unique-admin-panel-charts">
            <div className="unique-admin-panel-card">
              <div className="unique-admin-panel-card-header">Sessions Over Time</div>
              <div className="unique-admin-panel-card-body">
                {sessionChartData ? (
                  <Line data={sessionChartData} options={{ responsive: true }} />
                ) : (
                  'Loading Sessions Chart...'
                )}
              </div>
            </div>
            <div className="unique-admin-panel-card">
              <div className="unique-admin-panel-card-header">Page Views and Active Users</div>
              <div className="unique-admin-panel-card-body">
                {pageViewChartData ? (
                  <Line data={pageViewChartData} options={{ responsive: true }} />
                ) : (
                  'Loading Page Views Chart...'
                )}
              </div>
            </div>
            <div className="unique-admin-panel-card">
              <div className="unique-admin-panel-card-header">Blog Likes</div>
              <div className="unique-admin-panel-card-body">
                {blogLikesData ? (
                  <Bar data={blogLikesData} options={{ responsive: true }} />
                ) : (
                  'Loading Blog Likes Chart...'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
