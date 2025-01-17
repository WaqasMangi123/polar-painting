const { google } = require('googleapis');

// Service account credentials
const serviceAccountKey = {
  type: "service_account",
  project_id: "symmetric-sylph-421415",
  private_key_id: "216f974f6936745f85012903fdb8e3b61375a68a",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDMXk1VDr5pHXGH\nM7cutY7ins5upmMW+AreUCAQCEUSTgnABtD7oEM7Wcn61j5oJCQF6CEOOHr+8t7v\nzXqkdlkwrHgtPxYpUYzh5o+ZoDXwrZ659is0SqsHQl//cZ8k2xZNf7hWlZg3lOGg\n6r/5yutZHIdvooQUT3txRDYtYRN5e/Z4QsF1y/HBdIV5CO/AUcm0FIFF50afqLfJ\n6lPAqMWyuSRIEvThnFbVaEr32IUavd3uKEZDJZIIRpL5Od0+00Xz5SQeAnr7xnzM\nK9+EavcKGPKJRUKVgLay+3dPt1QGdgaRyYLqkXv3Itd26L14h45dV1K6G6RD+q8U\nJP8B4+RBAgMBAAECggEAUlWPrDvjZG/TRBgGrc/Bf/Vgz11DQIavwj7fm/Xo9eXw\nsadNXIKFc4zJ/b+Apu4ggSyy3IrOqpXoUQ4kYcu4RQ7G39uxrvXG31/G7KqJ8KvR\n7bOKVmfanXMVP9FjvzJwuspA1skv6PyXJgBNVXJ1/JGs0sHTmmcnIUvM091vPhqF\nbODoIYhF3wWTynPETA0eHdXxdIVVIfWZRDl8PkdY3f7fk5mS9l2F83GKstXvgOqk\nJ6dJvV0GeJ4OigTCFFFlh6iMy5CpXRJLyq7qmrDdMKb+k8QvTIfjXSJonHffYB5i\nvUYxyAn2A0wDcqmswqSnIw9UGZN41V+PunTzAIAGzQKBgQDxwWXj1hU59txzFkiv\nu065/8+fuigfm5jR2ER68P9M33qcrQOxbahYfPjY6kFuSOyvM65ZmbH5k8o6fel6\nta5jgdMFiePVqu1a0KnQFms90C9wK5u+0MwrXYb/rOy5uNtTHEkWGQEnl2gbryUp\nIXtvXkQfWPwnIuzX06M7C/O+NwKBgQDYaPaC3cXoToCAw2JgipGKXfcvaykzEKPn\nSJ9HPV1x/Hu5d4rNg1N3Nub5jJcYdaqLNuYn1tSasr9aLYB0wOaAuGxYRJR/7l7c\nBudNPqFL8GfucrHfNn6AIoZW2vlqeTf4KFK8058u4yCosTrGvupI3a2MNEOt8wYh\nslllqf11RwKBgHl2YJnS8sE3rVTJSmW4Zvp+czNeFVCkHWi5DtbyBGL8GR9kselQ\nHfeveluJfqxJSVlRTvTHiqrJPR6cKlUzuNVX4czzlZvBkBVDpz3cNa9NzLe/wTVi\ntGHJUM1edWVuYgtkt7e5gmIA6RaXrcT3hIvUwcc6Lx3+px5cv7Mn8yOLAoGAR9Bt\nHXhi2HhUhGZSGx9gtL4B7SZugZegDHw4/vcKL21N0XouAYz3AbSiaWWSLne9pH0P\nW2EbJEr03QQEgLoSw9xvd8sqTFnZ+MIBt8x00jJxCtvc0unOiM7sLZ507jRTsnIP\nIsJHLNQKXnCRxKpOLOgDU2d0niDrg/sfV3FVvrkCgYAUAIPqwSuD2GuXoMrVdbYh\n21lb+eBzFNMF2NGyD/NUXqvjqMCkBK8b+N19X9TVs6H2RhydYp0rtKyf++NkjIx9\njB3zw38BigUnND9nT1N/8fmurKX51+eW/kW5cB4JEC5gVHTsEv9crAZp4SV3HmrT\nFUL8ghrHqf78WRFf8RUxMg==\n-----END PRIVATE KEY-----\n",
  client_email: "ga4-service-account@symmetric-sylph-421415.iam.gserviceaccount.com",
  client_id: "112657649623916834559",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/ga4-service-account%40symmetric-sylph-421415.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// Authenticate with Google API
async function authenticate() {
  try {
    const auth = new google.auth.JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'], // Scope for Google Analytics API
    });

    const authClient = await auth.authorize();
    console.log('Authentication successful');
    return auth;
  } catch (error) {
    console.error('Authentication failed:', error.message);
    throw error;
  }
}

// Fetch Analytics Data
async function fetchGoogleAnalyticsData(authClient) {
  try {
    const analytics = google.analyticsdata('v1beta');

    // Replace YOUR_PROPERTY_ID with your actual Google Analytics Property ID
    const propertyId = '471357649';

    const response = await analytics.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }],
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      },
      auth: authClient,
    });

    console.log('Google Analytics Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error.message);
  }
}

// Run the script
authenticate()
  .then((authClient) => fetchGoogleAnalyticsData(authClient))
  .catch((error) => console.error('Error:', error.message));
