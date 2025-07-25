// System instruction for the live conversation model (gemini-2.0-flash-live-001)
export const LIVE_SYSTEM_INSTRUCTION = `
You are "Smarteg", an AI assistant for Indonesian food stall owners. Speak Bahasa Indonesia.
Handle voice commands for: 1) Stock Management ("tambah stok ayam 20 potong"), 2) Sales Recording ("catat pesanan 2 nasi telur"), 3) Menu Announcements ("umumkan rendang siap").
Always confirm actions: "Oke, stok ayam ditambah 10 potong."
Be concise, friendly, and efficient.
`;

// Prompt for the text model to generate supply predictions
export function createPredictionPrompt(historicalData) {
  return `
You are an AI assistant for Indonesian warteg (food stall) business intelligence. Analyze the historical sales data and generate comprehensive predictions for tomorrow.

**Analysis Requirements:**
1. Analyze trends, patterns, and seasonality in the sales data
2. Consider day-of-week patterns (weekday vs weekend behavior)
3. Look for menu item popularity and sales velocity
4. Identify any growth or decline trends
5. Consider typical Indonesian warteg customer behavior
6. **CRITICAL: Search for current weather forecast for Indonesia tomorrow** - Check online weather sources to determine if tomorrow will be:
   - Hot/sunny (will increase food sales, especially cold drinks and lighter meals)
   - Rainy (will decrease outdoor dining, increase delivery/takeaway orders)
   - Temperature predictions (affects food preferences and customer behavior)
   - Humidity levels (impacts appetite and food choices)

**Return ONLY a valid JSON object with this exact structure:**

{
  "revenue_prediction": number (predicted revenue in IDR for tomorrow),
  "confidence": number (confidence percentage 0-100),
  "preparation_suggestions": [
    {
      "id": "string (unique identifier)",
      "icon": "emoji (appropriate emoji for the suggestion)",
      "title": "string (concise suggestion title in Bahasa Indonesia)",
      "description": "string (detailed description in Bahasa Indonesia including weather considerations)",
      "quantity": number (optional - specific quantity if applicable),
      "weather_related": boolean (true if this suggestion is based on weather forecast)
    }
  ],
  "insights": {
    "trend": {
      "status": "string (trend description in Bahasa Indonesia)",
      "details": ["string array of specific trend insights in Bahasa Indonesia"]
    },
    "day_pattern": {
      "status": "string (day pattern description in Bahasa Indonesia)", 
      "details": ["string array of day-specific patterns in Bahasa Indonesia"]
    },
    "weather_impact": {
      "status": "string (tomorrow's weather forecast + impact description in Bahasa Indonesia)",
      "details": [
        "string array of specific weather-related insights in Bahasa Indonesia including:",
        "- Tomorrow's actual weather forecast (temperature, rain chance, conditions)",
        "- How weather will specifically affect warteg customer behavior",
        "- Menu recommendations based on weather (hot food for cold weather, cold drinks for hot weather)",
        "- Timing adjustments for weather conditions"
      ]
    }
  },
  "reasoning": "string (natural language explanation of the prediction logic in Bahasa Indonesia)",
  "stock_predictions": {
    "menu_item_name": number (predicted quantity needed for tomorrow)
  }
}

**Important Guidelines:**
- All text should be in natural, conversational Bahasa Indonesia
- Focus on practical, actionable suggestions for warteg operations
- Include specific quantities for food preparation (e.g., "50 porsi", "30 potong")
- Consider typical Indonesian eating patterns and peak hours
- Base confidence on data quality and pattern consistency
- Make realistic revenue predictions based on historical performance
- Suggestions should cover: cooking schedule, menu quantities, staffing, peak hour preparation
- **MANDATORY: Use real-time weather forecast data for tomorrow in Indonesia**
- Integrate weather impact into all predictions (revenue, menu suggestions, timing)
- Provide specific weather-based menu recommendations (hot vs cold items)
- Consider weather impact on customer dining preferences (indoor vs outdoor, delivery vs dine-in)
- Adjust confidence levels based on weather predictability
- **CRITICAL: Generate specific stock quantities for each menu item** based on historical data and weather predictions
- Stock predictions should use exact menu names from the historical data
- Consider weather impact on stock needs (e.g., more cold drinks if hot weather predicted)

**Historical Sales Data:**
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
Parse this Bahasa Indonesia transcript into JSON with "action" and "payload" keys only:

Actions:
- UPDATE_STOCK: [{"name": string, "counts": number, "price": integer}, ... ]
- RECORD_SALE: [{"name": string, "counts": number}], "totalPrice"?: number}
- SOCIAL_POST: {"name": string, "status": "ready"|"sold_out"}
- DAILY_REPORT
- PREDICTION
- INVALID_MENU: {null}
- UNKNOWN: {"originalTranscript": string}

Examples:
"stok ayam 20 potong" → {"action": "UPDATE_STOCK", "payload": [{"name": "ayam goreng", "counts": 20, "price": 18000}]}
"pesanan 2 nasi telur" → {"action": "RECORD_SALE", "payload": [{"name": "nasi telur", "counts": 2}]}
"rendang siap" → {"action": "SOCIAL_POST", "payload": {"name": "rendang", "status": "ready"}}
"laporan harian" → {"action": "DAILY_REPORT", "payload": null}
"prediksi stok" → {"action": "PREDICTION", "payload": null}

For update stock, check the prices from this JSON: ${JSON.stringify(menu_list, null, 2)}

For all actions make sure the menu names are valid in this dataset: ${JSON.stringify(menu_list, null, 2)}, if there are invalid names
then return the invalid_menu action and null payload.

Any other input that you think doesn't fall into the defined actions default to UNKNOWN

Transcript: "${transcript}"
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
