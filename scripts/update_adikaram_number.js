#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function usage() {
  console.log(
    'Usage: node scripts/update_adikaram_number.js --input <input.json> [--output <output.json>] [--groupSize N] [--field name]',
  );
  process.exit(1);
}

function parseArgs() {
  const argv = process.argv.slice(2);
  const out = { input: null, output: null, groupSize: 10, field: 'adikaram_number' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if ((a === '--input' || a === '-i') && argv[i + 1]) out.input = argv[++i];
    else if ((a === '--output' || a === '-o') && argv[i + 1]) out.output = argv[++i];
    else if (a === '--groupSize' && argv[i + 1]) out.groupSize = parseInt(argv[++i], 10);
    else if (a === '--field' && argv[i + 1]) out.field = argv[++i];
    else if (a === '--help' || a === '-h') usage();
  }
  if (!out.input) usage();
  if (!out.output) {
    const dir = path.dirname(out.input);
    const base = path.basename(out.input, path.extname(out.input));
    out.output = path.join(dir, base + '.with_adikaram.json');
  }
  if (!Number.isInteger(out.groupSize) || out.groupSize <= 0) out.groupSize = 10;
  return out;
}

function computeAdikaram(kurralId, groupSize) {
  // group Kurral_id by groupSize: 1..groupSize => 1, groupSize+1..2*groupSize => 2, etc.
  const k = Number(kurralId);
  if (!Number.isFinite(k) || isNaN(k)) return null;
  return Math.floor((k - 1) / groupSize) + 1;
}

function main() {
  const args = parseArgs();
  const text = fs.readFileSync(args.input, 'utf8');
  let arr;
  try {
    arr = JSON.parse(text);
  } catch (err) {
    console.error('Error parsing JSON from', args.input, err.message);
    process.exit(2);
  }
  if (!Array.isArray(arr)) {
    console.error('Input JSON is not an array. Expected array of objects.');
    process.exit(3);
  }

  const failures = [];
  const counts = new Map();
  let minK = Infinity,
    maxK = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    const kVal = obj['Kurral_id'] ?? obj['KurralId'] ?? obj['id'] ?? obj['kurral_id'];
    const ad = computeAdikaram(kVal, args.groupSize);
    if (ad === null) {
      failures.push({ index: i, item: obj });
      continue;
    }
    obj[args.field] = ad;
    counts.set(ad, (counts.get(ad) || 0) + 1);
    const k = Number(kVal);
    if (!isNaN(k)) {
      if (k < minK) minK = k;
      if (k > maxK) maxK = k;
    }
  }

  // write output
  fs.writeFileSync(args.output, JSON.stringify(arr, null, 2), 'utf8');

  console.log(`Wrote ${arr.length} objects to ${args.output}`);
  console.log(`Group size: ${args.groupSize}. Field: ${args.field}`);
  console.log(`Processed: ${arr.length - failures.length}. Failures: ${failures.length}`);
  console.log(`Kurral_id range in processed items: ${isFinite(minK) ? minK : '?'} - ${isFinite(maxK) ? maxK : '?'}
`);

  // print counts summary sorted by adikaram
  const sorted = Array.from(counts.entries()).sort((a, b) => a[0] - b[0]);
  console.log('Adikaram counts (adikaram_number: count)');
  for (const [ad, cnt] of sorted) {
    console.log(`${ad}: ${cnt}`);
  }

  if (failures.length > 0) {
    const rpt = args.output + '.failures.json';
    fs.writeFileSync(
      rpt,
      JSON.stringify(
        failures.map((f) => ({ index: f.index, Kurral_id: f.item && f.item.Kurral_id })),
        null,
        2,
      ),
      'utf8',
    );
    console.log(`Wrote failures report to ${rpt}`);
  }
}

main();
