/**
 * متابعة دليل الوحدة 11
 *
 * المشروع:
 * https://script.google.com/u/0/home/projects/1ZxZfwGJTvBAwfflf-MoZwPMrl1njbFbY0jrMAJtzDn4-IYSsMgabOHqj/edit
 *
 * الجدول:
 * https://docs.google.com/spreadsheets/d/1q-P0dvSYe8bGMd8BuGklMGxM4K39kIqMnyjmdodaPlM/edit
 *
 * النشر: تطبيق ويب، التنفيذ: أنا، الوصول: أي شخص.
 * ثم الصقي رابط /exec في unit11/js/cloud.js
 */

var SHEET_ID = "1q-P0dvSYe8bGMd8BuGklMGxM4K39kIqMnyjmdodaPlM";
var TEACHER_KEY = "sanaa11";

var HEAD_RESULTS = [
  "معرّف الجهاز", "الاسم", "الشعبة", "النسبة",
  "المراحل المنجزة", "مجموع المراحل", "البنود المنجزة", "البنود المتبقية",
  "صفوف الجداول", "المرحلة الحالية", "ما أُنجز", "ما تبقّى",
  "دقائق العمل", "الجلسات", "النقرات", "مرات المسح",
  "أول ظهور", "آخر ظهور", "الحالة"
];

var HEAD_STAGES = [
  "معرّف الجهاز", "الاسم", "الشعبة", "المجموعة", "الرمز", "المرحلة",
  "البنود", "المنجز", "المتبقي", "الحالة", "دقائق", "نقرات"
];

var HEAD_POINTS = ["معرّف الجهاز", "الاسم", "الرمز", "المرحلة", "البند", "الحالة"];

var HEAD_LOG = ["معرّف الجهاز", "الاسم", "الشعبة", "الترتيب", "المرحلة", "الوقت"];

function doGet(e) {
  var view = e && e.parameter ? String(e.parameter.view || "") : "";
  if (view === "board") {
    if (!keyOk_(e)) return scriptOut_(e, { ok: false, error: "المفتاح غير صحيح" });
    return scriptOut_(e, { ok: true, rows: readBoard_() });
  }
  if (view === "clear") {
    if (!keyOk_(e)) return scriptOut_(e, { ok: false, error: "المفتاح غير صحيح" });
    if (String(e.parameter.confirm || "") !== "1") return scriptOut_(e, { ok: false, error: "التأكيد ناقص" });
    return scriptOut_(e, clearBoard_());
  }
  return ContentService.createTextOutput("متابعة الوحدة 11 — جاهز.");
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var data = readPayload_(e);
    if (String(data.kind || "") !== "u11") throw new Error("unknown kind");
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
  ensureBoard_(ss);
  var id = String(data.deviceId || "");
  var results = ensureSheet_(ss, "النتائج", HEAD_RESULTS);
  var doneNames = [];
  var leftNames = [];
  var stageRows = [];
  var pointRows = [];
  var stages = data.stages || [];
  for (var i = 0; i < stages.length; i++) {
    var stage = stages[i] || {};
    if (stage.read) continue;
    var left = num_(stage.pointsTotal) - num_(stage.pointsDone);
    var label = (stage.code || "") + " " + (stage.nav || "");
    if (stage.done) doneNames.push(label);
    else leftNames.push(label + " (" + left + ")");
    stageRows.push([
      id, data.name || "", data.klass || "", stage.group || "", stage.code || "", stage.nav || "",
      num_(stage.pointsTotal), num_(stage.pointsDone), left,
      stage.done ? "تم" : "متبقي",
      num_(stage.minutes), num_(stage.clicks)
    ]);
    var points = stage.points || [];
    for (var p = 0; p < points.length; p++) {
      var point = points[p] || {};
      pointRows.push([
        id, data.name || "", stage.code || "", stage.nav || "",
        String(point.title || "").slice(0, 120),
        point.done ? "تم" : "متبقي"
      ]);
    }
  }
  upsert_(results, id, [
    id,
    data.name || "",
    data.klass || "",
    num_(data.percent),
    num_(data.stagesDone),
    num_(data.stagesTotal),
    num_(data.pointsDone),
    num_(data.pointsLeft),
    num_(data.rowsDone),
    ((data.currentCode || "") + " " + (data.currentNav || "")).replace(/^\s+|\s+$/g, ""),
    doneNames.join("، "),
    leftNames.join("، "),
    num_(data.minutes),
    num_(data.sessions),
    num_(data.clicks),
    num_(data.resets),
    data.firstSeen || "",
    data.lastSeen || "",
    num_(data.percent) >= 100 ? "أنهى" : "يعمل"
  ], 1);
  replaceChild_(ensureSheet_(ss, "المراحل", HEAD_STAGES), id, stageRows);
  replaceChild_(ensureSheet_(ss, "البنود", HEAD_POINTS), id, pointRows);
  var log = data.log || [];
  if (log.length) {
    var logRows = [];
    var start = Math.max(0, log.length - 40);
    for (var n = start; n < log.length; n++) {
      var step = log[n] || {};
      logRows.push([id, data.name || "", data.klass || "", n + 1, step.nav || step.id || "", step.t || ""]);
    }
    replaceChild_(ensureSheet_(ss, "التنقل", HEAD_LOG), id, logRows);
  }
}

function ensureBoard_(ss) {
  var sh = ss.getSheetByName("اللوحة");
  if (!sh) sh = ss.insertSheet("اللوحة", 0);
  sh.setRightToLeft(true);
  if (sh.getLastRow() > 0) {
    if (String(sh.getRange(2, 1).getValue()) === "عدد الطالبات") sh.getRange(2, 1).setValue("عدد الطلاب");
    if (String(sh.getRange(4, 1).getValue()) === "أتممن الدليل") sh.getRange(4, 1).setValue("أتموا الدليل");
    return sh;
  }
  var labels = ["عدد الطلاب", "متوسط التقدم", "أتموا الدليل", "مجموع دقائق العمل", "مجموع النقرات"];
  var formulas = [
    "=COUNTA('النتائج'!B2:B)",
    "=IFERROR(ROUND(AVERAGE('النتائج'!D2:D),0),0)",
    "=COUNTIF('النتائج'!S2:S,\"أنهى\")",
    "=SUM('النتائج'!M2:M)",
    "=SUM('النتائج'!O2:O)"
  ];
  sh.getRange(1, 1, 1, 2).setValues([["المؤشر", "القيمة"]]).setFontWeight("bold");
  for (var i = 0; i < labels.length; i++) {
    sh.getRange(i + 2, 1).setValue(labels[i]);
    sh.getRange(i + 2, 2).setFormula(formulas[i]);
  }
  sh.setFrozenRows(1);
  return sh;
}

function clearBoard_() {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var ss = openSheet_();
    var names = ["النتائج", "المراحل", "البنود", "التنقل"];
    var removed = 0;
    for (var i = 0; i < names.length; i++) removed += clearRows_(ss.getSheetByName(names[i]));
    return { ok: true, removed: removed };
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function clearRows_(sh) {
  if (!sh) return 0;
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var count = last - 1;
  sh.deleteRows(2, count);
  return count;
}

function readBoard_() {
  var ss = openSheet_();
  var sh = ss.getSheetByName("النتائج");
  if (!sh || sh.getLastRow() < 2) return [];
  var stages = rowsById_(ss.getSheetByName("المراحل"));
  var points = rowsById_(ss.getSheetByName("البنود"));
  var values = sh.getDataRange().getValues();
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var line = values[i];
    var id = String(line[0] || "");
    if (!id) continue;
    var mine = stages[id] || [];
    var myPoints = points[id] || [];
    rows.push({
      id: id,
      deviceId: id,
      name: line[1],
      klass: line[2],
      percent: num_(line[3]),
      stagesDone: num_(line[4]),
      stagesTotal: num_(line[5]),
      pointsDone: num_(line[6]),
      pointsLeft: num_(line[7]),
      rowsDone: num_(line[8]),
      currentNav: line[9],
      currentCode: "",
      activeMs: num_(line[12]) * 60000,
      sessions: num_(line[13]),
      clicks: num_(line[14]),
      resets: num_(line[15]),
      firstSeen: line[16],
      lastSeen: line[17],
      status: line[18],
      stages: mine.map(function (stage) {
        return {
          read: false,
          group: stage[3],
          code: stage[4],
          nav: stage[5],
          pointsTotal: num_(stage[6]),
          pointsDone: num_(stage[7]),
          done: String(stage[9]) === "تم",
          points: myPoints.filter(function (point) {
            return String(point[2]) === String(stage[4]) && String(point[3]) === String(stage[5]);
          }).map(function (point) {
            return { title: point[4], done: String(point[5]) === "تم" };
          })
        };
      })
    });
  }
  return rows;
}

function rowsById_(sh) {
  var map = {};
  if (!sh || sh.getLastRow() < 2) return map;
  var values = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
  for (var i = 0; i < values.length; i++) {
    var id = String(values[i][0] || "");
    if (!id) continue;
    if (!map[id]) map[id] = [];
    map[id].push(values[i]);
  }
  return map;
}

function replaceChild_(sh, id, rows) {
  var last = sh.getLastRow();
  if (id && last >= 2) {
    var ids = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var i = ids.length - 1; i >= 0; i--) {
      if (String(ids[i][0]) === id) sh.deleteRow(i + 2);
    }
  }
  for (var r = 0; r < rows.length; r++) putRow_(sh, sh.getLastRow() + 1, rows[r]);
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
  sh.setRightToLeft(true);
  if (sh.getLastRow() < 1) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sh.setFrozenRows(1);
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
