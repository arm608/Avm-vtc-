(function () {
  "use strict";
  var C = window.AVM_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euro = function (n) { return Math.round(n) + " €"; };
  var waLink = function (msg) { return "https://wa.me/" + C.phone + "?text=" + encodeURIComponent(msg); };
  var esc = function (s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; };
  var byId = function (list, id) { return list.filter(function (x) { return x.id === id; })[0]; };

  /* =================== Commun à toutes les pages =================== */
  $$("[data-tel]").forEach(function (a) { a.href = "tel:+" + C.phone; });
  $$("[data-tel-label]").forEach(function (e) { e.textContent = C.phoneLabel; });
  $$("[data-email]").forEach(function (e) { e.textContent = C.email; });
  $$("[data-region]").forEach(function (e) { e.textContent = C.region; });
  $$("[data-registre]").forEach(function (e) { e.textContent = C.registre; });
  $$("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
  $$("[data-mail]").forEach(function (a) {
    var subj = a.getAttribute("data-mail");
    a.href = "mailto:" + C.email + (subj ? "?subject=" + encodeURIComponent(subj) : "");
  });
  $$("[data-review]").forEach(function (a) { a.href = C.googleReviewUrl; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa"));
    a.target = "_blank"; a.rel = "noopener";
  });

  // Menu mobile (pages secondaires)
  var burger = $("#burger"), nav = $("#nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open);
    });
  }

  // Avis clients
  var rWrap = $("#reviews");
  if (rWrap) {
    var reviews = C.reviews || [];
    if (!reviews.length) { rWrap.hidden = true; $("#reviewsEmpty").hidden = false; }
    reviews.forEach(function (r) {
      var q = document.createElement("blockquote");
      q.className = "card review";
      q.innerHTML = '<p class="stars" aria-label="5 étoiles">★★★★★</p><p>« ' + esc(r.text) + ' »</p><footer>— ' +
        esc(r.name) + (r.trip ? ", " + esc(r.trip) : "") + "</footer>";
      rWrap.appendChild(q);
    });
  }

  /* =================== Installation de l'application =================== */
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferredPrompt = e;
    $$("[data-install]").forEach(function (b) { b.hidden = false; });
  });
  $$("[data-install]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () {
        deferredPrompt = null;
        $$("[data-install]").forEach(function (x) { x.hidden = true; });
      });
    });
  });
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }

  /* =================== Tableau des forfaits =================== */
  var van = byId(C.vehicles, "van");
  var hasApp = !!$("#rides");
  $$(".prices").forEach(function (table) {
    var groups = (table.getAttribute("data-groups") || "").split(",").filter(Boolean);
    var tbody = $("tbody", table);
    C.routes.forEach(function (r) {
      if (groups.length && groups.indexOf(r.group) < 0) return;
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + esc(r.label) + "</td><td><strong>" + euro(r.price) + "</strong></td><td>" +
        (van ? euro(r.price * van.coef) : "—") + "</td>";
      var td = document.createElement("td");
      var a = document.createElement("a");
      a.className = "link"; a.textContent = "Réserver";
      a.href = hasApp ? "#reserver" : "index.html?trajet=" + r.id;
      if (hasApp) a.addEventListener("click", function () { app.goTo(r); });
      td.appendChild(a); tr.appendChild(td);
      tbody.appendChild(tr);
    });
  });

  if (!hasApp) return;

  /* =================== L'application de réservation =================== */
  var NANTES = C.nantesZone;
  var state = { from: null, to: null, km: null, min: null, forfait: null, vehicle: C.vehicles[0].id, when: "now" };

  function haversine(a, b) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function inNantes(p) { return haversine(p, NANTES) <= NANTES.radiusKm; }
  function findForfait(a, b) {
    for (var i = 0; i < C.routes.length; i++) {
      var r = C.routes[i];
      if (r.lat == null) continue;
      var near = function (p) { return haversine(p, r) <= r.r; };
      if ((near(a) && inNantes(b)) || (near(b) && inNantes(a))) return r;
    }
    return null;
  }
  function priceFor(v) {
    var P = C.pricing;
    var base = state.forfait ? state.forfait.price : Math.max(P.minimum, P.base + state.km * P.perKm);
    var full = base * v.coef;
    return { full: full, final: full * (1 - (C.firstBookingDiscount || 0)) };
  }

  /* ---------- Carte ---------- */
  var map = null, layer = null;
  if (window.L) {
    try {
      map = L.map("map", { zoomControl: false, attributionControl: true, scrollWheelZoom: false })
        .setView([NANTES.lat, NANTES.lon], 12);
      map.attributionControl.setPrefix(false);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19, subdomains: "abcd",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);
      layer = L.layerGroup().addTo(map);
    } catch (e) { map = null; }
  }
  function pin(cls) { return L.divIcon({ className: "pin " + cls, iconSize: [18, 18], iconAnchor: [9, 9] }); }
  function drawMap(geo) {
    if (!map) return;
    layer.clearLayers();
    var pts = [];
    if (state.from) { L.marker([state.from.lat, state.from.lon], { icon: pin("pin--from") }).addTo(layer); pts.push([state.from.lat, state.from.lon]); }
    if (state.to) { L.marker([state.to.lat, state.to.lon], { icon: pin("pin--to") }).addTo(layer); pts.push([state.to.lat, state.to.lon]); }
    if (geo) {
      var line = geo.map(function (c) { return [c[1], c[0]]; });
      L.polyline(line, { color: "#d4a64a", weight: 5, opacity: .95 }).addTo(layer);
      pts = pts.concat(line);
    } else if (pts.length === 2) {
      L.polyline(pts, { color: "#d4a64a", weight: 3, dashArray: "6 8" }).addTo(layer);
    }
    if (pts.length === 1) map.setView(pts[0], 14);
    else if (pts.length > 1) {
      // Laisse la place au panneau de réservation (à gauche sur ordinateur, en bas sur mobile)
      var wide = window.innerWidth > 760;
      map.fitBounds(pts, wide ? { paddingTopLeft: [500, 50], paddingBottomRight: [50, 50] }
                              : { paddingTopLeft: [30, 30], paddingBottomRight: [30, 60] });
    }
  }

  /* ---------- Recherche d'adresses ---------- */
  function localMatches(q) {
    q = q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return C.routes.filter(function (r) {
      if (r.lat == null) return false;
      var t = (r.place + " " + r.label).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      return q.split(/\s+/).every(function (w) { return t.indexOf(w) >= 0; });
    }).map(function (r) { return { label: r.place, sub: "Forfait " + euro(r.price), lat: r.lat, lon: r.lon }; });
  }
  function photonLabel(f) {
    var p = f.properties, street = [p.housenumber, p.street].filter(Boolean).join(" ");
    var main = p.name || street || p.city;
    var sub = [p.name && street ? street : "", p.postcode, p.city !== main ? p.city : ""].filter(Boolean).join(" ");
    return { label: main, sub: sub, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] };
  }
  function geocode(q) {
    var url = "https://photon.komoot.io/api/?lang=fr&limit=6&lat=" + NANTES.lat + "&lon=" + NANTES.lon + "&q=" + encodeURIComponent(q);
    return fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      return (j.features || []).filter(function (f) { return f.properties.countrycode === "FR"; }).map(photonLabel);
    }).catch(function () { return []; });
  }

  function setupAc(input, key) {
    var list = input.parentNode.querySelector(".ac__list"), timer, items = [], seq = 0;
    function render() {
      list.innerHTML = "";
      items.slice(0, 6).forEach(function (it) {
        var li = document.createElement("li");
        li.setAttribute("role", "option");
        li.innerHTML = "<strong>" + esc(it.label) + "</strong>" + (it.sub ? "<span>" + esc(it.sub) + "</span>" : "");
        li.addEventListener("mousedown", function (e) { e.preventDefault(); choose(it); });
        list.appendChild(li);
      });
      list.hidden = !items.length || document.activeElement !== input;
    }
    function choose(it) {
      input.value = it.label + (it.sub && it.sub.indexOf("Forfait") < 0 ? ", " + it.sub : "");
      list.hidden = true;
      state[key] = { label: input.value, lat: it.lat, lon: it.lon };
      input.blur();
      update();
    }
    input.addEventListener("input", function () {
      state[key] = null; clearTrip();
      var q = input.value.trim();
      clearTimeout(timer);
      if (q.length < 3) { items = []; render(); return; }
      items = localMatches(q); render();
      var mine = ++seq;
      timer = setTimeout(function () {
        geocode(q).then(function (res) { if (mine !== seq) return; items = localMatches(q).concat(res); render(); });
      }, 250);
    });
    input.addEventListener("focus", function () { if (items.length && !state[key]) render(); });
    input.addEventListener("blur", function () {
      setTimeout(function () { list.hidden = true; }, 150);
      // Adresse tapée sans choisir de suggestion : on prend la première
      if (!state[key] && items.length) setTimeout(function () { if (!state[key]) choose(items[0]); }, 160);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && items.length) { e.preventDefault(); choose(items[0]); }
    });
    return { choose: choose };
  }
  var acFrom = setupAc($("#from"), "from");
  var acTo = setupAc($("#to"), "to");

  // Ma position
  $("#locate").addEventListener("click", function () {
    if (!navigator.geolocation) return;
    var btn = this; btn.classList.add("is-busy");
    navigator.geolocation.getCurrentPosition(function (pos) {
      var p = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      fetch("https://photon.komoot.io/reverse?lang=fr&lat=" + p.lat + "&lon=" + p.lon)
        .then(function (r) { return r.json(); })
        .then(function (j) { var f = j.features && j.features[0]; return f ? photonLabel(f) : null; })
        .catch(function () { return null; })
        .then(function (it) {
          btn.classList.remove("is-busy");
          acFrom.choose(it ? { label: it.label, sub: it.sub, lat: p.lat, lon: p.lon } : { label: "Ma position", sub: "", lat: p.lat, lon: p.lon });
        });
    }, function () { btn.classList.remove("is-busy"); }, { enableHighAccuracy: true, timeout: 10000 });
  });

  // Raccourcis destination
  C.routes.forEach(function (r) {
    if (!r.chip) return;
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.textContent = r.chip;
    b.addEventListener("click", function () { app.goTo(r); });
    $("#chips").appendChild(b);
  });

  /* ---------- Calcul du trajet ---------- */
  var routeSeq = 0;
  function clearTrip() { $("#trip").hidden = true; }
  function update() {
    drawMap(null);
    if (!state.from || !state.to) { clearTrip(); return; }
    var mine = ++routeSeq;
    var straight = haversine(state.from, state.to);
    state.forfait = findForfait(state.from, state.to);
    state.km = straight * 1.3; state.min = Math.round(state.km / 45 * 60 + 5);
    renderTrip(true);
    var url = "https://router.project-osrm.org/route/v1/driving/" + state.from.lon + "," + state.from.lat + ";" +
      state.to.lon + "," + state.to.lat + "?overview=full&geometries=geojson";
    fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      if (mine !== routeSeq || !j.routes || !j.routes[0]) return;
      state.km = j.routes[0].distance / 1000;
      state.min = Math.round(j.routes[0].duration / 60);
      drawMap(j.routes[0].geometry.coordinates);
      renderTrip(false);
    }).catch(function () {});
  }

  function fmtMin(m) { return m < 60 ? m + " min" : Math.floor(m / 60) + " h " + ("0" + (m % 60)).slice(-2); }

  function renderTrip(estimate) {
    $("#trip").hidden = false;
    $("#tripInfo").innerHTML = (estimate ? "≈ " : "") + Math.round(state.km) + " km · " + fmtMin(state.min) +
      (state.forfait ? ' <span class="tag">Forfait prix fixe</span>' : "");
    var wrap = $("#rides"); wrap.innerHTML = "";
    C.vehicles.forEach(function (v) {
      var p = priceFor(v), on = v.id === state.vehicle;
      var b = document.createElement("button");
      b.type = "button"; b.className = "ride" + (on ? " is-active" : "");
      b.setAttribute("role", "radio"); b.setAttribute("aria-checked", on);
      b.innerHTML = '<span class="ride__icon">' + v.icon + '</span>' +
        '<span class="ride__txt"><strong>' + esc(v.label) + ' <small>👤 ' + v.seats + '</small></strong><span>' + esc(v.detail) + '</span></span>' +
        '<span class="ride__price"><strong>' + euro(p.final) + '</strong>' + (C.firstBookingDiscount ? '<s>' + euro(p.full) + '</s>' : "") + '</span>';
      b.addEventListener("click", function () { state.vehicle = v.id; renderTrip(estimate); });
      wrap.appendChild(b);
    });
    var v = byId(C.vehicles, state.vehicle);
    $("#book").textContent = "Réserver " + v.label + " · " + euro(priceFor(v).final);
    $("#promo").textContent = C.firstBookingDiscount ? "🎁 -" + Math.round(C.firstBookingDiscount * 100) + " % appliqués sur votre 1ʳᵉ course réservée en direct" : "";
  }

  // Quand ?
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var isoDate = function (d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  $("#date").value = isoDate(new Date(Date.now() + 864e5));
  $("#date").min = isoDate(new Date());
  $("#time").value = "09:00";
  $$(".seg__btn").forEach(function (b) {
    b.addEventListener("click", function () {
      state.when = b.dataset.when;
      $$(".seg__btn").forEach(function (x) { var on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-checked", on); });
      $("#plan").hidden = state.when !== "later";
    });
  });

  // Réserver
  $("#book").addEventListener("click", function () {
    var err = $("#formError"), name = $("#name").value.trim();
    if (!name) { err.textContent = "Indiquez votre prénom pour que le chauffeur vous reconnaisse."; $("#name").focus(); return; }
    if (state.when === "later" && (!$("#date").value || !$("#time").value)) { err.textContent = "Choisissez la date et l'heure."; return; }
    err.textContent = "";
    var v = byId(C.vehicles, state.vehicle), p = priceFor(v);
    var quand = state.when === "now" ? "Dès que possible" :
      $("#date").value.split("-").reverse().join("/") + " à " + $("#time").value;
    var msg = [
      "Bonjour AVM VTC, je souhaite réserver une course :",
      "📍 Départ : " + state.from.label,
      "🏁 Arrivée : " + state.to.label,
      "🕐 Quand : " + quand,
      "🚘 Véhicule : " + v.label,
      "💶 Prix affiché : " + euro(p.final) + (state.forfait ? " (forfait)" : " (~" + Math.round(state.km) + " km)"),
      "👤 Prénom : " + name
    ].join("\n");
    window.open(waLink(msg), "_blank", "noopener");
  });

  var app = {
    goTo: function (r) {
      acTo.choose({ label: r.place, sub: "", lat: r.lat, lon: r.lon });
      if (!state.from) $("#from").focus();
      $("#reserver").scrollIntoView({ behavior: "smooth" });
    }
  };

  // Arrivée depuis une page aéroport / gare : index.html?trajet=nte
  var q = new URLSearchParams(location.search).get("trajet");
  var pre = q && byId(C.routes, q);
  if (pre && pre.lat != null) acTo.choose({ label: pre.place, sub: "", lat: pre.lat, lon: pre.lon });
})();
