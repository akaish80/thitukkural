import { fileURLToPath } from "node:url";
import fs from "fs";
import path from "path";
import Fuse from "fuse.js";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function safeLoadJson(filePath) {
    try {
        var txt = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(txt);
    }
    catch (err) {
        // return null so caller can try alternate paths
        return null;
    }
}
function loadNestedData() {
    var candidates = [
        path.join(__dirname, '..', 'Common', 'thirukkural_complete_nested.json'),
        path.resolve(__dirname, '..', '..', '..', 'src', 'Common', 'thirukkural_complete_nested.json'),
        path.resolve(process.cwd(), 'src', 'Common', 'thirukkural_complete_nested.json'),
    ];
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var nestedPath = candidates_1[_i];
        var data = safeLoadJson(nestedPath);
        if (data)
            return data;
    }
    return null;
}
// Transform nested structure to flat arrays for backward compatibility
function extractPaalList(data) {
    if (!data || !data.paals)
        return [];
    return data.paals.map(function (paal) { return ({
        Index: paal.index,
        paal_number: paal.index,
        Paal_number: paal.index,
        Tamil: paal.tamil,
        English: paal.english,
        Transliteration: paal.transliteration,
        adikaramStart: paal.adikaramRange.start,
        adikaramEnd: paal.adikaramRange.end,
    }); });
}
function extractAdikaramList(data) {
    if (!data || !data.paals)
        return [];
    var adikarams = [];
    data.paals.forEach(function (paal) {
        paal.adikarams.forEach(function (adikaram) {
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
function extractKurralList(data) {
    if (!data || !data.paals)
        return [];
    var kurrals = [];
    data.paals.forEach(function (paal) {
        paal.adikarams.forEach(function (adikaram) {
            adikaram.kurrals.forEach(function (kurral) {
                var _a, _b, _c;
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
                    KalaignarUrai: ((_a = kurral.explanations) === null || _a === void 0 ? void 0 : _a.kalaignar) || '',
                    MuVaUrai: ((_b = kurral.explanations) === null || _b === void 0 ? void 0 : _b.muVa) || '',
                    SolomonPaapaiyaUrai: ((_c = kurral.explanations) === null || _c === void 0 ? void 0 : _c.solomonPaapaiya) || '',
                });
            });
        });
    });
    return kurrals;
}
function normalizeText(s) {
    if (!s)
        return '';
    return String(s).toLowerCase();
}
function searchKurrals(kurrals, query, topN) {
    if (topN === void 0) { topN = 10; }
    if (!query)
        return [];
    var q = String(query).trim();
    // if fuse available, build or reuse index
    try {
        if (Fuse && Array.isArray(kurrals) && kurrals.length > 0) {
            var options = {
                keys: ['Tamil', 'English', 'Transliteration', 'EnglishMeaning', 'line1', 'line2'],
                threshold: 0.4,
                ignoreLocation: true,
                useExtendedSearch: true,
                includeScore: true,
            };
            var fuse = new Fuse(kurrals, options);
            var res = fuse.search(q, { limit: topN });
            return res.map(function (r) { return r.item; });
        }
    }
    catch (e) {
        // fallback to simple search below
        // eslint-disable-next-line no-console
        console.warn('Fuse search failed, falling back to simple search:', e.message);
    }
    // fallback simple substring scoring
    var qnorm = normalizeText(q);
    var parts = qnorm.split(/\s+/).filter(Boolean);
    var scored = kurrals.map(function (item, idx) {
        var t = [
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
        var score = 0;
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var p = parts_1[_i];
            if (t.includes(p))
                score += 10;
            if (t.startsWith(p))
                score += 5;
        }
        var kId = Number(item.Kurral_id || item.Index);
        if (!isNaN(kId) && q === String(kId))
            score += 100;
        return { idx: idx, score: score, item: item };
    });
    var filtered = scored
        .filter(function (s) { return s.score > 0; })
        .sort(function (a, b) { return b.score - a.score || a.idx - b.idx; });
    return filtered.slice(0, topN).map(function (s) { return s.item; });
}
function findByAdikaram(kurrals, adikaram) {
    var n = Number(adikaram);
    if (isNaN(n))
        return [];
    return kurrals.filter(function (k) { return Number(k.adikaram_number) === n; });
}
function findByPaal(paalList, paalNumber) {
    var n = Number(paalNumber);
    if (isNaN(n))
        return null;
    return paalList.find(function (p) { return Number(p.paal_number || p.Paal_number) === n; }) || null;
}
export default function buildService(preloadedData) {
    var nestedData = preloadedData || loadNestedData();
    if (!nestedData) {
        throw new Error('Failed to load thirukkural_complete_nested.json');
    }
    var paalList = extractPaalList(nestedData);
    var aikaram = extractAdikaramList(nestedData);
    var kurrals = extractKurralList(nestedData);
    return {
        paalList: paalList,
        aikaram: aikaram,
        kurrals: kurrals,
        search: function (query, topN) {
            if (topN === void 0) { topN = 10; }
            // special parsing: if query mentions adikaram:NN or paal:NN or kurral:NN
            var q = String(query || '').trim();
            var mAd = q.match(/adikaram[:#\s]*(\d+)/i);
            if (mAd)
                return { adikaram: Number(mAd[1]), results: findByAdikaram(kurrals, mAd[1]) };
            var mP = q.match(/paal[:#\s]*(\d+)/i);
            if (mP)
                return { paal: Number(mP[1]), paalInfo: findByPaal(paalList, mP[1]), results: [] };
            var mK = q.match(/kurral[:#\s]*(\d+)/i) || q.match(/^(\d+)$/);
            if (mK)
                return {
                    kurral: Number(mK[1]),
                    results: kurrals.filter(function (k) { return Number(k.Kurral_id) === Number(mK[1]); }),
                };
            // fallback to fuzzy search across fields
            var results = searchKurrals(kurrals, q, topN);
            // also check if query contains words that match adikaram names
            var adMatch = aikaram.find(function (a) {
                return normalizeText(a.Tamil).includes(q) || normalizeText(a.English).includes(q);
            });
            return { results: results, adikaramInfo: adMatch || null };
        },
        getKurralById: function (id) {
            return kurrals.find(function (k) { return Number(k.Kurral_id) === Number(id); }) || null;
        },
        getAdikaramInfo: function (n) {
            return aikaram.find(function (a) { return Number(a.adikaram_number) === Number(n); }) || null;
        },
    };
}
;
