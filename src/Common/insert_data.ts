const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const API_URL = 'https://nsrediab47.execute-api.us-east-1.amazonaws.com/prod/insert-kurral';
const API_KEY = process.env.API_KEY || process.env.X_API_KEY || ''; // set before running

async function loadAikaram() {
  const file = path.join(__dirname, '..', 'Common', 'aikaram.json');
  const content = await fs.readFile(file, 'utf8');
  return JSON.parse(content);
}

async function postItem(item: any) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['x-api-key'] = API_KEY;

  const resp = await axios.post(API_URL, item, { headers, timeout: 20000 });
  return resp.data;
}

async function run() {
  try {
    const list = await loadAikaram();
    console.log(`Loaded ${list.length} items. Starting upload...`);
    let paal_index = 1;

    for (let i = 0; i < list.length; i++) {
      if (list[i].adikaram_number === 39) paal_index = 2;
      else if (list[i].adikaram_number === 109) paal_index = 3;
      const item = {
        table: 'adikaram_master',
        data: { ...list[i], paal_number: paal_index },
      };
      // write item JSON to a local file (append) for audit / dry-run instead of console.log
      try {
        const outFile = path.join(__dirname, '..', 'Common', 'insert_items.log');
        await fs.appendFile(outFile, JSON.stringify(item) + '\n', 'utf8');
      } catch (e) {
        // fallback to console if file write fails
        console.log(JSON.stringify(item));
      }
      try {
        const result = await postItem(item);
        console.log(
          `${i + 1}/${list.length} inserted: kurral_id=${item.data.kurral_id}`,
          result && result.message ? `=> ${result.message}` : '',
        );
      } catch (err: any) {
        console.error(
          `${i + 1}/${list.length} FAILED: kurral_id=${item.data.kurral_id}`,
          err.response?.data || err.message,
        );
        // continue with next item
      }
      // small delay to avoid bursting the endpoint
      await new Promise((r) => setTimeout(r, 150));
    }

    console.log('Upload finished.');
  } catch (err: any) {
    console.error('Fatal error:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) run();
