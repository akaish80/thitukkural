import { fileURLToPath } from "node:url";
import path from "path";
import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import Fuse from "fuse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: path.join(__dirname, envFile) });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* ────────────────────────────────────────────
   Load nested JSON data
   ──────────────────────────────────────────── */

let nestedData: any = null;

const jsonName = "thirukkural_complete_nested.json";
const jsonCandidates = [
  path.resolve(process.cwd(), "src", "Common", jsonName),
  path.resolve(__dirname, "src", "Common", jsonName),
  path.resolve(__dirname, "..", "src", "Common", jsonName),
];

for (const p of jsonCandidates) {
  try {
    if (fs.existsSync(p)) {
      nestedData = JSON.parse(fs.readFileSync(p, "utf8"));
      console.log(`Loaded ${jsonName} from ${p}`);
      break;
    }
  } catch {
    /* try next */
  }
}

if (!nestedData) {
  console.warn(`Could not load ${jsonName}. Tried: ${jsonCandidates.join(", ")}`);
}

/* ────────────────────────────────────────────
   Build flat lookup arrays from nested data
   ──────────────────────────────────────────── */

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

if (nestedData?.paals) {
  for (const paal of nestedData.paals) {
    for (const adikaram of paal.adikarams ?? []) {
      flatAdikarams.push({
        Index: adikaram.index,
        adikaram_number: adikaram.adikaramNumber,
        Tamil: adikaram.tamil,
        English: adikaram.english,
        Transliteration: adikaram.transliteration,
        kurralStart: adikaram.kurralRange?.start,
        kurralEnd: adikaram.kurralRange?.end,
      });
      for (const k of adikaram.kurrals ?? []) {
        flatKurrals.push({
          Kurral_id: k.kurralId,
          Index: k.index,
          adikaram_number: adikaram.adikaramNumber,
          Tamil: k.tamil?.full ?? "",
          line1: k.tamil?.line1 ?? "",
          line2: k.tamil?.line2 ?? "",
          English: k.english?.translation ?? "",
          EnglishMeaning: k.english?.meaning ?? "",
          Transliteration: k.transliteration ?? "",
          KalaignarUrai: k.explanations?.kalaignar ?? "",
          MuVaUrai: k.explanations?.muVa ?? "",
          SolomonPaapaiyaUrai: k.explanations?.solomonPaapaiya ?? "",
        });
      }
    }
  }
}

/* ────────────────────────────────────────────
   Fuse.js search index
   ──────────────────────────────────────────── */

let fuseIndex: Fuse<FlatKurral> | null = null;
if (flatKurrals.length > 0) {
  try {
    fuseIndex = new Fuse(flatKurrals, {
      keys: ["Tamil", "English", "Transliteration", "EnglishMeaning", "line1", "line2"],
      threshold: 0.4,
      ignoreLocation: true,
      useExtendedSearch: true,
      includeScore: true,
    });
  } catch {
    /* search will fall back to substring matching */
  }
}

console.log(`Ready: ${flatKurrals.length} kurrals, ${flatAdikarams.length} adikarams`);

/* ────────────────────────────────────────────
   API Routes
   ──────────────────────────────────────────── */

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, kurrals: flatKurrals.length }),
);

app.get("/api/paals", (_req, res) => {
  if (!nestedData?.paals) return res.status(500).json({ error: "data not loaded" });
  const paals = nestedData.paals.map((p: any) => ({
    index: p.index,
    tamil: p.tamil,
    english: p.english,
    transliteration: p.transliteration,
    adikaramRange: p.adikaramRange,
    adikaramCount: p.adikarams?.length ?? 0,
  }));
  return res.json(paals);
});

app.get("/api/paals/:paalIndex/adikarams", (req, res) => {
  if (!nestedData?.paals) return res.status(500).json({ error: "data not loaded" });
  const paalIndex = Number(req.params.paalIndex);
  if (isNaN(paalIndex)) return res.status(400).json({ error: "invalid paal index" });
  const paal = nestedData.paals.find((p: any) => Number(p.index) === paalIndex);
  if (!paal) return res.status(404).json({ error: "paal not found" });

  const adikarams = (paal.adikarams ?? []).map((a: any) => ({
    index: a.index,
    adikaramNumber: a.adikaramNumber,
    tamil: a.tamil,
    english: a.english,
    transliteration: a.transliteration,
    kurralRange: a.kurralRange,
    kurralCount: a.kurrals?.length ?? 0,
  }));
  return res.json({
    paal: { index: paal.index, tamil: paal.tamil, english: paal.english },
    adikarams,
  });
});

app.get("/api/paals/:paalIndex/adikarams/:adikaramNumber/kurrals", (req, res) => {
  if (!nestedData?.paals) return res.status(500).json({ error: "data not loaded" });
  const paalIndex = Number(req.params.paalIndex);
  const adikaramNumber = Number(req.params.adikaramNumber);
  if (isNaN(paalIndex) || isNaN(adikaramNumber))
    return res.status(400).json({ error: "invalid paal index or adikaram number" });

  const paal = nestedData.paals.find((p: any) => Number(p.index) === paalIndex);
  if (!paal) return res.status(404).json({ error: "paal not found" });

  const adikaram = (paal.adikarams ?? []).find(
    (a: any) => Number(a.adikaramNumber) === adikaramNumber,
  );
  if (!adikaram) return res.status(404).json({ error: "adikaram not found" });

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
    kurrals: adikaram.kurrals ?? [],
  });
});

app.get("/api/thirukkural", (req, res) => {
  if (!nestedData?.paals) return res.status(500).json({ error: "data not loaded" });

  const { paalIndex: paalRaw, adikaramNumber: adRaw } = req.query;

  if (paalRaw === undefined) {
    const paals = nestedData.paals.map((p: any) => ({
      index: p.index,
      tamil: p.tamil,
      english: p.english,
      transliteration: p.transliteration,
      adikaramRange: p.adikaramRange,
      adikaramCount: p.adikarams?.length ?? 0,
    }));
    return res.json({ level: "paals", data: paals });
  }

  const paalIndex = Number(paalRaw);
  if (isNaN(paalIndex)) return res.status(400).json({ error: "invalid paalIndex" });
  const paal = nestedData.paals.find((p: any) => Number(p.index) === paalIndex);
  if (!paal) return res.status(404).json({ error: "paal not found" });

  if (adRaw === undefined) {
    const adikarams = (paal.adikarams ?? []).map((a: any) => ({
      index: a.index,
      adikaramNumber: a.adikaramNumber,
      tamil: a.tamil,
      english: a.english,
      transliteration: a.transliteration,
      kurralRange: a.kurralRange,
      kurralCount: a.kurrals?.length ?? 0,
    }));
    return res.json({
      level: "adikarams",
      paal: { index: paal.index, tamil: paal.tamil, english: paal.english },
      data: adikarams,
    });
  }

  const adikaramNumber = Number(adRaw);
  if (isNaN(adikaramNumber)) return res.status(400).json({ error: "invalid adikaramNumber" });
  const adikaram = (paal.adikarams ?? []).find(
    (a: any) => Number(a.adikaramNumber) === adikaramNumber,
  );
  if (!adikaram) return res.status(404).json({ error: "adikaram not found" });

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
    data: adikaram.kurrals ?? [],
  });
});

app.get("/api/kurrals", (_req, res) => res.json(flatKurrals));

app.get("/api/getPaalsAndAdikarams", (_req, res) => {
  if (!nestedData?.paals) return res.status(500).json({ error: "data not loaded" });

  const paals = nestedData.paals.map((p: any) => ({
    Index: p.index,
    Tamil: p.tamil,
    English: p.english,
    Transliteration: p.transliteration,
    adikaramStart: p.adikaramRange.start,
    adikaramEnd: p.adikaramRange.end,
    adikaram: p.adikarams.map((a: any) => a.tamil),
    count: 0,
  }));

  const adikarams = nestedData.paals.flatMap((p: any) =>
    p.adikarams.map((a: any) => ({
      Index: a.index,
      Tamil: a.tamil,
      English: a.english,
      Transliteration: a.transliteration,
      kurralStart: a.kurralRange.start,
      kurralEnd: a.kurralRange.end,
    })),
  );

  return res.json({ paals, adikarams });
});

app.get("/api/kurral/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
  const k = flatKurrals.find((item) => item.Kurral_id === id);
  if (!k) return res.status(404).json({ error: "not found" });
  return res.json(k);
});

app.get("/api/adikaram/:num", (req, res) => {
  const n = Number(req.params.num);
  if (isNaN(n)) return res.status(400).json({ error: "invalid number" });
  const a = flatAdikarams.find((item) => item.adikaram_number === n);
  if (!a) return res.status(404).json({ error: "not found" });
  const kurrals = flatKurrals.filter((item) => item.adikaram_number === n);
  return res.json({ adikaram: a, kurrals });
});

app.post("/api/chat", (req, res) => {
  const { query, topN } = req.body ?? {};
  if (!query || typeof query !== "string")
    return res.status(400).json({ error: "query (string) required" });

  const q = query.trim();
  const limit = topN || 10;
  let result: any;

  const mAd = q.match(/adikaram[:#\s]*(\d+)/i);
  const mK = q.match(/kurral[:#\s]*(\d+)/i) || q.match(/^(\d+)$/);

  if (mAd) {
    result = {
      adikaram: Number(mAd[1]),
      results: flatKurrals.filter((k) => k.adikaram_number === Number(mAd[1])),
    };
  } else if (mK) {
    result = {
      kurral: Number(mK[1]),
      results: flatKurrals.filter((k) => k.Kurral_id === Number(mK[1])),
    };
  } else if (fuseIndex) {
    result = { results: fuseIndex.search(q, { limit }).map((h: any) => h.item) };
  } else {
    const qLow = q.toLowerCase();
    result = {
      results: flatKurrals
        .filter((k) =>
          [k.Tamil, k.English, k.Transliteration, k.EnglishMeaning, k.line1, k.line2]
            .join(" ")
            .toLowerCase()
            .includes(qLow),
        )
        .slice(0, limit),
    };
  }

  return res.json({ query, result });
});

/* ────────────────────────────────────────────
   Start server (local only — Vercel uses export)
   ──────────────────────────────────────────── */

app.get("/", (_req, res) => res.send("Thirukkural API is running"));

const PORT = process.env.PORT || 5001;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
