const API_BASE_URL = "https://api.smarteg.app";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1AZmFpei5hdCIsImF1dGgiOiJnb29nbGUiLCJpYXQiOjE3NTMzNzQzMjQsImV4cCI6MTc1MzQ2MDcyNH0.Ypk7Ri_kNi1gggRsor2kYDQOlMtzLCsTbE9_RKRBAJ8";

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': TOKEN,
});

// Get an ephemeral token for the AI to use
export async function getEphemeralToken() {
    const response = await fetch(`${API_BASE_URL}/service/gemini/token`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch ephemeral token');
    }
    return response.json();
}

// Update the stock of a menu item
export async function updateStock(stockData) {
  console.log("API: Updating stock...", stockData);
  return fetch(`${API_BASE_URL}/service/stock/add`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(stockData),
  });
}

// Record a sale of a menu item
export async function recordSale(transactionData) {
  console.log("API: Recording sale...", transactionData);
  return fetch(`${API_BASE_URL}/service/sales/add`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(transactionData),
  });
}

// Get historical sales data for predictions
export async function getHistoricalData() {
  const endpoints = [
    'monthly',
    'weekly',
    'daily'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`API: Fetching ${endpoint} sales data...`);
      const response = await fetch(`${API_BASE_URL}/service/sales/${endpoint}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          console.log(`API: Successfully fetched ${endpoint} sales data.`);
          return data;
        }
      }
    } catch (error) {
      console.error(`API: Error fetching ${endpoint} sales data:`, error);
    }
  }

  throw new Error('Failed to fetch any historical sales data.');
}

// Trigger a social media post about menu availability
export async function triggerSocialPost(socialPostData) {
    console.log("API: Triggering social media post...", socialPostData);
    return fetch(`${API_BASE_URL}/social`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(socialPostData),
    });
}

// Upload a waste report
export async function uploadWasteReport(reportData) {
    console.log("API: Uploading waste report...", reportData);
    return fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reportData),
    });
}
