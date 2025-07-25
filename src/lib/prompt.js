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
Predict optimal quantities for tomorrow based on this warteg sales data. Return JSON only:
{"ayam goreng": 25, "tempe orek": 40}
replace "ayam goreng" and "tempe orek" in accordance with the menus available in the data.

Historical Data:
${JSON.stringify(historicalData, null, 2)}
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
