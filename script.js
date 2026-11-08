(function () {
  "use strict";
  var C = window.AVM_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euro = function (n) { return Math.round(n) + " €"; };
  var waLink = function (msg) { return "https://wa.me/" + C.phone + "?text=" + encodeURIComponent(msg); };

  /* ---------- Coordonnées ---------- */
  $$("[data-tel]").forEach(function (a) { a.href = "tel:+" + C.phone; });
  $$("[data-tel-label]").forEach(function (e) { e.textContent = C.phoneLabel; });
  $$("[data-city]").forEach(function (e) { e.textContent = C.city; });
  $$("[data-registre]").forEach(function (e) { e.textContent = C.registre; });
  $$("[data-review]").forEach(function (a) { a.href = C.googleReviewUrl; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa"));
    a.target = "_blank"; a.rel = "noopener";
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  var burger = $("#burger"), nav = $("#nav");
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("#nav a").forEach(function (a) {
    a.addEventListener("click", function () { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); });
  });

  /* ---------- Formulaire ---------- */
  var form = $("#booking");
  var state = { mode: "transfer", vehicle: C.vehicles[0].id };

  // Trajets
  var routeSel = $("#route");
  C.routes.forEach(function (r) {
    var o = document.createElement("option");
    o.value = r.id; o.textContent = r.label + " — dès " + euro(r.price);
    routeSel.appendChild(o);
  });
  var other = document.createElement("option");
  other.value = "custom"; other.textContent = "Autre trajet (sur mesure)";
  routeSel.appendChild(other);

  // Véhicules
  var vWrap = $("#vehicles");
  C.vehicles.forEach(function (v, i) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "vehicle" + (i === 0 ? " is-active" : "");
    b.dataset.id = v.id;
    b.setAttribute("aria-pressed", i === 0);
    b.innerHTML = "<strong>" + v.label + "</strong><span>" + v.detail + "</span>";
    b.addEventListener("click", function () {
      state.vehicle = v.id;
      $$(".vehicle", vWrap).forEach(function (x) {
        var on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", on);
      });
      update();
    });
    vWrap.appendChild(b);
  });

  // Onglets
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

  // Date par défaut : demain
  var tomorrow = new Date(Date.now() + 864e5);
  $("#date").value = tomorrow.toISOString().slice(0, 10);
  $("#date").min = new Date().toISOString().slice(0, 10);
  $("#time").value = "09:00";

  function isCustom() { return state.mode === "transfer" && routeSel.value === "custom"; }
  function vehicle() { return C.vehicles.filter(function (v) { return v.id === state.vehicle; })[0]; }

  function compute() {
    var P = C.pricing, base;
    if (state.mode === "hourly") {
      base = Math.max(P.minHours, +$("#hours").value) * P.perHour;
    } else if (isCustom()) {
      base = Math.max(P.minimum, P.base + (+$("#km").value) * P.perKm);
    } else {
      base = C.routes.filter(function (r) { return r.id === routeSel.value; })[0].price;
    }
    var full = base * vehicle().coef;
    var round = $("#roundtrip").checked && state.mode === "transfer";
    if (round) full = full * 2 * (1 - C.roundTripDiscount);
    var final = full * (1 - (C.firstBookingDiscount || 0));
    return { full: full, final: final, round: round };
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

  ["#route", "#km", "#hours", "#roundtrip", "#pax"].forEach(function (s) {
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
    var p = compute();
    var trip;
    if (state.mode === "hourly") trip = "Mise à disposition " + $("#hours").value + " h";
    else if (isCustom()) trip = $("#from").value.trim() + " → " + $("#to").value.trim() + " (~" + $("#km").value + " km)";
    else trip = routeSel.options[routeSel.selectedIndex].text.split(" — ")[0];
    var d = $("#date").value.split("-").reverse().join("/");
    var msg = [
      "Bonjour AVM VTC, je souhaite réserver :",
      "• Trajet : " + trip + (p.round ? " (aller-retour)" : ""),
      "• Date : " + d + " à " + $("#time").value,
      "• Véhicule : " + vehicle().label,
      "• Passagers : " + $("#pax").value,
      "• Prix estimé : " + euro(p.final),
      "Prénom : " + name
    ].join("\n");
    window.open(waLink(msg), "_blank", "noopener");
  });

  // Liens "Voir les prix" qui pré-remplissent le formulaire
  $$("[data-prefill]").forEach(function (a) {
    a.addEventListener("click", function () {
      var k = a.dataset.prefill;
      if (k === "hourly") { setMode("hourly"); }
      else {
        setMode("transfer");
        var r = k === "custom" ? { id: "custom" } : C.routes.filter(function (x) { return x.group === k; })[0];
        if (r) routeSel.value = r.id;
      }
      update();
    });
  });

  /* ---------- Tableau des forfaits ---------- */
  var van = C.vehicles.filter(function (v) { return v.id === "van"; })[0];
  var tbody = $("#pricesTable tbody");
  C.routes.forEach(function (r) {
    var tr = document.createElement("tr");
    tr.innerHTML = "<td>" + r.label + "</td><td><strong>" + euro(r.price) + "</strong></td><td>" +
      (van ? euro(r.price * van.coef) : "—") + "</td>";
    var td = document.createElement("td");
    var b = document.createElement("a");
    b.href = "#top"; b.className = "link"; b.textContent = "Réserver";
    b.addEventListener("click", function () { setMode("transfer"); routeSel.value = r.id; update(); });
    td.appendChild(b); tr.appendChild(td);
    tbody.appendChild(tr);
  });

  update();
})();
