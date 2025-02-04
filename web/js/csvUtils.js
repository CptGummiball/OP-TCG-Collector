// Helper function to parse CSV file
function parseCSV(csvData, callback) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const cards = lines.slice(1).map(line => {
    const values = line.split(',');
    const card = {};
    headers.forEach((header, index) => {
      card[header.trim()] = values[index].trim();
    });
    return card;
  });
  callback(cards);
}
