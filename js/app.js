(function () {
  var stages = window.AIM_A_GUIDE || [];
  var STORE = "u21-aim-a-v1";
  var state = load();
  var current = 0;
  var onlyLeft = false;
  var activeAnchor = 0;
  var sendTimer = 0;
  var lastSend = 0;
  var finishDismissed = false;

  var fracEl = document.getElementById("frac");
  var remainEl = document.getElementById("remain");
  var meterEl = document.getElementById("meter");
  var chipsEl = document.getElementById("chips");
  var stageEl = document.getElementById("stage");
  var navEl = document.getElementById("nav");
  var whoEl = document.getElementById("who");
  var prevBtn = document.getElementById("prev");
  var nextBtn = document.getElementById("next");
  var gateForm = document.getElementById("gate-form");
  var nameInput = document.getElementById("student-name");
  var classInput = document.getElementById("student-class");
  var gateHint = document.getElementById("gate-hint");

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE) || "null");
      if (saved && saved.checks) return saved;
    } catch (err) {}
    return blank();
  }

  function blank() {
    return {
      name: "",
      klass: "",
      sessionId: "",
      startedAt: 0,
      activeMs: 0,
      clicks: 0,
      checks: {},
      sectors: { sector1: "", sector2: "", sector3: "" },
      visited: {},
      currentId: "",
      doneSent: false
    };
  }

  function save() {
    localStorage.setItem(STORE, JSON.stringify(state));
  }

  function checkKey(stage, index) {
    return stage.id + ":" + index;
  }

  function isChecked(stage, index) {
    return !!state.checks[checkKey(stage, index)];
  }

  function stageDone(stage) {
    return stage.items.every(function (_, index) {
      return isChecked(stage, index);
    });
  }

  function pointsDone() {
    var n = 0;
    stages.forEach(function (stage) {
      stage.items.forEach(function (_, index) {
        if (isChecked(stage, index)) n += 1;
      });
    });
    return n;
  }

  function pointsTotal() {
    return stages.reduce(function (sum, stage) {
      return sum + stage.items.length;
    }, 0);
  }

  function stagesDone() {
    return stages.filter(stageDone).length;
  }

  function titleOf(stage) {
    if (!stage.num) return stage.heading;
    if (stage.num.indexOf(".") !== -1) return stage.num + " " + stage.heading;
    return stage.num + ". " + stage.heading;
  }

  function groupName(group) {
    var stage = stages.filter(function (item) { return item.group === group; })[0];
    if (!stage || !stage.sectorKey) return group;
    var custom = (state.sectors[stage.sectorKey] || "").trim();
    return custom ? group + " — " + custom : group;
  }

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function stamp(ms) {
    var d = new Date(ms);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  function formatDuration(totalSeconds) {
    var s = Math.max(0, Math.round(totalSeconds));
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var r = s % 60;
    if (h > 0) return h + ":" + pad(m) + ":" + pad(r);
    return m + ":" + pad(r);
  }

  function wallSeconds() {
    if (!state.startedAt) return 0;
    return Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  }

  function activeSeconds() {
    var extra = document.visibilityState === "visible" && activeAnchor ? Date.now() - activeAnchor : 0;
    return Math.max(0, Math.round((state.activeMs + extra) / 1000));
  }

  function flushActive() {
    if (document.visibilityState === "visible" && activeAnchor) {
      state.activeMs += Date.now() - activeAnchor;
      activeAnchor = Date.now();
      save();
    }
  }

  function cloudUrl() {
    return String((window.AIM_A_CLOUD || {}).sheetsUrl || "").trim();
  }

  function payload(eventName) {
    flushActive();
    var done = stagesDone();
    var total = stages.length;
    var stage = stages[current];
    function sectorName(key) {
      return (state.sectors[key] || "").trim();
    }
    function wrote(key) {
      return sectorName(key) ? "نعم" : "لا";
    }
    var sectors = [sectorName("sector1"), sectorName("sector2"), sectorName("sector3")].filter(Boolean).join(" | ");
    return {
      kind: "u21-aim-a",
      event: eventName || "beat",
      sessionId: state.sessionId,
      name: state.name,
      klass: state.klass,
      startedAt: stamp(state.startedAt),
      lastSeen: stamp(Date.now()),
      activeText: formatDuration(activeSeconds()),
      activeSeconds: activeSeconds(),
      wallText: formatDuration(wallSeconds()),
      wallSeconds: wallSeconds(),
      clicks: state.clicks,
      pointsDone: pointsDone(),
      pointsTotal: pointsTotal(),
      stagesDone: done,
      stagesTotal: total,
      percent: total ? Math.round((done / total) * 100) : 0,
      currentStage: titleOf(stage),
      visited: Object.keys(state.visited).length,
      sectors: sectors,
      sector1: sectorName("sector1"),
      sector1Wrote: wrote("sector1"),
      sector2: sectorName("sector2"),
      sector2Wrote: wrote("sector2"),
      sector3: sectorName("sector3"),
      sector3Wrote: wrote("sector3"),
      status: done === total ? "أنهى" : "يعمل"
    };
  }

  function saveLocalRow(pack) {
    var key = "u21-aim-a-sheet";
    var rows = [];
    try { rows = JSON.parse(localStorage.getItem(key) || "[]"); } catch (err) { rows = []; }
    var row = {
      "معرّف الجلسة": pack.sessionId,
      "الاسم": pack.name,
      "الشعبة": pack.klass,
      "مدة الاستخدام": pack.activeText,
      "نشاط بالثواني": pack.activeSeconds,
      "المدة منذ البدء": pack.wallText,
      "عدد الضغطات": pack.clicks,
      "القطاع الأول": pack.sector1,
      "كتب القطاع الأول": pack.sector1Wrote,
      "القطاع الثاني": pack.sector2,
      "كتب القطاع الثاني": pack.sector2Wrote,
      "القطاع الثالث": pack.sector3,
      "كتب القطاع الثالث": pack.sector3Wrote,
      "مراحل منجزة": pack.stagesDone,
      "مجموع المراحل": pack.stagesTotal,
      "النسبة %": pack.percent,
      "المرحلة الحالية": pack.currentStage,
      "الحالة": pack.status,
      "بداية الاستخدام": pack.startedAt,
      "آخر ظهور": pack.lastSeen
    };
    var index = -1;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i]["معرّف الجلسة"] === pack.sessionId) index = i;
    }
    if (index >= 0) rows[index] = row;
    else rows.push(row);
    localStorage.setItem(key, JSON.stringify(rows));
  }

  function ensureSink() {
    var iframe = document.getElementById("aimSink");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.name = "aimSink";
      iframe.id = "aimSink";
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
      document.body.appendChild(iframe);
    }
    var form = document.getElementById("aimCloudForm");
    if (!form) {
      form = document.createElement("form");
      form.id = "aimCloudForm";
      form.method = "POST";
      form.target = "aimSink";
      form.acceptCharset = "UTF-8";
      form.style.display = "none";
      ["payload", "data"].forEach(function (name) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        form.appendChild(input);
      });
      document.body.appendChild(form);
    }
    return form;
  }

  function send(eventName, force) {
    if (!state.sessionId) return;
    var now = Date.now();
    if (!force && now - lastSend < 15000 && eventName === "beat") return;
    lastSend = now;
    var pack = payload(eventName);
    saveLocalRow(pack);
    var url = cloudUrl();
    if (!url) return;
    var body = JSON.stringify(pack);
    try {
      var form = ensureSink();
      form.action = url;
      form.querySelector("[name=payload]").value = body;
      form.querySelector("[name=data]").value = body;
      form.submit();
    } catch (err) {
      try {
        fetch(url, {
          method: "POST",
          mode: "no-cors",
          keepalive: true,
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          body: "payload=" + encodeURIComponent(body)
        });
      } catch (err2) {}
    }
  }

  function queueSend(eventName) {
    if (eventName === "beat" && sendTimer) return;
    window.clearTimeout(sendTimer);
    sendTimer = window.setTimeout(function () {
      sendTimer = 0;
      send(eventName, eventName !== "beat");
    }, eventName === "beat" ? 8000 : 400);
  }

  function paintProgress() {
    var done = stagesDone();
    var total = stages.length;
    fracEl.innerHTML = done + " <span>/ " + total + "</span>";
    remainEl.textContent = "المتبقي " + (total - done) + " مرحلة";
    meterEl.style.width = (total ? (done / total) * 100 : 0) + "%";
    var groups = [];
    stages.forEach(function (stage) {
      var found = groups.filter(function (g) { return g.name === stage.group; })[0];
      if (!found) {
        found = { name: stage.group, total: 0, done: 0 };
        groups.push(found);
      }
      found.total += 1;
      if (stageDone(stage)) found.done += 1;
    });
    chipsEl.innerHTML = "";
    groups.forEach(function (group) {
      var chip = document.createElement("b");
      chip.textContent = groupName(group.name) + "  " + group.done + " / " + group.total;
      chipsEl.appendChild(chip);
    });
    navEl.querySelectorAll(".nav-item").forEach(function (btn, index) {
      var stage = stages[index];
      btn.classList.toggle("current", index === current);
      btn.classList.toggle("done", stageDone(stage));
      btn.classList.toggle("hidden-row", onlyLeft && stageDone(stage) && index !== current);
      btn.querySelector(".title").textContent = stage.nav;
    });
    navEl.querySelectorAll(".nav-group").forEach(function (label) {
      var name = label.dataset.group;
      var any = false;
      var node = label.nextElementSibling;
      while (node && !node.classList.contains("nav-group")) {
        if (!node.classList.contains("hidden-row")) any = true;
        node = node.nextElementSibling;
      }
      label.hidden = onlyLeft && !any;
      label.textContent = groupName(name);
    });
  }

  function renderNav() {
    navEl.innerHTML = "";
    var last = "";
    stages.forEach(function (stage, index) {
      if (stage.group !== last) {
        last = stage.group;
        var label = document.createElement("div");
        label.className = "nav-group";
        label.dataset.group = stage.group;
        label.textContent = groupName(stage.group);
        navEl.appendChild(label);
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-item";
      var no = document.createElement("span");
      no.className = "no";
      no.textContent = pad(index + 1);
      var title = document.createElement("span");
      title.className = "title";
      title.textContent = stage.nav;
      btn.appendChild(no);
      btn.appendChild(title);
      btn.addEventListener("click", function () {
        show(index);
        document.getElementById("side").classList.remove("open");
      });
      navEl.appendChild(btn);
    });
  }

  function addLine(copy, line) {
    var p = document.createElement("p");
    p.textContent = line;
    if (line === "↓") p.className = "flow-arrow";
    copy.appendChild(p);
  }

  function addTable(copy, item) {
    var table = document.createElement("table");
    table.className = "map";
    var head = document.createElement("tr");
    item.headers.forEach(function (cell) {
      var th = document.createElement("th");
      th.textContent = cell;
      head.appendChild(th);
    });
    table.appendChild(head);
    item.rows.forEach(function (row) {
      var tr = document.createElement("tr");
      row.forEach(function (cell) {
        var td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    copy.appendChild(table);
  }

  function addCopy(parent, item) {
    var copy = document.createElement("div");
    copy.className = "point-copy";
    copy.dir = "auto";
    if (item.kind === "text") {
      addLine(copy, item.text);
    } else if (item.kind === "lines") {
      item.lines.forEach(function (line) { addLine(copy, line); });
    } else if (item.kind === "table") {
      addTable(copy, item);
    } else if (item.kind === "mix") {
      item.parts.forEach(function (part) {
        if (typeof part === "string") addLine(copy, part);
        else addTable(copy, part);
      });
    }
    parent.appendChild(copy);
  }

  function renderStage() {
    var stage = stages[current];
    state.visited[stage.id] = true;
    state.currentId = stage.id;
    save();
    stageEl.innerHTML = "";
    if (stage.sectorKey) {
      var ribbon = document.createElement("div");
      ribbon.className = "ribbon";
      ribbon.textContent = stage.group + " — المسار من 5 إلى 21";
      stageEl.appendChild(ribbon);
    }
    (stage.mast || []).forEach(function (line) {
      var p = document.createElement("p");
      p.className = "mast" + (/[A-Za-z]/.test(line) ? " en" : "");
      p.textContent = line;
      stageEl.appendChild(p);
    });
    var h = document.createElement("h1");
    if (stage.num) {
      var wrap = document.createElement("span");
      wrap.className = "stage-num-wrap";
      var num = document.createElement("bdo");
      num.dir = "ltr";
      num.className = "stage-num";
      num.textContent = stage.num;
      wrap.appendChild(num);
      if (stage.num.indexOf(".") === -1) {
        var dot = document.createElement("span");
        dot.className = "stage-dot";
        dot.textContent = ".";
        wrap.appendChild(dot);
      }
      h.appendChild(wrap);
    }
    h.appendChild(document.createTextNode(stage.heading));
    stageEl.appendChild(h);
    if (stage.lead) {
      var lead = document.createElement("p");
      lead.className = "guide-lead";
      var leadNum = stage.lead.match(/^(\d+(?:\.\d+)*)(\s+)([\s\S]+)$/);
      if (leadNum) {
        var leadMark = document.createElement("bdo");
        leadMark.dir = "ltr";
        leadMark.className = "stage-num";
        leadMark.textContent = leadNum[1];
        lead.appendChild(leadMark);
        lead.appendChild(document.createTextNode(leadNum[2] + leadNum[3]));
      } else {
        lead.textContent = stage.lead;
      }
      stageEl.appendChild(lead);
    }
    if (stage.field) {
      var label = document.createElement("label");
      label.className = "sector-field";
      var span = document.createElement("span");
      span.textContent = "[اسم القطاع]";
      var input = document.createElement("input");
      input.type = "text";
      input.maxLength = 80;
      input.value = state.sectors[stage.sectorKey] || "";
      input.placeholder = "[اسم القطاع]";
      input.addEventListener("input", function () {
        state.sectors[stage.sectorKey] = input.value;
        save();
        paintProgress();
        queueSend("beat");
      });
      label.appendChild(span);
      label.appendChild(input);
      stageEl.appendChild(label);
    }
    stage.items.forEach(function (item, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "point" + (isChecked(stage, index) ? " is-done" : "");
      button.setAttribute("aria-pressed", isChecked(stage, index) ? "true" : "false");
      var tick = document.createElement("span");
      tick.className = "tick";
      tick.textContent = "✓";
      button.appendChild(tick);
      addCopy(button, item);
      button.addEventListener("click", function () {
        var key = checkKey(stage, index);
        var wasDone = stageDone(stage);
        state.checks[key] = !state.checks[key];
        if (stagesDone() !== stages.length) {
          state.doneSent = false;
          finishDismissed = false;
        }
        save();
        button.classList.toggle("is-done", !!state.checks[key]);
        button.setAttribute("aria-pressed", state.checks[key] ? "true" : "false");
        var nowDone = stageDone(stage);
        paintProgress();
        paintPager();
        if (!wasDone && nowDone) queueSend("stage");
        else queueSend("beat");
        if (nowDone && current === stages.length - 1) renderFinish();
      });
      stageEl.appendChild(button);
    });
    renderFinish();
    paintPager();
    paintProgress();
    var active = navEl.querySelectorAll(".nav-item")[current];
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest" });
    location.hash = stage.id;
  }

  function renderFinish() {
    var old = document.getElementById("finish");
    if (old) old.remove();
    if (finishDismissed) return;
    if (current !== stages.length - 1 || !stageDone(stages[current]) || stagesDone() !== stages.length) return;
    var box = document.createElement("div");
    box.id = "finish";
    box.className = "done-screen";
    var card = document.createElement("div");
    card.className = "done-card";
    var kicker = document.createElement("p");
    kicker.className = "kicker";
    kicker.textContent = "Unit 21 · الهدف أ";
    var title = document.createElement("h2");
    title.textContent = "خلصت الواجب الرسمي الأول لمادة الذكاء الاصطناعي، الهدف أ.";
    var wish = document.createElement("p");
    wish.className = "done-wish";
    wish.textContent = "هاي بداية النهايات المبهرة بإذن الله.";
    var close = document.createElement("button");
    close.type = "button";
    close.className = "primary";
    close.textContent = "حسنًا";
    close.addEventListener("click", function () {
      finishDismissed = true;
      box.remove();
    });
    card.appendChild(kicker);
    card.appendChild(title);
    card.appendChild(wish);
    card.appendChild(close);
    box.appendChild(card);
    document.body.appendChild(box);
    if (!state.doneSent) {
      state.doneSent = true;
      save();
      send("done", true);
    }
  }

  function paintPager() {
    var stage = stages[current];
    var left = stage.items.filter(function (_, index) { return !isChecked(stage, index); }).length;
    prevBtn.disabled = current === 0;
    var last = current === stages.length - 1;
    if (last && left === 0) {
      nextBtn.disabled = true;
      nextBtn.textContent = "أتممت المراحل";
      return;
    }
    nextBtn.disabled = left > 0;
    nextBtn.textContent = left > 0
      ? "علّم " + left + " للانتقال"
      : (last ? "إنهاء" : "المرحلة التالية");
  }

  function show(index) {
    current = Math.max(0, Math.min(stages.length - 1, index));
    renderStage();
    window.scrollTo(0, 0);
  }

  function startSession(name, klass) {
    var fresh = !state.sessionId;
    state.name = name;
    state.klass = klass;
    if (fresh) {
      state.sessionId = "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      state.startedAt = Date.now();
      state.activeMs = 0;
    }
    activeAnchor = Date.now();
    save();
    document.body.classList.add("ready");
    whoEl.textContent = name + (klass ? " · " + klass : "");
    var found = stages.findIndex(function (stage) { return stage.id === state.currentId; });
    if (found < 0 && state.currentId === "repeat") {
      found = stages.findIndex(function (stage) { return stage.id === "sector2-problem"; });
    }
    renderNav();
    show(found >= 0 ? found : 0);
    send(fresh ? "start" : "beat", true);
  }

  gateForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = nameInput.value.trim();
    if (name.length < 2) {
      gateHint.textContent = "اكتب اسمك حتى نبدأ.";
      nameInput.focus();
      return;
    }
    gateHint.textContent = "";
    state.clicks += 1;
    startSession(name, classInput.value.trim());
  });

  document.getElementById("edit-name").addEventListener("click", function () {
    nameInput.value = state.name || "";
    classInput.value = state.klass || "";
    document.body.classList.remove("ready");
    nameInput.focus();
  });

  document.getElementById("only-left").addEventListener("click", function () {
    onlyLeft = !onlyLeft;
    this.textContent = onlyLeft ? "كل المراحل" : "المتبقي فقط";
    paintProgress();
  });

  document.getElementById("reset").addEventListener("click", function () {
    if (!window.confirm("مسح تعليم النقاط والبدء من المرحلة الأولى؟ الاسم والمدة يبقيان.")) return;
    state.checks = {};
    state.visited = {};
    save();
    show(0);
    queueSend("beat");
  });

  document.getElementById("menu").addEventListener("click", function () {
    document.getElementById("side").classList.add("open");
  });

  prevBtn.addEventListener("click", function () { show(current - 1); });
  nextBtn.addEventListener("click", function () {
    if (nextBtn.disabled) return;
    show(current + 1);
  });

  document.addEventListener("click", function () {
    if (!state.sessionId || !document.body.classList.contains("ready")) return;
    state.clicks += 1;
    save();
    queueSend("beat");
  });

  document.addEventListener("visibilitychange", function () {
    if (!state.sessionId) return;
    if (document.visibilityState === "hidden") {
      flushActive();
      activeAnchor = 0;
      send("beat", true);
    } else {
      activeAnchor = Date.now();
    }
  });

  window.addEventListener("pagehide", function () {
    if (!state.sessionId) return;
    flushActive();
    send("beat", true);
  });

  window.setInterval(function () {
    if (!state.sessionId || document.visibilityState !== "visible") return;
    flushActive();
    send("beat", false);
  }, 45000);

  if (state.name && state.sessionId) {
    nameInput.value = state.name;
    classInput.value = state.klass || "";
    startSession(state.name, state.klass || "");
  } else {
    nameInput.focus();
  }
})();
