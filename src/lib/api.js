const API_BASE_URL = "https://api.smarteg.app";

// Get an ephemeral token for the AI to use
export async function getEphemeralToken() {
    const response = await fetch(`${API_BASE_URL}/service/gemini/token`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1AZmFpei5hdCIsImF1dGgiOiJnb29nbGUiLCJpYXQiOjE3NTMzNzQzMjQsImV4cCI6MTc1MzQ2MDcyNH0.Ypk7Ri_kNi1gggRsor2kYDQOlMtzLCsTbE9_RKRBAJ8`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch ephemeral token');
    }
    return response.json();
}

// Update the stock of a menu item
export async function updateStock(stockData) {
  console.log("API: Updating stock...", stockData);
  return fetch(`${API_BASE_URL}/stock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stockData),
  });
}

// Record a sale of a menu item
export async function recordSale(transactionData) {
  console.log("API: Recording sale...", transactionData);
  return fetch(`${API_BASE_URL}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData),
  });
}

// Get historical sales data for predictions
export async function getHistoricalData() {
  console.log("API: Fetching historical data...");
  const response = await fetch(`${API_BASE_URL}/data`);
  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }
  return response.json();
}

// Trigger a social media post about menu availability
export async function triggerSocialPost(socialPostData) {
    console.log("API: Triggering social media post...", socialPostData);
    return fetch(`${API_BASE_URL}/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialPostData),
    });
}

// Upload a waste report
export async function uploadWasteReport(reportData) {
    console.log("API: Uploading waste report...", reportData);
    return fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
    });
}
