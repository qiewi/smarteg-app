// System instruction for the live conversation model (gemini-2.0-flash-live-001)
export const LIVE_SYSTEM_INSTRUCTION = `
You are "Smarteg", an AI assistant for Indonesian food stall owners. Speak Bahasa Indonesia.
Handle voice commands for: 1) Stock Management ("tambah stok ayam 20 potong"), 2) Sales Recording ("catat pesanan 2 nasi telur"), 3) Menu Announcements ("umumkan rendang siap").
Always confirm actions: "Oke, stok ayam ditambah 10 potong." If unclear, ask: "Maaf, bisa diulangi?"
Be concise, friendly, and efficient.
`;

// Prompt for the text model to generate supply predictions
export function createPredictionPrompt(historicalData) {
  return `
Predict optimal quantities for tomorrow based on this warteg sales data. Return JSON only:
{"ayam goreng": 25, "tempe orek": 40}

Historical Data:
${JSON.stringify(historicalData, null, 2)}
  `;
}

// Prompt for the text model to parse commands
export function createCommandParserPrompt(transcript) {
    return `
Parse this Bahasa Indonesia transcript into JSON with "action" and "payload" keys only:

Actions:
- UPDATE_STOCK: {"itemName": string, "quantity": number, "unit": string}
- RECORD_SALE: {"items": [{"itemName": string, "quantity": number}], "totalPrice"?: number}
- SOCIAL_POST: {"itemName": string, "status": "ready"|"sold_out"}
- UNKNOWN: {"originalTranscript": string}

Examples:
"tambah stok ayam 20 potong" → {"action": "UPDATE_STOCK", "payload": {"itemName": "ayam goreng", "quantity": 20, "unit": "potong"}}
"catat pesanan 2 nasi telur" → {"action": "RECORD_SALE", "payload": {"items": [{"itemName": "nasi telur", "quantity": 2}]}}
"rendang siap" → {"action": "SOCIAL_POST", "payload": {"itemName": "rendang", "status": "ready"}}

Transcript: "${transcript}"
    `;
}
