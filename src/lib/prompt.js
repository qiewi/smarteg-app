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
- INVALID_MENU: {null}
- UNKNOWN: {"originalTranscript": string}

Examples:
"tambah stok ayam 20 potong" → {"action": "UPDATE_STOCK", "payload": [{"name": "ayam goreng", "counts": 20, "price": 18000}]}
"catat pesanan 2 nasi telur" → {"action": "RECORD_SALE", "payload": [{"name": "nasi telur", "counts": 2}]}
"rendang siap" → {"action": "SOCIAL_POST", "payload": {"name": "rendang", "status": "ready"}}

For update stock, check the prices from this JSON: ${JSON.stringify(menu_list, null, 2)}

For all actions make sure the menu names are valid in this dataset: ${JSON.stringify(menu_list, null, 2)}, if there are invalid names
then return the invalid_menu action and null payload.

Any other input that you think doesn't fall into the defined actions default to UNKNOWN

Transcript: "${transcript}"
    `;
}
