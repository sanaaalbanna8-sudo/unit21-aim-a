(function () {
  var KEY = "u21-aim-a-teacher-key";
  var PASS = "sanaa21";
  var form = document.getElementById("lock-form");
  var keyInput = document.getElementById("teacher-key");
  var lockHint = document.getElementById("lock-hint");
  var setup = document.getElementById("setup");
  var board = document.getElementById("board");
  var rowsEl = document.getElementById("rows");
  var search = document.getElementById("search");
  var statusEl = document.getElementById("status");
  var cards = {
    students: document.getElementById("c-students"),
    active: document.getElementById("c-active"),
    clicks: document.getElementById("c-clicks"),
    done: document.getElementById("c-done"),
    working: document.getElementById("c-working")
  };
  var cache = [];

  function url() {
    return String((window.AIM_A_CLOUD || {}).sheetsUrl || "").trim();
  }

  function num(value) {
    var n = Number(value);
    return isFinite(n) ? n : 0;
  }

  function showLock(message) {
    form.hidden = false;
    board.hidden = true;
    if (message) lockHint.textContent = message;
  }

  function paint(rows) {
    var q = search.value.trim();
    var list = rows.filter(function (row) {
      if (!q) return true;
      return String(row["الاسم"] || "").indexOf(q) !== -1 || String(row["الشعبة"] || "").indexOf(q) !== -1;
    });
    var clicks = 0;
    var active = 0;
    var done = 0;
    rows.forEach(function (row) {
      clicks += num(row["عدد الضغطات"]);
      active += num(row["نشاط بالثواني"]);
      if (String(row["الحالة"] || "") === "أنهى") done += 1;
    });
    var count = rows.length || 1;
    cards.students.textContent = String(rows.length);
    cards.active.textContent = format(rows.length ? active / rows.length : 0);
    cards.clicks.textContent = String(rows.length ? Math.round(clicks / rows.length) : 0);
    cards.done.textContent = String(done);
    cards.working.textContent = String(Math.max(0, rows.length - done));
    var cols = [
      "الاسم", "الشعبة", "المرحلة الحالية", "مدة الاستخدام", "عدد الضغطات",
      "القطاع الأول", "كتب القطاع الأول",
      "القطاع الثاني", "كتب القطاع الثاني",
      "القطاع الثالث", "كتب القطاع الثالث",
      "مراحل منجزة", "مجموع المراحل", "النسبة %", "الحالة", "آخر ظهور"
    ];
    rowsEl.innerHTML = "";
    list.forEach(function (row) {
      var tr = document.createElement("tr");
      cols.forEach(function (key) {
        var td = document.createElement("td");
        var value = row[key];
        if (key === "مدة الاستخدام" && (value == null || value === "")) value = row["مدة النشاط"];
        var text = value == null ? "" : String(value);
        td.textContent = text;
        if (text === "نعم") td.className = "yes";
        if (text === "لا") td.className = "no";
        tr.appendChild(td);
      });
      rowsEl.appendChild(tr);
    });
    statusEl.textContent = "آخر تحديث: " + new Date().toLocaleTimeString("ar") + " · " + rows.length + " سجل";
  }

  function format(totalSeconds) {
    var s = Math.max(0, Math.round(totalSeconds));
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var r = s % 60;
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    if (h > 0) return h + ":" + pad(m) + ":" + pad(r);
    return m + ":" + pad(r);
  }

  function load(key) {
    var base = url();
    if (!base) {
      setup.hidden = false;
      showLock("");
      return;
    }
    setup.hidden = true;
    var cb = "aimABoard_" + Date.now();
    window[cb] = function (data) {
      delete window[cb];
      if (!data || !data.ok) {
        showLock(data && data.error ? data.error : "تعذّر قراءة التطبيق");
        return;
      }
      sessionStorage.setItem(KEY, key);
      form.hidden = true;
      board.hidden = false;
      cache = data.rows || [];
      paint(cache);
    };
    var script = document.createElement("script");
    var join = base.indexOf("?") === -1 ? "?" : "&";
    script.src = base + join + "view=board&key=" + encodeURIComponent(key) + "&callback=" + cb;
    script.onerror = function () {
      delete window[cb];
      showLock("تعذّر الاتصال بالتطبيق. تأكدي من رابط /exec.");
    };
    document.body.appendChild(script);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var key = keyInput.value.trim();
    if (!key) {
      lockHint.textContent = "اكتبي مفتاح لوحة المعلمة.";
      return;
    }
    lockHint.textContent = "جارٍ الفتح…";
    load(key);
  });

  search.addEventListener("input", function () { paint(cache); });
  document.getElementById("refresh").addEventListener("click", function () {
    if (!url()) {
      cache = localRows();
      paint(cache);
      return;
    }
    var key = sessionStorage.getItem(KEY) || keyInput.value.trim();
    if (key) load(key);
  });

  function localRows() {
    try { return JSON.parse(localStorage.getItem("u21-aim-a-sheet") || "[]"); }
    catch (err) { return []; }
  }

  function xmlEscape(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.getElementById("excel").addEventListener("click", function () {
    var cols = [
      "الاسم", "الشعبة", "المرحلة الحالية", "مدة الاستخدام", "عدد الضغطات",
      "القطاع الأول", "كتب القطاع الأول",
      "القطاع الثاني", "كتب القطاع الثاني",
      "القطاع الثالث", "كتب القطاع الثالث",
      "مراحل منجزة", "مجموع المراحل", "النسبة %", "الحالة", "آخر ظهور"
    ];
    var rows = cache.length ? cache : localRows();
    var head = "<Row>" + cols.map(function (col) {
      return '<Cell ss:StyleID="header"><Data ss:Type="String">' + xmlEscape(col) + "</Data></Cell>";
    }).join("") + "</Row>";
    var body = rows.map(function (row) {
      return "<Row>" + cols.map(function (col) {
        var value = row[col];
        if (col === "مدة الاستخدام" && (value == null || value === "")) value = row["مدة النشاط"];
        return '<Cell><Data ss:Type="String">' + xmlEscape(value) + "</Data></Cell>";
      }).join("") + "</Row>";
    }).join("");
    var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<?mso-application progid="Excel.Sheet"?>' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      '<Styles><Style ss:ID="header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#1D6B45" ss:Pattern="Solid"/></Style></Styles>' +
      '<Worksheet ss:Name="النتائج"><Table>' + head + body + "</Table></Worksheet></Workbook>";
    var blob = new Blob([xml], { type: "application/vnd.ms-excel" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "نتائج-الهدف-أ.xls";
    link.click();
  });

  if (!url()) {
    setup.hidden = false;
    form.hidden = true;
    board.hidden = false;
    cache = localRows();
    paint(cache);
    statusEl.textContent = cache.length
      ? "نتائج هذا المتصفح. بعد ربط جدول Google تظهر نتائج كل الأجهزة."
      : "لا توجد نتائج على هذا المتصفح بعد.";
  }
  if (url()) {
    keyInput.value = PASS;
    load(PASS);
  }
  window.setInterval(function () {
    var key = sessionStorage.getItem(KEY);
    if (key && url() && !board.hidden) load(key);
  }, 20000);
})();
