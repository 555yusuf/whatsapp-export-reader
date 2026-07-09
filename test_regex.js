const fs = require('fs');
const fileContent = fs.readFileSync('uploads/WhatsApp Chat with +90 536 295 01 16.txt', 'utf8');
const lines = fileContent.split('\n');
const regex = /^\[?(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?(?:\s+[^\s\]]+)?)\]?\s*[-]?\s*([^:]+):\s*(.*)$/;

let matched = 0;
let unmatched = 0;
for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (regex.test(line)) {
        matched++;
    } else {
        unmatched++;
        if (unmatched < 10) console.log("UNMATCHED:", line);
    }
}
console.log("Matched:", matched, "Unmatched:", unmatched);
