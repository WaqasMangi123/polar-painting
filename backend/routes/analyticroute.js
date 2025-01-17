const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

// Service account credentials
const serviceAccountKey = { 
  type: "service_account",
  project_id: "symmetric-sylph-421415",
  private_key_id: "216f974f6936745f85012903fdb8e3b61375a68a",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDMXk1VDr5pHXGH\nM7cutY7ins5upmMW+AreUCAQCEUSTgnABtD7oEM7Wcn61j5oJCQF6CEOOHr+8t7v\n...",
  client_email: "ga4-service-account@symmetric-sylph-421415.iam.gserviceaccount.com",
  client_id: "112657649623916834559",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/ga4-service-account%40symmetric-sylph-421415.iam.gserviceaccount.com"
};

// Authenticate with Google API
async function authenticate() {
  try {
    const auth = new google.auth.JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    return auth;
  } catch (error) {
    console.error('Error during authentication:', error.message);
    throw error;
  }
}

// Fetch Analytics Data
async function fetchGoogleAnalyticsData(authClient) {
  try {
    const analytics = google.analyticsdata('v1beta');
    const propertyId = '471357649'; // Replace with your actual GA4 property ID

    const response = await analytics.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dimensions: [
          { name: 'date' },
          { name: 'country' } // Example additional dimension
        ],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' }, // Real-time active users
          { name: 'pageviews' }, // Total pageviews
          { name: 'screenPageViews' }, // Screen views
          { name: 'averageSessionDuration' } // Average session duration
        ],
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      },
      auth: authClient,
    });

    console.log('Fetched Analytics Data:', JSON.stringify(response.data, null, 2)); // Log the response for debugging
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics data:', error.message);
    throw error;
  }
}

// Define the route
router.get('/', async (req, res) => {
  try {
    const authClient = await authenticate();
    const analyticsData = await fetchGoogleAnalyticsData(authClient);

    // Format and send the response
    const formattedData = analyticsData.rows.map((row) => ({
      date: row.dimensionValues[0].value,
      country: row.dimensionValues[1].value,
      sessions: row.metricValues[0].value,
      activeUsers: row.metricValues[1].value,
      pageViews: row.metricValues[2].value,
      screenPageViews: row.metricValues[3].value,
      averageSessionDuration: row.metricValues[4].value,
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error in analytics route:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
