(function () {
  "use strict";
  var C = window.AVM_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euro = function (n) { return Math.round(n) + " €"; };
  var waLink = function (msg) { return "https://wa.me/" + C.phone + "?text=" + encodeURIComponent(msg); };
  var esc = function (s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; };
  var byId = function (list, id) { return list.filter(function (x) { return x.id === id; })[0]; };

  /* ---------- Coordonnées ---------- */
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

  /* ---------- Menu mobile ---------- */
  var burger = $("#burger"), nav = $("#nav");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open);
    });
    $$("#nav a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); });
    });
  }

  /* ---------- Avis clients ---------- */
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

  /* ---------- Tableau des forfaits ---------- */
  var van = byId(C.vehicles, "van");
  $$(".prices").forEach(function (table) {
    var groups = (table.getAttribute("data-groups") || "").split(",").filter(Boolean);
    var tbody = $("tbody", table);
    var onIndex = !!$("#reserver");
    C.routes.forEach(function (r) {
      if (groups.length && groups.indexOf(r.group) < 0) return;
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + esc(r.label) + "</td><td><strong>" + euro(r.price) + "</strong></td><td>" +
        (van ? euro(r.price * van.coef) : "—") + "</td>";
      var td = document.createElement("td");
      var a = document.createElement("a");
      a.className = "link"; a.textContent = "Réserver";
      a.href = onIndex ? "#reserver" : "index.html?trajet=" + r.id + "#reserver";
      if (onIndex) a.addEventListener("click", function () { selectRoute(r.id); });
      td.appendChild(a); tr.appendChild(td);
      tbody.appendChild(tr);
    });
  });

  /* ---------- Formulaire de devis ---------- */
  var form = $("#reserver");
  if (!form) return;
  var state = { mode: "transfer", vehicle: C.vehicles[0].id };
  var routeSel = $("#route");

  C.routes.forEach(function (r) {
    var o = document.createElement("option");
    o.value = r.id; o.textContent = r.label + " — " + euro(r.price);
    routeSel.appendChild(o);
  });
  var other = document.createElement("option");
  other.value = "custom"; other.textContent = "Autre trajet (sur mesure)";
  routeSel.appendChild(other);

  var vWrap = $("#vehicles");
  C.vehicles.forEach(function (v, i) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "vehicle" + (i === 0 ? " is-active" : "");
    b.setAttribute("aria-pressed", i === 0);
    b.innerHTML = "<strong>" + esc(v.label) + "</strong><span>" + esc(v.detail) + "</span>";
    b.addEventListener("click", function () {
      state.vehicle = v.id;
      $$(".vehicle", vWrap).forEach(function (x) {
        var on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", on);
      });
      update();
    });
    vWrap.appendChild(b);
  });

  $$(".tab", form).forEach(function (t) {
    t.addEventListener("click", function () { setMode(t.dataset.mode); });
  });
  function setMode(mode) {
    state.mode = mode;
    $$(".tab", form).forEach(function (t) {
      var on = t.dataset.mode === mode; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", on);
    });
    update();
  }
  function selectRoute(id) { setMode("transfer"); routeSel.value = id; update(); }

  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var isoDate = function (d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  $("#date").value = isoDate(new Date(Date.now() + 864e5));
  $("#date").min = isoDate(new Date());
  $("#time").value = "09:00";

  function isCustom() { return state.mode === "transfer" && routeSel.value === "custom"; }
  function vehicle() { return byId(C.vehicles, state.vehicle); }

  function compute() {
    var P = C.pricing, base;
    if (state.mode === "hourly") base = Math.max(P.minHours, +$("#hours").value) * P.perHour;
    else if (isCustom()) base = Math.max(P.minimum, P.base + (+$("#km").value) * P.perKm);
    else base = byId(C.routes, routeSel.value).price;
    var full = base * vehicle().coef;
    var round = state.mode === "transfer" && $("#roundtrip").checked;
    if (round) full = full * 2 * (1 - C.roundTripDiscount);
    return { full: full, final: full * (1 - (C.firstBookingDiscount || 0)), round: round };
  }

  function update() {
    $$("[data-show]", form).forEach(function (el) {
      var k = el.dataset.show;
      el.hidden = !((k === "transfer" && state.mode === "transfer") ||
                    (k === "hourly" && state.mode === "hourly") ||
                    (k === "custom" && isCustom()));
    });
    $("#kmOut").textContent = $("#km").value;
    $("#hoursOut").textContent = $("#hours").value;
    var p = compute();
    $("#price").textContent = euro(p.final);
    $("#priceOld").textContent = C.firstBookingDiscount ? euro(p.full) : "";
    $("#priceNote").hidden = !C.firstBookingDiscount;
  }

  ["#route", "#km", "#hours", "#roundtrip"].forEach(function (s) {
    $(s).addEventListener("input", update);
    $(s).addEventListener("change", update);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("#formError");
    var name = $("#name").value.trim();
    if (!name || !$("#date").value || !$("#time").value) {
      err.textContent = "Merci d'indiquer votre prénom, la date et l'heure.";
      return;
    }
    if (isCustom() && (!$("#from").value.trim() || !$("#to").value.trim())) {
      err.textContent = "Merci d'indiquer l'adresse de départ et d'arrivée.";
      return;
    }
    err.textContent = "";
    var p = compute(), trip;
    if (state.mode === "hourly") trip = "Mise à disposition " + $("#hours").value + " h";
    else if (isCustom()) trip = $("#from").value.trim() + " → " + $("#to").value.trim() + " (~" + $("#km").value + " km)";
    else trip = byId(C.routes, routeSel.value).label;
    var msg = [
      "Bonjour AVM VTC, je souhaite réserver :",
      "• Trajet : " + trip + (p.round ? " (aller-retour)" : ""),
      "• Date : " + $("#date").value.split("-").reverse().join("/") + " à " + $("#time").value,
      "• Véhicule : " + vehicle().label,
      "• Passagers : " + $("#pax").value,
      "• Prix estimé : " + euro(p.final),
      "Prénom : " + name
    ].join("\n");
    window.open(waLink(msg), "_blank", "noopener");
  });

  // Liens qui pré-remplissent le formulaire
  $$("[data-prefill]").forEach(function (a) {
    a.addEventListener("click", function () {
      var k = a.dataset.prefill;
      if (k === "hourly") setMode("hourly");
      else selectRoute(k);
    });
  });

  // Pré-sélection depuis l'URL (?trajet=nte) — utilisé par les pages aéroport / gare
  var q = new URLSearchParams(location.search).get("trajet");
  if (q && (q === "custom" || byId(C.routes, q))) routeSel.value = q;

  update();
})();
