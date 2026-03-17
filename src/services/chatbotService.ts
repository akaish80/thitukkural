import { KurralData, AdikaramData, PaalData, SearchResult, ChatbotService } from '../types';

const fs = require('fs');
const path = require('path');
let Fuse: any = null;
try {
  // use fuse.js for better fuzzy matching when available
  // require dynamically so unit tests or environments without the package don't crash
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  Fuse = require('fuse.js');
} catch (e) {
  Fuse = null;
}

interface NestedThirukkural {
  title: string;
  description: string;
  totalKurrals: number;
  totalAdikarams: number;
  totalPaals: number;
  paals: Array<{
    index: number;
    tamil: string;
    english: string;
    transliteration: string;
    adikaramRange: { start: number; end: number };
    adikarams: Array<{
      index: number;
      adikaramNumber: number;
      tamil: string;
      english: string;
      transliteration: string;
      kurralRange: { start: number; end: number };
      kurrals: Array<{
        kurralId: number;
        index: number;
        tamil: { full: string; line1: string; line2: string };
        english: { translation: string; meaning: string };
        transliteration: string;
        explanations?: any;
      }>;
    }>;
  }>;
}

function safeLoadJson(filePath: string): any {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(txt);
  } catch (err) {
    // return null so caller can try alternate paths
    return null;
  }
}

function loadNestedData(): NestedThirukkural | null {
  const nestedPath = path.join(__dirname, '..', 'Common', 'thirukkural_complete_nested.json');
  return safeLoadJson(nestedPath);
}

// Transform nested structure to flat arrays for backward compatibility
function extractPaalList(data: NestedThirukkural): PaalData[] {
  if (!data || !data.paals) return [];
  return data.paals.map((paal) => ({
    Index: paal.index,
    paal_number: paal.index,
    Paal_number: paal.index,
    Tamil: paal.tamil,
    English: paal.english,
    Transliteration: paal.transliteration,
    adikaramStart: paal.adikaramRange.start,
    adikaramEnd: paal.adikaramRange.end,
  }));
}

function extractAdikaramList(data: NestedThirukkural): AdikaramData[] {
  if (!data || !data.paals) return [];
  const adikarams: AdikaramData[] = [];
  data.paals.forEach((paal) => {
    paal.adikarams.forEach((adikaram) => {
      adikarams.push({
        Index: adikaram.index,
        adikaram_number: adikaram.adikaramNumber,
        Tamil: adikaram.tamil,
        English: adikaram.english,
        Transliteration: adikaram.transliteration,
        kurralStart: adikaram.kurralRange.start,
        kurralEnd: adikaram.kurralRange.end,
      });
    });
  });
  return adikarams;
}

function extractKurralList(data: NestedThirukkural): KurralData[] {
  if (!data || !data.paals) return [];
  const kurrals: KurralData[] = [];
  data.paals.forEach((paal) => {
    paal.adikarams.forEach((adikaram) => {
      adikaram.kurrals.forEach((kurral) => {
        kurrals.push({
          Kurral_id: kurral.kurralId,
          Index: kurral.index,
          adikaram_number: adikaram.adikaramNumber,
          Tamil: kurral.tamil.full,
          line1: kurral.tamil.line1,
          line2: kurral.tamil.line2,
          English: kurral.english.translation,
          EnglishMeaning: kurral.english.meaning,
          Transliteration: kurral.transliteration,
          KalaignarUrai: kurral.explanations?.kalaignar || '',
          MuVaUrai: kurral.explanations?.muVa || '',
          SolomonPaapaiyaUrai: kurral.explanations?.solomonPaapaiya || '',
        });
      });
    });
  });
  return kurrals;
}

function normalizeText(s: string): string {
  if (!s) return '';
  return String(s).toLowerCase();
}

function searchKurrals(kurrals: KurralData[], query: string, topN = 10): KurralData[] {
  if (!query) return [];
  const q = String(query).trim();

  // if fuse available, build or reuse index
  try {
    if (Fuse && Array.isArray(kurrals) && kurrals.length > 0) {
      const options = {
        keys: ['Tamil', 'English', 'Transliteration', 'EnglishMeaning', 'line1', 'line2'],
        threshold: 0.4,
        ignoreLocation: true,
        useExtendedSearch: true,
        includeScore: true,
      };
      const fuse = new Fuse(kurrals, options);
      const res = fuse.search(q, { limit: topN });
      return res.map((r: any) => r.item);
    }
  } catch (e: any) {
    // fallback to simple search below
    // eslint-disable-next-line no-console
    console.warn('Fuse search failed, falling back to simple search:', e.message);
  }

  // fallback simple substring scoring
  const qnorm = normalizeText(q);
  const parts = qnorm.split(/\s+/).filter(Boolean);

  const scored = kurrals.map((item: KurralData, idx: number) => {
    const t = [
      item.Tamil,
      item.English,
      item.Transliteration,
      item.EnglishMeaning,
      item.line1,
      item.line2,
    ]
      .filter(Boolean)
      .join(' | ')
      .toLowerCase();
    let score = 0;
    for (const p of parts) {
      if (t.includes(p)) score += 10;
      if (t.startsWith(p)) score += 5;
    }
    const kId = Number(item.Kurral_id || item.Index);
    if (!isNaN(kId) && q === String(kId)) score += 100;
    return { idx, score, item };
  });

  const filtered = scored
    .filter((s: any) => s.score > 0)
    .sort((a: any, b: any) => b.score - a.score || a.idx - b.idx);
  return filtered.slice(0, topN).map((s: any) => s.item);
}

function findByAdikaram(kurrals: KurralData[], adikaram: number | string): KurralData[] {
  const n = Number(adikaram);
  if (isNaN(n)) return [];
  return kurrals.filter((k: KurralData) => Number(k.adikaram_number) === n);
}

function findByPaal(paalList: PaalData[], paalNumber: number | string): PaalData | null {
  const n = Number(paalNumber);
  if (isNaN(n)) return null;
  return paalList.find((p: PaalData) => Number(p.paal_number || p.Paal_number) === n) || null;
}

module.exports = function buildService(): ChatbotService {
  const nestedData = loadNestedData();
  if (!nestedData) {
    throw new Error('Failed to load thirukkural_complete_nested.json');
  }

  const paalList: PaalData[] = extractPaalList(nestedData);
  const aikaram: AdikaramData[] = extractAdikaramList(nestedData);
  const kurrals: KurralData[] = extractKurralList(nestedData);

  return {
    paalList,
    aikaram,
    kurrals,
    search(query: string, topN = 10): SearchResult {
      // special parsing: if query mentions adikaram:NN or paal:NN or kurral:NN
      const q = String(query || '').trim();
      const mAd = q.match(/adikaram[:#\s]*(\d+)/i);
      if (mAd) return { adikaram: Number(mAd[1]), results: findByAdikaram(kurrals, mAd[1]) };
      const mP = q.match(/paal[:#\s]*(\d+)/i);
      if (mP) return { paal: Number(mP[1]), paalInfo: findByPaal(paalList, mP[1]), results: [] };
      const mK = q.match(/kurral[:#\s]*(\d+)/i) || q.match(/^(\d+)$/);
      if (mK)
        return {
          kurral: Number(mK[1]),
          results: kurrals.filter((k: KurralData) => Number(k.Kurral_id) === Number(mK[1])),
        };

      // fallback to fuzzy search across fields
      const results = searchKurrals(kurrals, q, topN);
      // also check if query contains words that match adikaram names
      const adMatch = aikaram.find(
        (a: AdikaramData) =>
          normalizeText(a.Tamil).includes(q) || normalizeText(a.English).includes(q),
      );
      return { results, adikaramInfo: adMatch || null };
    },

    getKurralById(id: number): KurralData | null {
      return kurrals.find((k: KurralData) => Number(k.Kurral_id) === Number(id)) || null;
    },

    getAdikaramInfo(n: number): AdikaramData | null {
      return aikaram.find((a: AdikaramData) => Number(a.adikaram_number) === Number(n)) || null;
    },
  };
};
