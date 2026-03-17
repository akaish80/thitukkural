/* eslint-disable import/order */

import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const path = require("path");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const dotenv = require("dotenv");
// Load environment variables from .env file (local or production)
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: path.join(__dirname, envFile) });
// const compression = require("compression");

// const enforce = require('express-sslify');

// if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

let thirukkuralNestedData: any = null;

try {
  const nestedJsonPath = path.join(
    __dirname,
    "src",
    "Common",
    "thirukkural_complete_nested.json",
  );
  const rawData = fs.readFileSync(nestedJsonPath, "utf8");
  thirukkuralNestedData = JSON.parse(rawData);
  const loadedPaals = Array.isArray(thirukkuralNestedData?.paals)
    ? thirukkuralNestedData.paals.length
    : 0;
  console.log(
    `Loaded thirukkural_complete_nested.json with ${loadedPaals} paals`,
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

app.get("/api/getKurral", async (_req: any, res: any) => {
  const targetUrl = "https://api.mythirukurral.com/thirkurral/adikaram";
  const apiKey = "b2uz54VCfa5adH5YFDkmL73IWwJBEwUw4rk7TWGp";

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res
      .status(500)
      .json({ error: "Failed to fetch from target API", details: message });
  }
});

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

// console.log(`Arun -> ${process.env.NODE_ENV}`);

// Mount chatbot service API routes so the chat API runs on the same origin

try {
  const buildService = require("./src/services/chatbotService")();

  // Move all chatbot endpoints under /api for Vercel compatibility
  app.get("/api/health", (_req: any, res: any) =>
    res.json({ ok: true, kurrals: buildService.kurrals.length }),
  );

  app.get("/api/kurral/:id", (req: any, res: any) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    const k = buildService.getKurralById(id);
    if (!k) return res.status(404).json({ error: "not found" });
    res.json(k);
  });

  app.get("/api/adikaram/:num", (req: any, res: any) => {
    const n = Number(req.params.num);
    if (isNaN(n)) return res.status(400).json({ error: "invalid number" });
    const a = buildService.getAdikaramInfo(n);
    if (!a) return res.status(404).json({ error: "not found" });
    const kurrals = buildService.kurrals.filter(
      (k: { adikaram_number: number | string }) =>
        Number(k.adikaram_number) === n,
    );
    res.json({ adikaram: a, kurrals });
  });

  app.post("/api/chat", (req: any, res: any) => {
    const { query, topN } = req.body || {};
    if (!query || typeof query !== "string")
      return res.status(400).json({ error: "query (string) required" });
    const result = buildService.search(query, topN || 10);
    // append a small server-side log for auditing (timestamp, ip, query, result count)
    try {
      const logLine = JSON.stringify({
        ts: Date.now(),
        ip: req.ip || req.connection?.remoteAddress,
        query,
        topN: topN || 10,
        resultCount:
          result && result.results && result.results.length
            ? result.results.length
            : Array.isArray(result)
              ? result.length
              : result && result.kurral
                ? 1
                : 0,
      });
      const logPath = path.join(__dirname, "chat_queries.log");
      fs.appendFile(
        logPath,
        `${logLine}\n`,
        (err: NodeJS.ErrnoException | null) => {
          if (err) console.warn("Failed to append chat log:", err.message);
        },
      );
    } catch (e) {
      // ignore logging errors
    }
    res.json({ query, result });
  });
} catch (e) {
  const message = e instanceof Error ? e.message : String(e);
  console.warn("chatbotService not available:", message);
}

// Serve static build in production from the project's build/ folder
if (process.env.NODE_ENV === "production") {
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
