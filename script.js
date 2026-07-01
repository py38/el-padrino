/* ============================================================
   EL PADRINO — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Always open at the top (so reveals fire) ---------- */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.getElementById("preloader").classList.add("done");
      document.body.classList.remove("no-scroll");
      revealInView();
    }, 2200);
  });
  // safety: never lock scroll forever
  setTimeout(function () {
    document.body.classList.remove("no-scroll");
    var p = document.getElementById("preloader");
    if (p) p.classList.add("done");
  }, 4000);

  /* ---------- Nav shrink ---------- */
  var nav = document.getElementById("nav");
  function onScrollNav() {
    if (window.scrollY > 60) nav.classList.add("shrink");
    else nav.classList.remove("shrink");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("mobileMenu");
  if (toggle) {
    toggle.addEventListener("click", function () {
      mobile.classList.toggle("open");
      document.body.classList.toggle("no-scroll");
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("open");
        document.body.classList.remove("no-scroll");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = [];
  function collectReveals() {
    revealEls = Array.prototype.slice.call(
      document.querySelectorAll(".reveal, .line-mask")
    );
  }
  function revealInView() {
    var vh = window.innerHeight;
    revealEls.forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.88 && r.bottom > 0) {
        el.classList.add("is-visible");
      }
    });
  }
  collectReveals();

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    window.addEventListener("scroll", revealInView, { passive: true });
    revealInView();
  }

  /* ---------- Parallax on media ---------- */
  var parallaxEls = Array.prototype.slice.call(
    document.querySelectorAll("[data-parallax] img")
  );
  var ticking = false;
  function parallax() {
    var vh = window.innerHeight;
    parallaxEls.forEach(function (img) {
      var rect = img.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      var progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -1..1
      var shift = progress * -36; // px
      img.style.transform = "translate3d(0," + shift + "px,0) scale(1.02)";
    });
    ticking = false;
  }
  function requestParallax() {
    if (!ticking) {
      window.requestAnimationFrame(parallax);
      ticking = true;
    }
  }
  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener("resize", requestParallax);
  parallax();

  /* ---------- Hero fade on scroll ---------- */
  var heroContent = document.querySelector(".hero-content");
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (y < window.innerHeight && heroContent) {
      var o = 1 - y / (window.innerHeight * 0.75);
      heroContent.style.opacity = Math.max(o, 0);
      heroContent.style.transform = "translateY(" + y * 0.25 + "px)";
    }
  }, { passive: true });

  /* ---------- Video fallback ---------- */
  document.querySelectorAll("video").forEach(function (v) {
    v.addEventListener("error", function () {
      var fb = document.querySelector(".hero-fallback");
      if (fb && v.closest(".hero")) {
        v.style.display = "none";
        fb.style.display = "block";
      }
    });
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  });

  /* ============================================================
     MENU DATA
     ============================================================ */
  var MENU = {
    "À partager": [
      ["Rillettes de saumon", "Caviar, fenouil frais, citron, crème légère, pain toasté", "17 000"],
      ["Tempura de gambas", "Crevettes tempura croustillantes, sauce El Padrino", "19 000"],
      ["Guacamole maison", "Avocat crémeux au citron vert, coriandre, pointe de piment", "10 000"],
      ["Bruschetta burrata & tomates marinées", "Pain grillé, burrata fondante, balsamique, basilic frais", "15 000"],
      ["Quiche saumon et chèvre", "Fondante et dorée, sur pâte croustillante", "16 000"],
      ["Artichaut grillé & pastrami", "Sauce moutarde au parmesan, éclats de pastrami, herbes fraîches", "14 000"]
    ],
    "Salades": [
      ["Salade fraîcheur au saumon", "Gravlax à la betterave, crevettes, avocat, agrumes, artichauts", "19 000"],
      ["Salade César El Padrino", "Poulet croustillant, œuf mollet, parmesan, pastrami, croûtons dorés", "18 000"],
      ["Salade burrata", "Burrata crémeuse, tomates cerises marinées, basilic, réduction balsamique", "17 000"],
      ["Salade italienne", "Jeunes pousses, burrata, jambon serrano, artichauts marinés", "20 000"],
      ["Salade d'endives & roquefort", "Endives croquantes, roquefort, noix, vinaigrette au xérès", "21 000"]
    ],
    "Entrées froides": [
      ["Caviar (50g) & accompagnements", "Accompagnements classiques, servi avec un shot de vodka", "85 000"],
      ["Ceviche de poisson blanc", "Leche de tigre, mangue, coriandre, oignon rouge, cacahuètes, kiwi", "16 000"],
      ["Ceviche saumon & fruit de la passion", "Leche de tigre passion, avocat, chips de tapioca, jus de kiwi", "18 000"],
      ["Sashimi de saumon à la betterave", "Gravlax de saumon, sauce soja, ciboulette fraîche", "19 000"],
      ["Carpaccio de mérou", "Caviar d'Aquitaine, huile d'olive vierge, citron frais, ciboulette", "21 000"],
      ["Carpaccio de bœuf", "Filet finement tranché, roquette, parmesan, câpres, huile d'olive", "16 000"],
      ["Tartare de bœuf et frites", "Bœuf coupé au couteau, assaisonnement maison, croustillant de parmesan", "20 000"]
    ],
    "Entrées chaudes": [
      ["Cuisses de grenouilles à la parisienne", "Beurre, ail, persil", "17 000"],
      ["Escargots de Bourgogne", "Gratinés au beurre, persil et ail frais", "18 000"],
      ["Os à moelle rôti", "Sauce gribiche maison, pain toasté", "18 000"]
    ],
    "Les signatures": [
      ["Gambas roll", "Mini pains briochés, crevettes crémeuses, citron, beurre à l'ail", "22 000"],
      ["Gentleman croque à la truffe noire", "Pain toasté, pastrami fumé, comté affiné, truffe noire", "22 000"],
      ["Club sandwich", "Poulet, pastrami fumé, sauce crémeuse, frites et cornichons", "18 000"],
      ["El Padrino burger", "Bœuf & canard maturés, pastrami, comté, sauce aux figues, pain brioché", "26 000"],
      ["Sando de bœuf", "Pain doré croustillant, cœur de bœuf tendre, sauce Café de Paris", "21 000"]
    ],
    "Poissons": [
      ["Pavé de bar à la provençale", "Poêlé à l'huile d'olive, sauce provençale", "21 000"],
      ["Saumon écossais au feu de bois", "Grillé au feu de bois, garniture de saison, sauce délicate", "31 000"],
      ["Sole meunière", "Beurre noisette, citron, persil, pommes de terre fondantes", "23 000"],
      ["Camarones grillées au feu de bois", "Camarones marinés, sauce vierge, garniture de saison", "35 000"],
      ["Poulpe grillé", "Pommes de terre sautées, sauce citron-moutarde, herbes fraîches", "19 000"]
    ],
    "Viandes": [
      ["Chateaubriand de filet de bœuf", "Sauce au poivre, purée de pommes de terre", "29 000"],
      ["Entrecôte de bœuf", "Frites, salade, sauce au choix : poivre vert, béarnaise ou champignons", "38 000"],
      ["Tomahawk de bœuf · 1,2 kg", "Pour 2 personnes · 2 sauces & 2 accompagnements au choix", "155 000"],
      ["Côte de veau à la truffe", "Crème à la truffe", "49 000"],
      ["Joue de bœuf fondante", "Purée de pommes de terre, jus corsé, ail et herbes", "38 000"],
      ["Steak frites sauce Café de Paris", "Châteaubriand grillé, frites croustillantes", "32 000"],
      ["Carré d'agneau aux herbes de Provence", "Carré d'agneau tendre mariné aux herbes de Provence", "35 000"]
    ],
    "Volailles": [
      ["Cordon bleu El Padrino", "Poulet, pastrami fumé, fromage, servi avec frites", "21 000"],
      ["Confit de canard · 36h", "Oignons caramélisés, gelée de griottes, jus corsé, purée", "28 000"],
      ["Blanc de poulet grillé", "Sauce aïoli, frites, salade, sauce citron-moutarde", "22 000"]
    ],
    "Pâtes": [
      ["Capricciosa aux langoustes", "Sauce rosée, langoustes, parmesan fondant", "26 000"],
      ["Capricciosa aux fruits de mer", "Poulpe, crevettes, encornets, sauce citron", "22 000"],
      ["Capricciosa boulettes bolognaise", "Boulettes de bœuf, sauce tomate, parmesan", "19 000"]
    ],
    "Desserts": [
      ["Profiteroles El Padrino", "Ganache caramel, praliné, sauces chocolat & caramel, glace vanille", "10 000"],
      ["Tiramisu café ou mangue", "Tiramisu classique au café ou à la mangue", "10 000"],
      ["Mille-feuille", "Vanille de Madagascar, caramel beurre salé", "10 000"],
      ["Pavlova exotique", "Meringue, mascarpone, crème citron, mangue, ananas", "9 000"],
      ["Mousse au chocolat", "Chocolat noir 70%, croustillant chocolat-caramel", "10 000"],
      ["Forêt noire El Padrino", "Ganache vanille, biscuit moelleux, griottines", "10 000"],
      ["Baba au rhum El Padrino", "Ganache montée vanille, rhum flambé", "14 000"]
    ]
  };

  var tabsEl = document.getElementById("menuTabs");
  var gridEl = document.getElementById("menuGrid");
  var categories = Object.keys(MENU);

  categories.forEach(function (cat, i) {
    var b = document.createElement("button");
    b.className = "menu-tab" + (i === 0 ? " active" : "");
    b.textContent = cat;
    b.addEventListener("click", function () {
      document.querySelectorAll(".menu-tab").forEach(function (t) { t.classList.remove("active"); });
      b.classList.add("active");
      renderMenu(cat);
    });
    tabsEl.appendChild(b);
  });

  function renderMenu(cat) {
    gridEl.innerHTML = "";
    MENU[cat].forEach(function (item, i) {
      var el = document.createElement("div");
      el.className = "menu-item";
      el.innerHTML =
        '<div class="mi-name">' + item[0] + "</div>" +
        '<div class="mi-price">' + item[2] + "</div>" +
        '<div class="mi-desc">' + item[1] + "</div>";
      gridEl.appendChild(el);
      setTimeout(function () { el.classList.add("in"); }, 40 + i * 55);
    });
  }
  renderMenu(categories[0]);

  /* ---------- Reservation form ---------- */
  var form = document.getElementById("reserveForm");
  if (form) {
    var WHATSAPP_NUMBER = "2250716161616"; // +225 07 16 16 16 16
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("formNote");
      var nom = form.nom.value.trim();
      var tel = form.tel.value.trim();
      var date = form.date.value;
      var convives = form.convives.value;

      var jolieDate = date;
      if (date && date.indexOf("-") !== -1) {
        var p = date.split("-");
        jolieDate = p[2] + "/" + p[1] + "/" + p[0];
      }

      var msg =
        "Bonjour El Padrino, je souhaite reserver une table.\n\n" +
        "Nom : " + nom + "\n" +
        "Telephone : " + tel + "\n" +
        "Date : " + (jolieDate || "a preciser") + "\n" +
        "Convives : " + convives;

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
      window.open(url, "_blank");

      note.textContent = "Redirection vers WhatsApp pour confirmer votre reservation...";
      note.style.color = "var(--accent-2)";
    });
  }
})();
