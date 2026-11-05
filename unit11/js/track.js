(function () {
  var PRESENCE = "u11-presence";
  var DEVICE = "u11-device";
  var IDLE_MS = 120000;
  var BEAT_MS = 15000;
  var cfg = window.U11_FIREBASE;
  var linked = !!(cfg && cfg.apiKey && cfg.projectId);
  var db = null;
  var presence = loadPresence();
  var lastBeat = Date.now();
  var lastInput = Date.now();
  var syncTimer = 0;
  var sessionMarked = false;
  var lastStage = "";

  function loadPresence() {
    try {
      var saved = JSON.parse(localStorage.getItem(PRESENCE) || "null");
      if (saved && typeof saved === "object") {
        saved.clicksByStage = saved.clicksByStage || {};
        saved.timeByStage = saved.timeByStage || {};
        saved.log = saved.log || [];
        return saved;
      }
    } catch (err) {}
    return {
      activeMs: 0,
      clicks: 0,
      sessions: 0,
      resets: 0,
      peakPoints: 0,
      firstSeen: Date.now(),
      clicksByStage: {},
      timeByStage: {},
      log: []
    };
  }

  function deviceId() {
    var id = localStorage.getItem(DEVICE);
    if (id) return id;
    id = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : "u11-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
    localStorage.setItem(DEVICE, id);
    return id;
  }

  function savePresence() {
    localStorage.setItem(PRESENCE, JSON.stringify(presence));
  }

  function working() {
    return document.body.classList.contains("ready") && document.visibilityState === "visible";
  }

  function noteStage(id, nav) {
    if (!id || id === lastStage) return;
    lastStage = id;
    var log = presence.log;
    log.push({ id: id, nav: nav || id, t: Date.now() });
    if (log.length > 80) presence.log = log.slice(-80);
    savePresence();
  }

  function markSession() {
    if (sessionMarked || !document.body.classList.contains("ready")) return;
    sessionMarked = true;
    presence.sessions += 1;
    if (!presence.firstSeen) presence.firstSeen = Date.now();
    savePresence();
  }

  function beat() {
    var now = Date.now();
    var delta = now - lastBeat;
    lastBeat = now;
    if (!working() || now - lastInput > IDLE_MS) return;
    var add = Math.min(Math.max(delta, 0), 20000);
    presence.activeMs += add;
    var snap = window.U11Guide && window.U11Guide.snapshot ? window.U11Guide.snapshot() : null;
    if (snap && snap.currentId) {
      presence.timeByStage[snap.currentId] = (presence.timeByStage[snap.currentId] || 0) + add;
      noteStage(snap.currentId, snap.currentNav);
    }
    savePresence();
  }

  document.addEventListener("pointerdown", function () {
    lastInput = Date.now();
    if (!document.body.classList.contains("ready")) return;
    presence.clicks += 1;
    var snap = window.U11Guide && window.U11Guide.snapshot ? window.U11Guide.snapshot() : null;
    if (snap && snap.currentId) {
      presence.clicksByStage[snap.currentId] = (presence.clicksByStage[snap.currentId] || 0) + 1;
    }
    savePresence();
    schedule();
  }, true);

  ["keydown", "scroll"].forEach(function (type) {
    window.addEventListener(type, function () { lastInput = Date.now(); }, { passive: true });
  });

  setInterval(beat, BEAT_MS);
  setInterval(function () {
    if (document.body.classList.contains("ready") && document.visibilityState === "visible") schedule();
  }, 60000);

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);

  function schedule() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(flush, 1500);
  }

  function payload(snap) {
    if (presence.peakPoints > 0 && snap.pointsDone === 0) presence.resets += 1;
    if (snap.pointsDone > presence.peakPoints) presence.peakPoints = snap.pointsDone;
    noteStage(snap.currentId, snap.currentNav);
    savePresence();
    return {
      name: snap.name,
      klass: snap.klass || "",
      deviceId: deviceId(),
      firstSeen: presence.firstSeen || Date.now(),
      lastSeenClient: Date.now(),
      activeMs: presence.activeMs || 0,
      sessions: presence.sessions || 0,
      clicks: presence.clicks || 0,
      resets: presence.resets || 0,
      currentId: snap.currentId,
      currentNav: snap.currentNav,
      currentCode: snap.currentCode,
      currentGroup: snap.currentGroup,
      percent: snap.percent,
      stagesDone: snap.stagesDone,
      stagesTotal: snap.stagesTotal,
      pointsDone: snap.pointsDone,
      pointsTotal: snap.pointsTotal,
      pointsLeft: snap.pointsLeft,
      rowsDone: snap.rowsDone,
      stages: snap.stages,
      clicksByStage: presence.clicksByStage,
      timeByStage: presence.timeByStage,
      log: presence.log,
      screen: (window.screen ? screen.width + "×" + screen.height : ""),
      device: (navigator.userAgent || "").slice(0, 180)
    };
  }

  function cloudUrl() {
    return String((window.U11_CLOUD || {}).sheetsUrl || "").trim();
  }

  function stamp(ms) {
    var date = new Date(ms || Date.now());
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
  }

  function sheetPack(body) {
    var stages = (body.stages || []).filter(function (stage) { return !stage.read; }).map(function (stage) {
      return {
        id: stage.id,
        group: stage.group,
        nav: stage.nav,
        code: stage.code,
        pointsTotal: stage.pointsTotal,
        pointsDone: stage.pointsDone,
        done: stage.done,
        minutes: Math.round(((body.timeByStage || {})[stage.id] || 0) / 60000),
        clicks: (body.clicksByStage || {})[stage.id] || 0,
        points: (stage.points || []).map(function (point) {
          return { title: point.title, done: point.done };
        })
      };
    });
    return {
      kind: "u11",
      deviceId: body.deviceId,
      name: body.name,
      klass: body.klass,
      percent: body.percent,
      stagesDone: body.stagesDone,
      stagesTotal: body.stagesTotal,
      pointsDone: body.pointsDone,
      pointsLeft: body.pointsLeft,
      rowsDone: body.rowsDone,
      currentCode: body.currentCode,
      currentNav: body.currentNav,
      minutes: Math.round((body.activeMs || 0) / 60000),
      sessions: body.sessions,
      clicks: body.clicks,
      resets: body.resets,
      firstSeen: stamp(body.firstSeen),
      lastSeen: stamp(body.lastSeenClient),
      stages: stages,
      log: (body.log || []).slice(-40).map(function (step) {
        return { id: step.id, nav: step.nav, t: stamp(step.t) };
      })
    };
  }

  function ensureSink() {
    var iframe = document.getElementById("u11Sink");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.name = "u11Sink";
      iframe.id = "u11Sink";
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
      document.body.appendChild(iframe);
    }
    var form = document.getElementById("u11CloudForm");
    if (!form) {
      form = document.createElement("form");
      form.id = "u11CloudForm";
      form.method = "POST";
      form.target = "u11Sink";
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

  function sendSheet(body) {
    var url = cloudUrl();
    if (!url) return false;
    var text = JSON.stringify(sheetPack(body));
    try {
      var form = ensureSink();
      form.action = url;
      form.querySelector("[name=payload]").value = text;
      form.querySelector("[name=data]").value = text;
      form.submit();
      return true;
    } catch (err) {
      return false;
    }
  }

  function flush() {
    markSession();
    if (!window.U11Guide || !window.U11Guide.snapshot) return;
    var snap;
    try { snap = window.U11Guide.snapshot(); } catch (err) { return; }
    if (!snap || !snap.name || snap.name.length < 2) return;
    var body = payload(snap);
    sendSheet(body);
    if (!db) return;
    body.lastSeen = firebase.firestore.FieldValue.serverTimestamp();
    db.collection("students").doc(body.deviceId).set(body, { merge: true }).catch(function () {});
  }

  function boot() {
    if (!linked) return;
    var appScript = document.createElement("script");
    appScript.src = "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js";
    appScript.onload = function () {
      var storeScript = document.createElement("script");
      storeScript.src = "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js";
      storeScript.onload = function () {
        if (!firebase.apps.length) firebase.initializeApp(cfg);
        db = firebase.firestore();
        flush();
      };
      storeScript.onerror = function () {};
      document.head.appendChild(storeScript);
    };
    appScript.onerror = function () {};
    document.head.appendChild(appScript);
  }

  window.U11Track = { sync: schedule, flush: flush };
  boot();
})();
