// System instruction for the live conversation model (gemini-2.0-flash-live-001)
export const LIVE_SYSTEM_INSTRUCTION = `
Anda adalah “Smarteg”, asisten AI untuk pemilik warung makan Indonesia. Berbicara dalam Bahasa Indonesia.  
Mengelola perintah suara untuk: 1) Manajemen Stok (“tambah stok ayam 20 potong”), 2) Pencatatan Penjualan (“catat pesanan 2 nasi telur”), 3) Pengumuman Menu (“umumkan rendang siap”).
Selalu konfirmasikan tindakan: “Oke, stok ayam ditambah 10 potong.”  
Jadilah ringkas, ramah, dan efisien.
`;

// Prompt for the text model to generate supply predictions
export function createPredictionPrompt(historicalData) {
  return `
Prediksi jumlah optimal untuk besok berdasarkan data penjualan warteg ini. Kembalikan JSON saja:
{“ayam goreng”: 25, “tempe orek”: 40}
Ganti “ayam goreng” dan “tempe orek” sesuai dengan menu yang tersedia dalam data.

Data Historis:
${JSON.stringify(historicalData, null, 2)}

**WEATHER ANALYSIS REQUIREMENTS:**
Before making any predictions, you MUST:
1. Look up the actual weather forecast for Indonesia tomorrow (temperature, rain probability, wind, humidity)
2. Determine the exact weather conditions expected
3. Integrate this weather data into ALL your recommendations
4. Mark weather-influenced suggestions with "weather_related": true
5. Provide specific menu adjustments based on weather (example: "Jika panas, siapkan es teh manis 30 gelas extra")

**Examples of weather-based suggestions:**
- Hot weather (>30°C): Increase cold drinks, lighter meals, ice desserts
- Rainy weather: More hot soups, comfort food, reduce outdoor seating expectations
- High humidity: Fresh salads, cold appetizers, avoid heavy fried foods
- Pleasant weather (25-28°C): Normal operations with slight increase in overall sales

**STOCK PREDICTION REQUIREMENTS:**
Generate optimal quantities for each menu item found in the historical data. Use this format:
"stock_predictions": {
  "ayam goreng": 25,
  "tempe orek": 40,
  "nasi gudeg": 35
}
Replace "ayam goreng", "tempe orek", "nasi gudeg" with the actual menu items from the historical sales data.

**Stock Calculation Guidelines:**
- Analyze average daily sales for each menu item from historical data
- Apply trend adjustments (increasing/decreasing popularity)
- Factor in day-of-week patterns (weekend vs weekday)
- **Apply weather adjustments** (hot weather = more cold items, rainy weather = more warm items)
- Add safety buffer for popular items (10-20% extra)
- Consider seasonal preferences and Indonesian food culture
- Ensure quantities are realistic and achievable for a warteg operation

Analyze the historical data AND current weather forecast thoroughly to provide actionable insights for tomorrow's warteg operations.
  `;
}

// Prompt for the text model to parse commands
export function createCommandParserPrompt(transcript, menu_list) {
    return `
Parsing transkrip Bahasa Indonesia ini menjadi JSON dengan kunci “action” dan “payload” saja:

Transkrip: "${transcript}"

Actions:
- UPDATE_STOCK: [{"name": string, "counts": number, "price": integer}, ... ]
- RECORD_SALE: [{"name": string, "counts": number}], "totalPrice"?: number}
- SOCIAL_POST: {"name": string, "status": "ready"|"sold_out"}
- DAILY_REPORT
- PREDICTION
- INVALID_MENU: {null}
- UNKNOWN: {"action": "UNKNOWN", "payload": {"originalTranscript": string}}

Examples:
"stok ayam 20 potong" → {"action": "UPDATE_STOCK", "payload": [{"name": "ayam goreng", "counts": 20, "price": 18000}]}
"pesanan 2 nasi telur" → {"action": "RECORD_SALE", "payload": [{"name": "nasi telur", "counts": 2}]}
"umumkan rendang siap" → {"action": "SOCIAL_POST", "payload": {"name": "rendang", "status": "ready"}}
"buat laporan harian" → {"action": "DAILY_REPORT", "payload": null}
"prediksi stok" → {"action": "PREDICTION", "payload": null}

Jangan terpaku pada contoh barusan, maknai sesuai arti di bawah dan tentukan kategori ACTIONS yang paling sesuai berdasarkan konteks transkrip.

Arti setiap ACTIONS:
- UPDATE_STOCK:  ketika pengguna ingin menambahkan stok
- RECORD_SALE: ketika pengguna ingin mencatat penjualan
- SOCIAL_POST: ketika pengguna ingin mengumumkan sesuatu di media sosial atau dimanapun
- DAILY_REPORT: ketika pengguna meminta laporan harian atau hari ini
- PREDICTION: ketika pengguna ingin memprediksi stok besok

Untuk pembaruan stok, periksa harga dari JSON ini: ${JSON.stringify(menu_list, null, 2)}

Untuk semua tindakan, pastikan nama menu valid dalam dataset ini: ${JSON.stringify(menu_list, null, 2)}, jika ada nama yang tidak valid
maka kembalikan tindakan invalid_menu dan payload null.

PASTIKAN YANG KAMU KEMBALIKAN HANYA SALAH SATU DARI ACTIONS DI ATAS.
    `;
}

// Prompt for generating a daily report
export function createDailyReportPrompt(dailySales, dailyStock) {
  return `
Generate a daily report for a warteg based on the following data.
The report must be in two formats: a plain text summary and a well-structured HTML document.
Return the output as a single JSON object with two keys: "text" and "html".

**Data:**
- Daily Sales: ${JSON.stringify(dailySales, null, 2)}
- Daily Stock Left: ${JSON.stringify(dailyStock, null, 2)}

**Report Requirements:**
1.  **Summary Table**:
    - Item Name
    - Starting Stock (stock left + sales)
    - Stock Left
    - Sales
    - Waste Percentage:
        - For perishable items (e.g., cooked dishes like "rendang", "ayam goreng"), calculate as (Stock Left / Starting Stock) * 100.
        - For non-perishable/raw items (e.g., "beras", "telur"), set to 0.
        - Use your knowledge of Indonesian cuisine to determine if an item is perishable.
2.  **Sustainability Recommendations**:
    - For items with waste, provide creative and practical recommendations to reduce waste, such as:
        - Repurposing leftovers into new dishes (e.g., "Nasi Goreng Gila" from various leftovers).
        - Offering discounts on items nearing their end of day.
        - Partnering with local food banks or communities.
    - The tone should be encouraging and supportive, focusing on circular economy principles.
3.  **Formatting**:
    - **Text**: A clean, readable summary. Use markdown for tables.
    - **HTML**: A clean, single HTML document using tables and basic CSS for styling. The HTML should be visually appealing and easy to read.

**Example JSON Output:**
{
  "text": "## Laporan Harian - 25 Juli 2025...",
  "html": "<html><head><title>Laporan Harian</title><style>body{font-family: sans-serif;} table{width: 100%; border-collapse: collapse;} th,td{border: 1px solid #ddd; padding: 8px;}</style></head><body><h1>Laporan Harian - 25 Juli 2025</h1><h2>Ringkasan Harian</h2><table>...</table><h2>Rekomendasi Keberlanjutan</h2>...</body></html>"
}
`;
}

// Prompt for generating waste analysis and recommendations
export function createWasteAnalysisPrompt(wasteData, salesData, stockData) {
  return `
You are an AI assistant for Indonesian warteg (food stall) waste management and sustainability. Analyze the waste data and provide comprehensive insights for reducing food waste and improving sustainability.

**Analysis Requirements:**
1. Analyze waste patterns and identify problematic items
2. Provide specific, actionable recommendations for waste reduction
3. Calculate environmental impact and savings opportunities
4. Consider Indonesian food culture and warteg business practices
5. Focus on practical solutions that warteg owners can implement immediately

**Return ONLY a valid JSON object with this exact structure:**

{
  "waste_analysis": {
    "total_waste_kg": number,
    "total_waste_percentage": number,
    "waste_trend": "improving" | "worsening" | "stable",
    "efficiency_score": number (0-100)
  },
  "problem_areas": [
    {
      "menu_name": "string",
      "waste_percentage": number,
      "waste_amount": number,
      "severity": "low" | "medium" | "high" | "critical",
      "root_causes": ["string array of identified causes"],
      "recommendations": [
        {
          "action": "string (specific action to take)",
          "impact": "string (expected impact)",
          "priority": "immediate" | "short_term" | "long_term",
          "cost": "low" | "medium" | "high"
        }
      ]
    }
  ],
  "environmental_impact": {
    "food_waste_kg_saved": number,
    "carbon_footprint_reduced_kg": number,
    "water_saved_liters": number,
    "economic_savings_idr": number,
    "sustainability_score": number (0-100),
    "impact_reasoning": [
      "string array of detailed explanations about environmental benefits",
      "Include specific calculations and methodology",
      "Explain the connection between food waste reduction and environmental impact"
    ]
  },
  "actionable_insights": [
    {
      "title": "string (insight title in Bahasa Indonesia)",
      "description": "string (detailed explanation in Bahasa Indonesia)",
      "implementation": "string (how to implement this insight)",
      "expected_reduction": "string (expected waste reduction percentage)"
    }
  ]
}

**Important Guidelines:**
- All text should be in natural, conversational Bahasa Indonesia
- Focus on practical, cost-effective solutions for small warteg businesses
- Consider Indonesian food culture (e.g., preference for fresh food, family-style eating)
- Provide specific quantities and percentages where possible
- Include creative repurposing ideas for leftover Indonesian dishes
- Consider seasonal patterns and local community needs
- Provide realistic timeline expectations for implementation

**Waste Calculation Context:**
Each food item's waste is calculated as: Initial Stock - Sales - Current Stock Remaining
Items with >7% waste are considered problematic and need immediate attention.
Target waste percentage is 5% or below for optimal efficiency.

**Environmental Impact Calculations:**
- Food waste contributes to greenhouse gas emissions when decomposing
- Calculate carbon footprint based on food production and disposal
- Water usage includes production, processing, and disposal
- Economic savings include direct cost savings and opportunity costs

**Data to Analyze:**
- Waste Data: ${JSON.stringify(wasteData, null, 2)}
- Sales Data: ${JSON.stringify(salesData, null, 2)}
- Stock Data: ${JSON.stringify(stockData, null, 2)}

Provide comprehensive, actionable insights that will help the warteg owner reduce waste, save money, and improve operational efficiency while maintaining their business profitability.
  `;
}
