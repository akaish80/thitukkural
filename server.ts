/* eslint-disable import/order */

import { fileURLToPath } from "node:url";
import path from "path";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import dotenv from "dotenv";
import Fuse from "fuse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables from .env file (local or production)
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: path.join(__dirname, envFile) });
// const compression = require("compression");

// const enforce = require('express-sslify');

// if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

let thirukkuralNestedData: any = null;

try {
  const nestedJsonName = "thirukkural_complete_nested.json";
  const candidates = [
    path.resolve(process.cwd(), "src", "Common", nestedJsonName),
    path.resolve(__dirname, "src", "Common", nestedJsonName),
    path.resolve(__dirname, "..", "src", "Common", nestedJsonName),
  ];

  let loadedPath: string | null = null;
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    const rawData = fs.readFileSync(candidate, "utf8");
    thirukkuralNestedData = JSON.parse(rawData);
    loadedPath = candidate;
    break;
  }

  if (!thirukkuralNestedData) {
    throw new Error(`File not found. Tried: ${candidates.join(" | ")}`);
  }

  const loadedPaals = Array.isArray(thirukkuralNestedData?.paals)
    ? thirukkuralNestedData.paals.length
    : 0;
  console.log(
    `Loaded thirukkural_complete_nested.json with ${loadedPaals} paals from ${loadedPath}`,
  );
} catch (e) {
  const message = e instanceof Error ? e.message : String(e);
  console.warn("Unable to load thirukkural_complete_nested.json:", message);
}

// Use a single port configuration
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



app.get("/api/paals", (_req: any, res: any) => {
  if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
    return res.status(500).json({ error: "thirukkural data not loaded" });
  }

  const paals = thirukkuralNestedData.paals.map((paal: any) => ({
    index: paal.index,
    tamil: paal.tamil,
    english: paal.english,
    transliteration: paal.transliteration,
    adikaramRange: paal.adikaramRange,
    adikaramCount: Array.isArray(paal.adikarams) ? paal.adikarams.length : 0,
  }));

  return res.json(paals);
});

app.get("/api/paals/:paalIndex/adikarams", (req: any, res: any) => {
  if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
    return res.status(500).json({ error: "thirukkural data not loaded" });
  }

  const paalIndex = Number(req.params.paalIndex);
  if (isNaN(paalIndex)) {
    return res.status(400).json({ error: "invalid paal index" });
  }

  const paal = thirukkuralNestedData.paals.find(
    (item: any) => Number(item.index) === paalIndex,
  );
  if (!paal) {
    return res.status(404).json({ error: "paal not found" });
  }

  const adikarams = Array.isArray(paal.adikarams)
    ? paal.adikarams.map((adikaram: any) => ({
        index: adikaram.index,
        adikaramNumber: adikaram.adikaramNumber,
        tamil: adikaram.tamil,
        english: adikaram.english,
        transliteration: adikaram.transliteration,
        kurralRange: adikaram.kurralRange,
        kurralCount: Array.isArray(adikaram.kurrals)
          ? adikaram.kurrals.length
          : 0,
      }))
    : [];

  return res.json({
    paal: { index: paal.index, tamil: paal.tamil, english: paal.english },
    adikarams,
  });
});

app.get(
  "/api/paals/:paalIndex/adikarams/:adikaramNumber/kurrals",
  (req: any, res: any) => {
    if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
      return res.status(500).json({ error: "thirukkural data not loaded" });
    }

    const paalIndex = Number(req.params.paalIndex);
    const adikaramNumber = Number(req.params.adikaramNumber);

    if (isNaN(paalIndex) || isNaN(adikaramNumber)) {
      return res
        .status(400)
        .json({ error: "invalid paal index or adikaram number" });
    }

    const paal = thirukkuralNestedData.paals.find(
      (item: any) => Number(item.index) === paalIndex,
    );
    if (!paal) {
      return res.status(404).json({ error: "paal not found" });
    }

    const adikaram = Array.isArray(paal.adikarams)
      ? paal.adikarams.find(
          (item: any) => Number(item.adikaramNumber) === adikaramNumber,
        )
      : null;

    if (!adikaram) {
      return res
        .status(404)
        .json({ error: "adikaram not found for selected paal" });
    }

    return res.json({
      paal: { index: paal.index, tamil: paal.tamil, english: paal.english },
      adikaram: {
        index: adikaram.index,
        adikaramNumber: adikaram.adikaramNumber,
        tamil: adikaram.tamil,
        english: adikaram.english,
        transliteration: adikaram.transliteration,
        kurralRange: adikaram.kurralRange,
      },
      kurrals: Array.isArray(adikaram.kurrals) ? adikaram.kurrals : [],
    });
  },
);

app.get("/api/thirukkural", (req: any, res: any) => {
  if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
    return res.status(500).json({ error: "thirukkural data not loaded" });
  }

  const paalIndexRaw = req.query.paalIndex;
  const adikaramNumberRaw = req.query.adikaramNumber;

  if (paalIndexRaw === undefined) {
    const paals = thirukkuralNestedData.paals.map((paal: any) => ({
      index: paal.index,
      tamil: paal.tamil,
      english: paal.english,
      transliteration: paal.transliteration,
      adikaramRange: paal.adikaramRange,
      adikaramCount: Array.isArray(paal.adikarams) ? paal.adikarams.length : 0,
    }));

    return res.json({ level: "paals", data: paals });
  }

  const paalIndex = Number(paalIndexRaw);
  if (isNaN(paalIndex)) {
    return res.status(400).json({ error: "invalid paalIndex query param" });
  }

  const paal = thirukkuralNestedData.paals.find(
    (item: any) => Number(item.index) === paalIndex,
  );
  if (!paal) {
    return res.status(404).json({ error: "paal not found" });
  }

  if (adikaramNumberRaw === undefined) {
    const adikarams = Array.isArray(paal.adikarams)
      ? paal.adikarams.map((adikaram: any) => ({
          index: adikaram.index,
          adikaramNumber: adikaram.adikaramNumber,
          tamil: adikaram.tamil,
          english: adikaram.english,
          transliteration: adikaram.transliteration,
          kurralRange: adikaram.kurralRange,
          kurralCount: Array.isArray(adikaram.kurrals)
            ? adikaram.kurrals.length
            : 0,
        }))
      : [];

    return res.json({
      level: "adikarams",
      paal: { index: paal.index, tamil: paal.tamil, english: paal.english },
      data: adikarams,
    });
  }

  const adikaramNumber = Number(adikaramNumberRaw);
  if (isNaN(adikaramNumber)) {
    return res
      .status(400)
      .json({ error: "invalid adikaramNumber query param" });
  }

  const adikaram = Array.isArray(paal.adikarams)
    ? paal.adikarams.find(
        (item: any) => Number(item.adikaramNumber) === adikaramNumber,
      )
    : null;

  if (!adikaram) {
    return res
      .status(404)
      .json({ error: "adikaram not found for selected paal" });
  }

  return res.json({
    level: "kurrals",
    paal: { index: paal.index, tamil: paal.tamil, english: paal.english },
    adikaram: {
      index: adikaram.index,
      adikaramNumber: adikaram.adikaramNumber,
      tamil: adikaram.tamil,
      english: adikaram.english,
      transliteration: adikaram.transliteration,
      kurralRange: adikaram.kurralRange,
    },
    data: Array.isArray(adikaram.kurrals) ? adikaram.kurrals : [],
  });
});

app.get("/api/kurrals", (_req: any, res: any) => {
  if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
    return res.status(500).json({ error: "thirukkural data not loaded" });
  }

  const flattened = thirukkuralNestedData.paals.flatMap((paal: any) =>
    (Array.isArray(paal.adikarams) ? paal.adikarams : []).flatMap(
      (adikaram: any) =>
        (Array.isArray(adikaram.kurrals) ? adikaram.kurrals : []).map(
          (kurral: any) => ({
            Kurral_id: kurral.kurralId,
            Index: kurral.kurralId,
            Tamil: kurral.tamil?.full || "",
            line1: kurral.tamil?.line1 || "",
            line2: kurral.tamil?.line2 || "",
            MuVaUrai: kurral.explanations?.muVa || "",
            SolomonPaapaiyaUrai: kurral.explanations?.solomonPaapaiya || "",
            KalaignarUrai: kurral.explanations?.kalaignar || "",
            paalIndex: paal.index,
            paalTamil: paal.tamil,
            adikaramNumber: adikaram.adikaramNumber,
            adikaramTamil: adikaram.tamil,
          }),
        ),
    ),
  );

  return res.json(flattened);
});

app.get("/api/getPaalsAndAdikarams", (_req: any, res: any) => {
  if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
    return res.status(500).json({ error: "thirukkural data not loaded" });
  }

  const flattened = { paals: [], adikarams: [] };
  flattened.paals = thirukkuralNestedData.paals.map((paal: any) => ({
    Index: paal.index,
    Tamil: paal.tamil,
    English: paal.english,
    Transliteration: paal.transliteration,
    adikaramStart: paal.adikaramRange.start,
    adikaramEnd: paal.adikaramRange.end,
    adikaram: paal.adikarams.map((a: any) => a.tamil),
    count: 0,
  }));
  flattened.adikarams = thirukkuralNestedData.paals.flatMap((paal: any) =>
    paal.adikarams.map((a: any) => ({
      Index: a.index,
      Tamil: a.tamil,
      English: a.english,
      Transliteration: a.transliteration,
      kurralStart: a.kurralRange.start,
      kurralEnd: a.kurralRange.end,
    })),
  );

  
  return res.json(flattened);
});

/* ── Flatten nested data into lookup arrays (inline, no external import) ── */

interface FlatKurral {
  Kurral_id: number;
  Index: number;
  adikaram_number: number;
  Tamil: string;
  line1: string;
  line2: string;
  English: string;
  EnglishMeaning: string;
  Transliteration: string;
  KalaignarUrai: string;
  MuVaUrai: string;
  SolomonPaapaiyaUrai: string;
}

interface FlatAdikaram {
  Index: number;
  adikaram_number: number;
  Tamil: string;
  English: string;
  Transliteration: string;
  kurralStart: number;
  kurralEnd: number;
}

const flatKurrals: FlatKurral[] = [];
const flatAdikarams: FlatAdikaram[] = [];

if (thirukkuralNestedData?.paals) {
  for (const paal of thirukkuralNestedData.paals) {
    for (const adikaram of paal.adikarams || []) {
      flatAdikarams.push({
        Index: adikaram.index,
        adikaram_number: adikaram.adikaramNumber,
        Tamil: adikaram.tamil,
        English: adikaram.english,
        Transliteration: adikaram.transliteration,
        kurralStart: adikaram.kurralRange?.start,
        kurralEnd: adikaram.kurralRange?.end,
      });
      for (const kurral of adikaram.kurrals || []) {
        flatKurrals.push({
          Kurral_id: kurral.kurralId,
          Index: kurral.index,
          adikaram_number: adikaram.adikaramNumber,
          Tamil: kurral.tamil?.full || "",
          line1: kurral.tamil?.line1 || "",
          line2: kurral.tamil?.line2 || "",
          English: kurral.english?.translation || "",
          EnglishMeaning: kurral.english?.meaning || "",
          Transliteration: kurral.transliteration || "",
          KalaignarUrai: kurral.explanations?.kalaignar || "",
          MuVaUrai: kurral.explanations?.muVa || "",
          SolomonPaapaiyaUrai: kurral.explanations?.solomonPaapaiya || "",
        });
      }
    }
  }
}

// Build Fuse.js search index
let fuseIndex: Fuse<FlatKurral> | null = null;
try {
  if (flatKurrals.length > 0) {
    fuseIndex = new Fuse(flatKurrals, {
      keys: ["Tamil", "English", "Transliteration", "EnglishMeaning", "line1", "line2"],
      threshold: 0.4,
      ignoreLocation: true,
      useExtendedSearch: true,
      includeScore: true,
    });
  }
} catch (e) {
  console.warn("Fuse index creation failed:", e instanceof Error ? e.message : e);
}

console.log(`Indexed ${flatKurrals.length} kurrals, ${flatAdikarams.length} adikarams`);

/* ── API routes: kurral, adikaram, health, chat ── */

app.get("/api/kurral/:id", (req: any, res: any) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
  const k = flatKurrals.find((k) => k.Kurral_id === id);
  if (!k) return res.status(404).json({ error: "not found" });
  return res.json(k);
});

app.get("/api/adikaram/:num", (req: any, res: any) => {
  const n = Number(req.params.num);
  if (isNaN(n)) return res.status(400).json({ error: "invalid number" });
  const a = flatAdikarams.find((a) => a.adikaram_number === n);
  if (!a) return res.status(404).json({ error: "not found" });
  const kurrals = flatKurrals.filter((k) => k.adikaram_number === n);
  return res.json({ adikaram: a, kurrals });
});

app.get("/api/health", (_req: any, res: any) =>
  res.json({ ok: true, kurrals: flatKurrals.length }),
);

app.post("/api/chat", (req: any, res: any) => {
  const { query, topN } = req.body || {};
  if (!query || typeof query !== "string")
    return res.status(400).json({ error: "query (string) required" });

  const q = query.trim();
  const limit = topN || 10;
  let result: any;

  // Special patterns: adikaram:N, kurral:N, or bare number
  const mAd = q.match(/adikaram[:#\s]*(\d+)/i);
  const mK = q.match(/kurral[:#\s]*(\d+)/i) || q.match(/^(\d+)$/);

  if (mAd) {
    result = { adikaram: Number(mAd[1]), results: flatKurrals.filter((k) => k.adikaram_number === Number(mAd[1])) };
  } else if (mK) {
    result = { kurral: Number(mK[1]), results: flatKurrals.filter((k) => k.Kurral_id === Number(mK[1])) };
  } else if (fuseIndex) {
    const hits = fuseIndex.search(q, { limit });
    result = { results: hits.map((h: any) => h.item) };
  } else {
    // Simple fallback search
    const qLow = q.toLowerCase();
    const matches = flatKurrals.filter((k) =>
      [k.Tamil, k.English, k.Transliteration, k.EnglishMeaning, k.line1, k.line2]
        .join(" ").toLowerCase().includes(qLow),
    ).slice(0, limit);
    result = { results: matches };
  }

  // Audit log
  try {
    const logLine = JSON.stringify({
      ts: Date.now(),
      ip: req.ip || req.connection?.remoteAddress,
      query,
      topN: limit,
      resultCount: Array.isArray(result?.results) ? result.results.length : 0,
    });
    fs.appendFile(path.join(__dirname, "chat_queries.log"), logLine + "\n", () => {});
  } catch (_e) { /* ignore */ }

  res.json({ query, result });
});

// Serve static build in production (skip on Vercel — it handles static files via CDN)
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, "build")));

  // serve service worker if present
  app.get("/service-worker.js", (_req: any, res: any) => {
    const swPath = path.join(__dirname, "build", "service-worker.js");
    if (fs.existsSync(swPath)) return res.sendFile(swPath);
    return res.status(404).end();
  });

  // all other routes serve the React app
  app.get("*", (_req: any, res: any) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
} else {
  // in dev, a root endpoint is useful
  app.get("/", (_req: any, res: any) => res.send("App is running"));
}


// Only listen if running as a standalone server (not in Vercel serverless)
if (process.env.VERCEL === undefined) {
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT} (env=${process.env.NODE_ENV})`);
  });
}

// Export the app for Vercel serverless
export default app;

// app.post('/Commone', (req, res) => {
//   const body = {
//     source: req.body.token.id,
//     amount: req.body.amount,
//     currency: 'usd',
//   };

//   stripe.charges.create(body, (stripeErr, stripeRes) => {
//     if (stripeErr) {
//       res.status(500).send({ error: stripeErr });
//     } else {
//       res.status(200).send({ success: stripeRes });
//     }
//   });
// });
