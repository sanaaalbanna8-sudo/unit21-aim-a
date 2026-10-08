/**
 * متابعة دليل الهدف أ — الوحدة 21
 *
 * 1. أنشئي جدول Google Sheets فارغ.
 * 2. الإضافات ← Apps Script، والصقي هذا الملف مكان Code.gs.
 * 3. من رابط الجدول انسخي المعرّف وضعيه في SHEET_ID.
 *    https://docs.google.com/spreadsheets/d/SHEET_ID/edit
 * 4. انشري: تطبيق ويب، التنفيذ: أنا، الوصول: أي شخص.
 * 5. الصقي رابط /exec في js/config.js عند sheetsUrl.
 *
 * لوحة المعلمة: teacher.html
 * مفتاح الدخول الافتراضي: sanaa21  (غيّري TEACHER_KEY إن أردت)
 */

var SHEET_ID = "1sQ5CtCJA9kFkLXDDqc_ZYJlkdH7kh-B6VadGgAl7wrE";
var TEACHER_KEY = "sanaa21";

function doGet(e) {
  var view = e && e.parameter ? String(e.parameter.view || "") : "";
  if (view === "board") {
    if (!keyOk_(e)) {
      return scriptOut_(e, { ok: false, error: "المفتاح غير صحيح" });
    }
    return scriptOut_(e, { ok: true, rows: readBoard_() });
  }
  return ContentService.createTextOutput("متابعة دليل الهدف أ — جاهز.");
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var data = readPayload_(e);
    if (String(data.kind || "") !== "u21-aim-a") throw new Error("unknown kind");
    writeStats_(openSheet_(), data);
    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function openSheet_() {
  if (SHEET_ID) return SpreadsheetApp.openById(SHEET_ID);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("اربطي السكربت بالجدول أو ضعي SHEET_ID");
  return ss;
}

function writeStats_(ss, data) {
  var head = [
    "معرّف الجلسة", "الاسم", "الشعبة",
    "مدة الاستخدام", "نشاط بالثواني",
    "المدة منذ البدء", "الكلي بالثواني",
    "عدد الضغطات",
    "القطاع الأول", "كتب القطاع الأول",
    "القطاع الثاني", "كتب القطاع الثاني",
    "القطاع الثالث", "كتب القطاع الثالث",
    "مراحل منجزة", "مجموع المراحل", "النسبة %",
    "المرحلة الحالية", "الحالة",
    "بداية الاستخدام", "آخر ظهور"
  ];
  var logHead = [
    "الاسم", "الشعبة", "الوقت", "الحدث", "المرحلة", "مراحل منجزة", "مجموع المراحل", "الضغطات", "مدة النشاط"
  ];
  var sheet = ensureSheet_(ss, "النتائج", head);
  var row = [
    data.sessionId || "",
    data.name || "",
    data.klass || "",
    data.activeText || "",
    num_(data.activeSeconds),
    data.wallText || "",
    num_(data.wallSeconds),
    num_(data.clicks),
    data.sector1 || "",
    data.sector1Wrote || "لا",
    data.sector2 || "",
    data.sector2Wrote || "لا",
    data.sector3 || "",
    data.sector3Wrote || "لا",
    num_(data.stagesDone),
    num_(data.stagesTotal),
    num_(data.percent),
    data.currentStage || "",
    data.status || "",
    data.startedAt || "",
    data.lastSeen || ""
  ];
  upsert_(sheet, String(data.sessionId || ""), row, 1);

  var eventName = String(data.event || "");
  if (eventName === "stage" || eventName === "done" || eventName === "start") {
    var log = ensureSheet_(ss, "السجل", logHead);
    putRow_(log, Math.max(log.getLastRow(), 1) + 1, [
      data.name || "",
      data.klass || "",
      data.lastSeen || "",
      eventName === "start" ? "بدأ" : eventName === "done" ? "أنهى الدليل" : "أنجز مرحلة",
      data.currentStage || "",
      num_(data.stagesDone),
      num_(data.stagesTotal),
      num_(data.clicks),
      data.activeText || ""
    ]);
  }
}

function readBoard_() {
  var ss = openSheet_();
  var sh = ss.getSheetByName("النتائج");
  if (!sh || sh.getLastRow() < 2) return [];
  var values = sh.getDataRange().getValues();
  var head = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var c = 0; c < head.length; c++) obj[String(head[c])] = values[i][c];
    rows.push(obj);
  }
  return rows;
}

function upsert_(sh, sessionId, row, col) {
  var last = sh.getLastRow();
  var target = last + 1;
  if (sessionId && last >= 2) {
    var ids = sh.getRange(2, col, last - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === sessionId) {
        target = i + 2;
        break;
      }
    }
  }
  putRow_(sh, target, row);
}

function putRow_(sh, rowIndex, row) {
  var text = row.map(function (cell) { return cell == null ? "" : String(cell); });
  var range = sh.getRange(rowIndex, 1, 1, text.length);
  range.setNumberFormat("@");
  range.setValues([text]);
}

function keyOk_(e) {
  var sent = e && e.parameter ? String(e.parameter.key || "") : "";
  return sent && sent === String(TEACHER_KEY);
}

function num_(v) {
  var n = Number(v);
  return isFinite(n) ? n : 0;
}

function ensureSheet_(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() < 1) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sh.setFrozenRows(1);
    sh.setRightToLeft(true);
  }
  return sh;
}

function scriptOut_(e, obj) {
  var body = JSON.stringify(obj);
  var cb = e && e.parameter ? String(e.parameter.callback || "") : "";
  if (cb && /^[A-Za-z0-9_]+$/.test(cb)) {
    return ContentService.createTextOutput(cb + "(" + body + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return jsonOut_(obj);
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function firstText_(v) {
  if (v == null) return "";
  if (Object.prototype.toString.call(v) === "[object Array]") v = v.length ? v[0] : "";
  return String(v);
}

function tryParseJson_(text) {
  if (!text) return null;
  try {
    var obj = JSON.parse(String(text).replace(/^\uFEFF/, "").trim());
    if (obj && typeof obj === "object") return obj;
  } catch (err) {}
  return null;
}

function tryParseForm_(text) {
  if (!text || text.indexOf("=") < 0) return null;
  var parts = String(text).split("&");
  for (var i = 0; i < parts.length; i++) {
    var eq = parts[i].indexOf("=");
    if (eq < 0) continue;
    var key = parts[i].slice(0, eq);
    var val = parts[i].slice(eq + 1);
    try { key = decodeURIComponent(key.replace(/\+/g, " ")); } catch (e1) {}
    if (key !== "payload" && key !== "data") continue;
    try { val = decodeURIComponent(val.replace(/\+/g, " ")); } catch (e2) {}
    var parsed = tryParseJson_(val);
    if (parsed) return parsed;
  }
  return null;
}

function readPayload_(e) {
  e = e || {};
  var p = e.parameter || {};
  var ps = e.parameters || {};
  var raw = e.postData && e.postData.contents ? String(e.postData.contents) : "";
  var candidates = [p.payload, p.data, ps.payload, ps.data, raw];
  for (var i = 0; i < candidates.length; i++) {
    var text = firstText_(candidates[i]);
    if (!text) continue;
    var asJson = tryParseJson_(text);
    if (asJson) return asJson;
    var asForm = tryParseForm_(text);
    if (asForm) return asForm;
  }
  throw new Error("empty body");
}
