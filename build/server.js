/* eslint-disable import/order */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { fileURLToPath } from "node:url";
import path from "path";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import dotenv from "dotenv";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
// Load environment variables from .env file (local or production)
var envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: path.join(__dirname, envFile) });
// const compression = require("compression");
// const enforce = require('express-sslify');
// if (process.env.NODE_ENV !== 'production') require('dotenv').config();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var app = express();
var thirukkuralNestedData = null;
try {
    // Always resolve from project root, works in build and dev
    var nestedJsonPath = path.resolve(__dirname, "../src/Common/thirukkural_complete_nested.json");
    var rawData = fs.readFileSync(nestedJsonPath, "utf8");
    thirukkuralNestedData = JSON.parse(rawData);
    var loadedPaals = Array.isArray(thirukkuralNestedData === null || thirukkuralNestedData === void 0 ? void 0 : thirukkuralNestedData.paals)
        ? thirukkuralNestedData.paals.length
        : 0;
    console.log("Loaded thirukkural_complete_nested.json with ".concat(loadedPaals, " paals"));
}
catch (e) {
    var message = e instanceof Error ? e.message : String(e);
    console.warn("Unable to load thirukkural_complete_nested.json:", message);
}
// Use a single port configuration
var PORT = process.env.PORT || 5001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.get("/api/paals", function (_req, res) {
    if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
        return res.status(500).json({ error: "thirukkural data not loaded" });
    }
    var paals = thirukkuralNestedData.paals.map(function (paal) { return ({
        index: paal.index,
        tamil: paal.tamil,
        english: paal.english,
        transliteration: paal.transliteration,
        adikaramRange: paal.adikaramRange,
        adikaramCount: Array.isArray(paal.adikarams) ? paal.adikarams.length : 0,
    }); });
    return res.json(paals);
});
app.get("/api/paals/:paalIndex/adikarams", function (req, res) {
    if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
        return res.status(500).json({ error: "thirukkural data not loaded" });
    }
    var paalIndex = Number(req.params.paalIndex);
    if (isNaN(paalIndex)) {
        return res.status(400).json({ error: "invalid paal index" });
    }
    var paal = thirukkuralNestedData.paals.find(function (item) { return Number(item.index) === paalIndex; });
    if (!paal) {
        return res.status(404).json({ error: "paal not found" });
    }
    var adikarams = Array.isArray(paal.adikarams)
        ? paal.adikarams.map(function (adikaram) { return ({
            index: adikaram.index,
            adikaramNumber: adikaram.adikaramNumber,
            tamil: adikaram.tamil,
            english: adikaram.english,
            transliteration: adikaram.transliteration,
            kurralRange: adikaram.kurralRange,
            kurralCount: Array.isArray(adikaram.kurrals)
                ? adikaram.kurrals.length
                : 0,
        }); })
        : [];
    return res.json({
        paal: { index: paal.index, tamil: paal.tamil, english: paal.english },
        adikarams: adikarams,
    });
});
app.get("/api/paals/:paalIndex/adikarams/:adikaramNumber/kurrals", function (req, res) {
    if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
        return res.status(500).json({ error: "thirukkural data not loaded" });
    }
    var paalIndex = Number(req.params.paalIndex);
    var adikaramNumber = Number(req.params.adikaramNumber);
    if (isNaN(paalIndex) || isNaN(adikaramNumber)) {
        return res
            .status(400)
            .json({ error: "invalid paal index or adikaram number" });
    }
    var paal = thirukkuralNestedData.paals.find(function (item) { return Number(item.index) === paalIndex; });
    if (!paal) {
        return res.status(404).json({ error: "paal not found" });
    }
    var adikaram = Array.isArray(paal.adikarams)
        ? paal.adikarams.find(function (item) { return Number(item.adikaramNumber) === adikaramNumber; })
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
});
app.get("/api/thirukkural", function (req, res) {
    if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
        return res.status(500).json({ error: "thirukkural data not loaded" });
    }
    var paalIndexRaw = req.query.paalIndex;
    var adikaramNumberRaw = req.query.adikaramNumber;
    if (paalIndexRaw === undefined) {
        var paals = thirukkuralNestedData.paals.map(function (paal) { return ({
            index: paal.index,
            tamil: paal.tamil,
            english: paal.english,
            transliteration: paal.transliteration,
            adikaramRange: paal.adikaramRange,
            adikaramCount: Array.isArray(paal.adikarams) ? paal.adikarams.length : 0,
        }); });
        return res.json({ level: "paals", data: paals });
    }
    var paalIndex = Number(paalIndexRaw);
    if (isNaN(paalIndex)) {
        return res.status(400).json({ error: "invalid paalIndex query param" });
    }
    var paal = thirukkuralNestedData.paals.find(function (item) { return Number(item.index) === paalIndex; });
    if (!paal) {
        return res.status(404).json({ error: "paal not found" });
    }
    if (adikaramNumberRaw === undefined) {
        var adikarams = Array.isArray(paal.adikarams)
            ? paal.adikarams.map(function (adikaram) { return ({
                index: adikaram.index,
                adikaramNumber: adikaram.adikaramNumber,
                tamil: adikaram.tamil,
                english: adikaram.english,
                transliteration: adikaram.transliteration,
                kurralRange: adikaram.kurralRange,
                kurralCount: Array.isArray(adikaram.kurrals)
                    ? adikaram.kurrals.length
                    : 0,
            }); })
            : [];
        return res.json({
            level: "adikarams",
            paal: { index: paal.index, tamil: paal.tamil, english: paal.english },
            data: adikarams,
        });
    }
    var adikaramNumber = Number(adikaramNumberRaw);
    if (isNaN(adikaramNumber)) {
        return res
            .status(400)
            .json({ error: "invalid adikaramNumber query param" });
    }
    var adikaram = Array.isArray(paal.adikarams)
        ? paal.adikarams.find(function (item) { return Number(item.adikaramNumber) === adikaramNumber; })
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
app.get("/api/kurrals", function (_req, res) {
    if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
        return res.status(500).json({ error: "thirukkural data not loaded" });
    }
    var flattened = thirukkuralNestedData.paals.flatMap(function (paal) {
        return (Array.isArray(paal.adikarams) ? paal.adikarams : []).flatMap(function (adikaram) {
            return (Array.isArray(adikaram.kurrals) ? adikaram.kurrals : []).map(function (kurral) {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    Kurral_id: kurral.kurralId,
                    Index: kurral.kurralId,
                    Tamil: ((_a = kurral.tamil) === null || _a === void 0 ? void 0 : _a.full) || "",
                    line1: ((_b = kurral.tamil) === null || _b === void 0 ? void 0 : _b.line1) || "",
                    line2: ((_c = kurral.tamil) === null || _c === void 0 ? void 0 : _c.line2) || "",
                    MuVaUrai: ((_d = kurral.explanations) === null || _d === void 0 ? void 0 : _d.muVa) || "",
                    SolomonPaapaiyaUrai: ((_e = kurral.explanations) === null || _e === void 0 ? void 0 : _e.solomonPaapaiya) || "",
                    KalaignarUrai: ((_f = kurral.explanations) === null || _f === void 0 ? void 0 : _f.kalaignar) || "",
                    paalIndex: paal.index,
                    paalTamil: paal.tamil,
                    adikaramNumber: adikaram.adikaramNumber,
                    adikaramTamil: adikaram.tamil,
                });
            });
        });
    });
    return res.json(flattened);
});
app.get("/api/getPaalsAndAdikarams", function (_req, res) {
    if (!thirukkuralNestedData || !Array.isArray(thirukkuralNestedData.paals)) {
        return res.status(500).json({ error: "thirukkural data not loaded" });
    }
    var flattened = { paals: [], adikarams: [] };
    flattened.paals = thirukkuralNestedData.paals.map(function (paal) { return ({
        Index: paal.index,
        Tamil: paal.tamil,
        English: paal.english,
        Transliteration: paal.transliteration,
        adikaramStart: paal.adikaramRange.start,
        adikaramEnd: paal.adikaramRange.end,
        adikaram: paal.adikarams.map(function (a) { return a.tamil; }),
        count: 0,
    }); });
    flattened.adikarams = thirukkuralNestedData.paals.flatMap(function (paal) {
        return paal.adikarams.map(function (a) { return ({
            Index: a.index,
            Tamil: a.tamil,
            English: a.english,
            Transliteration: a.transliteration,
            kurralStart: a.kurralRange.start,
            kurralEnd: a.kurralRange.end,
        }); });
    });
    return res.json(flattened);
});
// console.log(`Arun -> ${process.env.NODE_ENV}`);
// Mount chatbot service API routes so the chat API runs on the same origin
// Dynamically import chatbotService for ES module compatibility (Vercel)
var buildService = null;
var chatbotReady = false;
function setupChatbotRoutes() {
    return __awaiter(this, void 0, void 0, function () {
        var chatbotModule, e_1, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, import("./src/services/chatbotService.js")];
                case 1:
                    chatbotModule = _a.sent();
                    buildService = chatbotModule.default(thirukkuralNestedData);
                    chatbotReady = true;
                    // Move all chatbot endpoints under /api for Vercel compatibility
                    app.get("/api/health", function (_req, res) {
                        return res.json({ ok: true, kurrals: buildService.kurrals.length });
                    });
                    app.get("/api/kurral/:id", function (req, res) {
                        var id = Number(req.params.id);
                        if (isNaN(id))
                            return res.status(400).json({ error: "invalid id" });
                        var k = buildService.getKurralById(id);
                        if (!k)
                            return res.status(404).json({ error: "not found" });
                        res.json(k);
                    });
                    app.get("/api/adikaram/:num", function (req, res) {
                        var n = Number(req.params.num);
                        if (isNaN(n))
                            return res.status(400).json({ error: "invalid number" });
                        var a = buildService.getAdikaramInfo(n);
                        if (!a)
                            return res.status(404).json({ error: "not found" });
                        var kurrals = buildService.kurrals.filter(function (k) {
                            return Number(k.adikaram_number) === n;
                        });
                        res.json({ adikaram: a, kurrals: kurrals });
                    });
                    app.post("/api/chat", function (req, res) {
                        var _a;
                        var _b = req.body || {}, query = _b.query, topN = _b.topN;
                        if (!query || typeof query !== "string")
                            return res.status(400).json({ error: "query (string) required" });
                        var result = buildService.search(query, topN || 10);
                        // append a small server-side log for auditing (timestamp, ip, query, result count)
                        try {
                            var logLine = JSON.stringify({
                                ts: Date.now(),
                                ip: req.ip || ((_a = req.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress),
                                query: query,
                                topN: topN || 10,
                                resultCount: result && result.results && result.results.length
                                    ? result.results.length
                                    : Array.isArray(result)
                                        ? result.length
                                        : result && result.kurral
                                            ? 1
                                            : 0,
                            });
                            var logPath = path.join(__dirname, "chat_queries.log");
                            fs.appendFile(logPath, "".concat(logLine, "\n"), function (err) {
                                if (err)
                                    console.warn("Failed to append chat log:", err.message);
                            });
                        }
                        catch (e) {
                            // ignore logging errors
                        }
                        res.json({ query: query, result: result });
                    });
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    message = e_1 instanceof Error ? e_1.message : String(e_1);
                    console.warn("chatbotService not available:", message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
setupChatbotRoutes();
// Serve static build in production from the project's build/ folder
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "build")));
    // serve service worker if present
    app.get("/service-worker.js", function (_req, res) {
        var swPath = path.join(__dirname, "build", "service-worker.js");
        if (fs.existsSync(swPath))
            return res.sendFile(swPath);
        return res.status(404).end();
    });
    // all other routes serve the React app
    app.get("*", function (_req, res) {
        res.sendFile(path.join(__dirname, "build", "index.html"));
    });
}
else {
    // in dev, a root endpoint is useful
    app.get("/", function (_req, res) { return res.send("App is running"); });
}
// Only listen if running as a standalone server (not in Vercel serverless)
if (process.env.VERCEL === undefined) {
    app.listen(PORT, function () {
        console.log("server running on port ".concat(PORT, " (env=").concat(process.env.NODE_ENV, ")"));
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
