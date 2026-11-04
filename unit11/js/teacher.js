(function () {
  var cfg = window.U11_FIREBASE;
  var linked = !!(cfg && cfg.apiKey && cfg.projectId);
  var setupEl = document.getElementById("setup");
  var loginEl = document.getElementById("login");
  var boardEl = document.getElementById("board");
  var rowsEl = document.getElementById("rows");
  var emptyEl = document.getElementById("empty");
  var detailEl = document.getElementById("detail");
  var cardsEl = document.getElementById("cards");
  var exportBtn = document.getElementById("export");
  var logoutBtn = document.getElementById("logout");
  var students = [];
  var openId = "";
  var unsubscribe = null;

  function show(el) { el.hidden = false; }
  function hide(el) { el.hidden = true; }

  function when(value) {
    if (!value) return "";
    var date = value.toDate ? value.toDate() : new Date(value);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("ar-JO", {
      timeZone: "Asia/Amman",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function seenMs(row) {
    var value = row.lastSeen || row.lastSeenClient;
    if (!value) return 0;
    if (value.toDate) return value.toDate().getTime();
    return Number(value) || 0;
  }

  function minutes(ms) { return Math.round((Number(ms) || 0) / 60000); }

  function workStages(row) {
    return (row.stages || []).filter(function (stage) { return !stage.read; });
  }

  function doneLabel(row) {
    return workStages(row).filter(function (stage) { return stage.done; })
      .map(function (stage) { return stage.code + " " + stage.nav; }).join("، ");
  }

  function leftLabel(row) {
    return workStages(row).filter(function (stage) { return !stage.done; })
      .map(function (stage) {
        var left = (stage.pointsTotal || 0) - (stage.pointsDone || 0);
        return stage.code + " " + stage.nav + " (" + left + ")";
      }).join("، ");
  }

  function isToday(row) {
    var ms = seenMs(row);
    if (!ms) return false;
    var a = new Date(ms);
    var b = new Date();
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function filtered() {
    var q = document.getElementById("q").value.trim();
    var mode = document.getElementById("filter").value;
    return students.filter(function (row) {
      if (mode === "done" && (row.percent || 0) < 100) return false;
      if (mode === "open" && (row.percent || 0) >= 100) return false;
      if (mode === "today" && !isToday(row)) return false;
      if (!q) return true;
      return (row.name || "").indexOf(q) !== -1 || (row.klass || "").indexOf(q) !== -1;
    }).sort(function (a, b) { return seenMs(b) - seenMs(a); });
  }

  function paintCards(list) {
    var count = list.length;
    var avg = count ? Math.round(list.reduce(function (sum, row) { return sum + (row.percent || 0); }, 0) / count) : 0;
    var done = list.filter(function (row) { return (row.percent || 0) >= 100; }).length;
    var today = list.filter(isToday).length;
    var items = [
      [count, "طلاب"],
      [avg + "%", "متوسط التقدم"],
      [done, "أتممن الدليل"],
      [today, "ظهرن اليوم"]
    ];
    cardsEl.innerHTML = items.map(function (item) {
      return "<article class=\"card\"><b>" + item[0] + "</b><span>" + item[1] + "</span></article>";
    }).join("");
  }

  function paintTable() {
    var list = filtered();
    paintCards(students);
    emptyEl.hidden = list.length > 0;
    rowsEl.innerHTML = list.map(function (row) {
      var pct = row.percent || 0;
      return "<tr data-id=\"" + row.id + "\"" + (row.id === openId ? " class=\"is-open\"" : "") + ">" +
        "<td>" + escapeHtml(row.name || "") + "</td>" +
        "<td>" + escapeHtml(row.klass || "—") + "</td>" +
        "<td><bdi dir=\"ltr\">" + pct + "%</bdi><span class=\"bar\"><i style=\"width:" + pct + "%\"></i></span></td>" +
        "<td>" + escapeHtml((row.currentCode || "") + " " + (row.currentNav || "")) + "</td>" +
        "<td><bdi dir=\"ltr\">" + (row.stagesDone || 0) + "/" + (row.stagesTotal || 0) + "</bdi></td>" +
        "<td><bdi dir=\"ltr\">" + (row.pointsLeft || 0) + "</bdi></td>" +
        "<td><bdi dir=\"ltr\">" + minutes(row.activeMs) + "</bdi></td>" +
        "<td><bdi dir=\"ltr\">" + (row.clicks || 0) + "</bdi></td>" +
        "<td>" + escapeHtml(when(row.lastSeen || row.lastSeenClient)) + "</td>" +
        "</tr>";
    }).join("");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function paintDetail(row) {
    if (!row) {
      detailEl.hidden = true;
      return;
    }
    var stages = workStages(row).map(function (stage) {
      var pct = stage.pointsTotal ? Math.round((stage.pointsDone / stage.pointsTotal) * 100) : 0;
      var stageMinutes = minutes((row.timeByStage || {})[stage.id]);
      var stageClicks = (row.clicksByStage || {})[stage.id] || 0;
      return "<div class=\"stage" + (stage.done ? " is-done" : "") + "\"><b class=\"ltr\">" + escapeHtml(stage.code) + "</b><span>" +
        escapeHtml(stage.nav) + "</span><bdi dir=\"ltr\">" + stage.pointsDone + "/" + stage.pointsTotal +
        " · " + stageMinutes + " د · " + stageClicks + " نقرة</bdi></div>";
    }).join("");
    var points = [];
    (row.stages || []).forEach(function (stage) {
      (stage.points || []).forEach(function (point) {
        points.push("<li class=\"" + (point.done ? "is-done" : "") + "\">" + escapeHtml(stage.code) + " · " + escapeHtml(point.title) + "</li>");
      });
    });
    detailEl.hidden = false;
    detailEl.innerHTML =
      "<h2>" + escapeHtml(row.name || "") + "</h2>" +
      "<div class=\"meta\">" +
      "<span>الشعبة: " + escapeHtml(row.klass || "—") + "</span>" +
      "<span>أول ظهور: " + escapeHtml(when(row.firstSeen)) + "</span>" +
      "<span>آخر ظهور: " + escapeHtml(when(row.lastSeen || row.lastSeenClient)) + "</span>" +
      "<span>الجلسات: <bdi dir=\"ltr\">" + (row.sessions || 0) + "</bdi></span>" +
      "<span>صفوف الجداول: <bdi dir=\"ltr\">" + (row.rowsDone || 0) + "</bdi></span>" +
      "<span>مرات المسح: <bdi dir=\"ltr\">" + (row.resets || 0) + "</bdi></span>" +
      "<span class=\"ltr\">" + escapeHtml(row.screen || "") + "</span>" +
      "</div>" +
      "<p>أُنجز: " + escapeHtml(doneLabel(row) || "—") + "</p>" +
      "<p>تبقّى: " + escapeHtml(leftLabel(row) || "—") + "</p>" +
      "<div class=\"stages\">" + stages + "</div>" +
      "<ul class=\"points\">" + points.join("") + "</ul>";
  }

  function selected() {
    return students.filter(function (row) { return row.id === openId; })[0];
  }

  rowsEl.addEventListener("click", function (event) {
    var tr = event.target.closest("tr");
    if (!tr) return;
    openId = tr.getAttribute("data-id");
    paintTable();
    paintDetail(selected());
  });
  document.getElementById("q").addEventListener("input", paintTable);
  document.getElementById("filter").addEventListener("change", paintTable);

  function sheetRows() {
    var list = filtered();
    var summary = [[
      "الاسم", "الشعبة", "النسبة", "المراحل المنجزة", "إجمالي المراحل", "البنود المنجزة", "البنود المتبقية",
      "صفوف الجداول", "المرحلة الحالية", "ما أُنجز", "ما تبقّى", "دقائق العمل", "الجلسات", "النقرات",
      "مرات المسح", "أول ظهور", "آخر ظهور", "الشاشة", "معرّف الجهاز"
    ]];
    var stages = [["الاسم", "الشعبة", "المجموعة", "الرمز", "المرحلة", "البنود", "المنجز", "المتبقي", "الحالة", "دقائق", "نقرات"]];
    var points = [["الاسم", "الشعبة", "الرمز", "المرحلة", "البند", "الحالة"]];
    var time = [["الاسم", "الشعبة", "الرمز", "المرحلة", "دقائق", "نقرات"]];
    var path = [["الاسم", "الشعبة", "الترتيب", "المرحلة", "الوقت"]];
    list.forEach(function (row) {
      summary.push([
        row.name || "", row.klass || "", row.percent || 0, row.stagesDone || 0, row.stagesTotal || 0,
        row.pointsDone || 0, row.pointsLeft || 0, row.rowsDone || 0,
        ((row.currentCode || "") + " " + (row.currentNav || "")).trim(),
        doneLabel(row), leftLabel(row), minutes(row.activeMs), row.sessions || 0, row.clicks || 0,
        row.resets || 0, when(row.firstSeen), when(row.lastSeen || row.lastSeenClient),
        row.screen || "", row.deviceId || row.id || ""
      ]);
      (row.stages || []).forEach(function (stage) {
        if (stage.read) return;
        stages.push([
          row.name || "", row.klass || "", stage.group || "", stage.code || "", stage.nav || "",
          stage.pointsTotal || 0, stage.pointsDone || 0,
          (stage.pointsTotal || 0) - (stage.pointsDone || 0),
          stage.done ? "تم" : "متبقي",
          minutes((row.timeByStage || {})[stage.id]),
          (row.clicksByStage || {})[stage.id] || 0
        ]);
        time.push([
          row.name || "", row.klass || "", stage.code || "", stage.nav || "",
          minutes((row.timeByStage || {})[stage.id]),
          (row.clicksByStage || {})[stage.id] || 0
        ]);
        (stage.points || []).forEach(function (point) {
          points.push([row.name || "", row.klass || "", stage.code || "", stage.nav || "", point.title || "", point.done ? "تم" : "متبقي"]);
        });
      });
      (row.log || []).forEach(function (step, index) {
        path.push([row.name || "", row.klass || "", index + 1, step.nav || step.id || "", when(step.t)]);
      });
    });
    return [
      { name: "الملخص", rows: summary },
      { name: "المراحل", rows: stages },
      { name: "البنود", rows: points },
      { name: "الوقت والنقرات", rows: time },
      { name: "مسار التنقل", rows: path }
    ];
  }

  exportBtn.addEventListener("click", function () {
    if (!window.U11Xlsx) return;
    var bytes = window.U11Xlsx.build(sheetRows());
    var blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    var link = document.createElement("a");
    var day = new Date();
    var stamp = day.getFullYear() + "-" + String(day.getMonth() + 1).padStart(2, "0") + "-" + String(day.getDate()).padStart(2, "0");
    link.href = URL.createObjectURL(blob);
    link.download = "U11-students-" + stamp + ".xlsx";
    link.click();
    URL.revokeObjectURL(link.href);
  });

  function watch() {
    unsubscribe = firebase.firestore().collection("students").onSnapshot(function (snap) {
      students = snap.docs.map(function (doc) {
        var data = doc.data();
        data.id = doc.id;
        return data;
      });
      paintTable();
      paintDetail(selected());
    }, function (err) {
      document.getElementById("login-hint").textContent = err && err.message ? err.message : "تعذر قراءة السجلات.";
    });
  }

  function enterBoard() {
    hide(loginEl);
    hide(setupEl);
    show(boardEl);
    exportBtn.hidden = false;
    logoutBtn.hidden = false;
    watch();
  }

  logoutBtn.addEventListener("click", function () {
    if (unsubscribe) unsubscribe();
    firebase.auth().signOut();
  });

  function bootFirebase() {
    var appScript = document.createElement("script");
    appScript.src = "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js";
    appScript.onload = function () {
      var rest = [
        "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js",
        "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js"
      ];
      var pending = rest.length;
      rest.forEach(function (src) {
        var script = document.createElement("script");
        script.src = src;
        script.onload = function () {
          pending -= 1;
          if (pending) return;
          if (!firebase.apps.length) firebase.initializeApp(cfg);
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) enterBoard();
            else {
              if (unsubscribe) unsubscribe();
              unsubscribe = null;
              show(loginEl);
              hide(boardEl);
              exportBtn.hidden = true;
              logoutBtn.hidden = true;
            }
          });
        };
        document.head.appendChild(script);
      });
    };
    document.head.appendChild(appScript);
  }

  document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var hint = document.getElementById("login-hint");
    hint.textContent = "";
    firebase.auth().signInWithEmailAndPassword(
      document.getElementById("email").value.trim(),
      document.getElementById("password").value
    ).catch(function (err) {
      hint.textContent = err && err.message ? err.message : "تعذر الدخول.";
    });
  });

  function loadSheet() {
    var cloud = window.U11_CLOUD || {};
    var base = String(cloud.sheetsUrl || "").trim();
    if (!base) return false;
    hide(setupEl);
    hide(loginEl);
    show(boardEl);
    exportBtn.hidden = false;
    var cb = "u11Board_" + Date.now();
    window[cb] = function (data) {
      delete window[cb];
      var node = document.getElementById(cb);
      if (node) node.remove();
      if (!data || !data.ok) {
        emptyEl.hidden = false;
        emptyEl.textContent = data && data.error ? data.error : "تعذر قراءة الجدول.";
        return;
      }
      students = data.rows || [];
      paintTable();
      paintDetail(selected());
    };
    var script = document.createElement("script");
    script.id = cb;
    var join = base.indexOf("?") === -1 ? "?" : "&";
    script.src = base + join + "view=board&key=" + encodeURIComponent(cloud.teacherKey || "") + "&callback=" + cb;
    script.onerror = function () {
      delete window[cb];
      emptyEl.hidden = false;
      emptyEl.textContent = "تعذر الاتصال بتطبيق الجدول.";
    };
    document.body.appendChild(script);
    return true;
  }

  if (loadSheet()) {
    window.setInterval(loadSheet, 20000);
    return;
  }

  if (!linked) {
    show(setupEl);
    return;
  }
  bootFirebase();
})();
