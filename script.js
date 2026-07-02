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

  /* ---------- Cave & Bar (vins, spiritueux, cocktails) ----------
     Items with a 4th value carry two prices: [nom, precision, verre, bouteille] */
  var CAVE = {
    "Champagnes": [
      ["Moët & Chandon", "Brut", "90 000"],
      ["Billecart-Salmon", "Brut", "95 000"],
      ["Billecart-Salmon", "Demi-sec", "95 000"],
      ["Billecart-Salmon", "Rosé", "125 000"],
      ["Billecart-Salmon Sous-Bois", "Brut", "145 000"],
      ["Laurent-Perrier", "Demi-sec", "90 000"],
      ["Laurent-Perrier", "Magnum, brut", "165 000"],
      ["Veuve Clicquot", "Brut", "110 000"],
      ["Ruinart", "Brut", "120 000"],
      ["Ruinart", "Blanc de Blancs", "190 000"],
      ["Dom Pérignon", "", "320 000"],
      ["Cristal Louis Roederer", "", "400 000"]
    ],
    "Vins rouges": [
      ["Haut-Médoc", "Château d'Arcins", "48 000"],
      ["Margaux", "Kid d'Arsac", "48 000"],
      ["Saint-Julien", "Pavillon du Glana", "53 000"],
      ["Margaux", "La Sirène de Giscours", "72 000"],
      ["Pessac-Léognan", "Le Comte de Malartic", "75 000"],
      ["Saint-Julien", "Connétable de Talbot", "90 000"],
      ["Moulis-en-Médoc", "Château Chasse-Spleen", "110 000"],
      ["Haut-Médoc", "Château La Lagune", "160 000"],
      ["Margaux", "Château Giscours", "190 000"],
      ["Saint-Julien", "Château Talbot", "230 000"],
      ["Pauillac", "Château Latour", "750 000"],
      ["Pauillac", "Château Mouton Rothschild", "880 000"],
      ["Saint-Émilion Grand Cru", "Château Martinet", "45 000"],
      ["Pomerol", "Fugue de Nénin", "75 000"],
      ["Émilien", "Château Le Puy", "110 000"],
      ["Saint-Émilion 1er Cru Classé", "Château Smith Haut-Lafitte", "235 000"],
      ["Saint-Émilion 1er Cru Classé", "Château Angélus", "380 000"],
      ["Saint-Émilion 1er Cru Classé", "Château Cheval Blanc", "600 000"],
      ["Saint-Émilion 1er Cru Classé", "Château Ausone", "850 000"],
      ["Bourgogne Pinot Noir", "J. Moreau & Fils", "42 000"],
      ["Mercurey La Framboisière", "D. Faiveley", "73 000"],
      ["Gevrey-Chambertin", "Louis Latour", "145 000"],
      ["Beaune 1er Cru Clos des Mouches", "J. Drouhin", "290 000"],
      ["Côtes du Rhône", "Gabriel Meffre Laurus", "45 000"],
      ["Châteauneuf-du-Pape", "Clos de l'Oratoire", "150 000"],
      ["Terrasses du Larzac", "Domaine du Plan de l'Homme", "55 000"],
      ["La Clape", "Château l'Hospitalet, G. Bertrand", "80 000"],
      ["Minervois La Livinière", "Clos d'Ora, G. Bertrand", "250 000"]
    ],
    "Vins blancs": [
      ["Gewurztraminer", "D. de Colmar, Alsace", "43 000"],
      ["Riesling Grand Cru", "D. G. Lorentz, Alsace", "65 000"],
      ["Sancerre", "Joseph Mellot, Loire", "48 000"],
      ["Blanc Fumé", "Pascal Jolivet, Loire", "45 000"],
      ["Pur Sang", "D. Didier Dagueneau, Loire", "120 000"],
      ["Silex", "D. Didier Dagueneau, Loire", "160 000"],
      ["Moscato d'Asti Solare", "Marrone, Italie", "45 000"],
      ["Rimapère", "E. de Rothschild, Nouvelle-Zélande", "38 000"],
      ["Mâcon Village", "Antonin Rodet, Bourgogne", "40 000"],
      ["Chablis", "La Grande Couronne", "45 000"],
      ["Pouilly-Fuissé", "D. Louis Latour", "72 000"],
      ["Chablis 1er Cru", "Montée de Tonnerre", "90 000"],
      ["Meursault", "Joseph Drouhin", "155 000"],
      ["Corton-Charlemagne Grand Cru", "Louis Latour", "280 000"],
      ["Beaune 1er Cru Clos des Mouches", "Joseph Drouhin", "290 000"]
    ],
    "Vins rosés": [
      ["Côtes de Provence", "Whispering Angel", "42 000"],
      ["Côtes de Provence", "Château d'Esclans", "55 000"],
      ["Clos du Temple", "AOP Languedoc Cabrières", "250 000"]
    ],
    "Au verre": [
      ["Moët", "Champagne brut", "13 000"],
      ["Billecart", "Champagne demi-sec", "16 000"],
      ["Côtes du Rhône", "Belleruche, M. Chapoutier, rouge", "8 000"],
      ["Saint-Julien", "Pavillon de Glana, rouge", "13 000"],
      ["Moscato d'Asti", "Solaris Marrone, blanc", "10 000"],
      ["Chablis", "La Grande Couronne, blanc", "12 000"],
      ["Côtes de Provence", "Irrésistible, D. de la Croix, rosé", "8 000"]
    ],
    "Cocktails": [
      ["El Padrino", "Scotch whisky, amaretto, angostura bitter", "14 000"],
      ["Al Capone", "Vodka, liqueur de café, amaretto, espresso", "14 000"],
      ["Dolce Vita", "Gin, triple sec, eau de rose, pamplemousse, fraise", "14 000"],
      ["Giulietta", "Cognac, champagne, angostura, orange", "14 000"],
      ["Havanito", "Rhum blanc, rhum brun, orange, cola, cannelle", "14 000"],
      ["Don Vito", "Tequila, rhum brun, triple sec, orgeat, limonade", "14 000"],
      ["Vendetta", "Cognac, amaretto, cannelle, bissap", "14 000"],
      ["Basil Smash", "Cocktail classique", "11 000"],
      ["Aperol Spritz", "Cocktail classique", "11 000"],
      ["Negroni", "Cocktail classique", "11 000"],
      ["Old Fashioned", "Cocktail classique", "11 000"],
      ["Whisky Sour", "Cocktail classique", "11 000"],
      ["Mojito", "Cocktail classique", "11 000"],
      ["Margarita", "Cocktail classique", "11 000"],
      ["Pornstar Martini", "Cocktail classique", "11 000"]
    ],
    "Sans alcool": [
      ["Nino", "Kiwi, passion, ananas, citron", "8 000"],
      ["Diva", "Passion, eau de rose, fraise, citron", "8 000"],
      ["Soprano", "Basilic, menthe, citron, kiwi, passion, gingembre", "8 000"],
      ["Violetta", "Bissap, orange, passion, fraise", "8 000"],
      ["Delicia", "Noisette, caramel, chocolat, café, chantilly", "8 000"],
      ["Softs", "Coca-Cola, Sprite, Schweppes, Red Bull, San Bitter", "5 000"],
      ["Eaux", "Kirène plate ou gazeuse, Thonon, Vals", "4 000"]
    ],
    "Whiskies": [
      ["Chivas Regal 12 ans", "Blended scotch", "11 000", "95 000"],
      ["Chivas XV", "Blended scotch", "15 000", "120 000"],
      ["Chivas Regal 18", "Blended scotch", "16 000", "150 000"],
      ["Chivas Ultis", "Blended scotch", "28 000", "320 000"],
      ["J.W Black", "Blended scotch", "11 000", "80 000"],
      ["J.W Double Black", "Blended scotch", "12 000", "100 000"],
      ["J.W Gold Reserve", "Blended scotch", "14 000", "120 000"],
      ["J.W Platinum", "Blended scotch", "22 000", "210 000"],
      ["J.W Blue Label", "Blended scotch", "35 000", "450 000"],
      ["Singleton 12", "Single malt", "12 000", "120 000"],
      ["Talisker Storm", "Single malt", "12 000", "100 000"],
      ["Cragganmore 12", "Single malt", "16 000", "155 000"],
      ["Highland Park 12", "Single malt", "16 000", "160 000"],
      ["Highland Park 18", "Single malt", "35 000", "350 000"],
      ["Glenfarclas 10", "Single malt", "12 000", "120 000"],
      ["Glenfarclas 12", "Single malt", "15 000", "150 000"],
      ["Glenfarclas 15", "Single malt", "22 000", "210 000"],
      ["Macallan 12", "Single malt", "18 000", "190 000"],
      ["Macallan 15", "Single malt", "30 000", "320 000"],
      ["Macallan 18", "Single malt", "60 000", "650 000"],
      ["Macallan Rare Cask", "Single malt", "60 000", "650 000"],
      ["Oban 14", "Single malt", "18 000", "150 000"],
      ["Caol Ila 12", "Single malt", "15 000", "150 000"],
      ["Glenlivet 18", "Single malt", "30 000", "320 000"],
      ["Glenmorangie Lasanta 12 ans", "Single malt", "11 000", "90 000"],
      ["Glenmorangie Original 14 ans", "Single malt", "12 000", "100 000"],
      ["Glenmorangie Original 16 ans", "Single malt", "15 000", "150 000"],
      ["Glenmorangie Signet", "Single malt", "30 000", "250 000"],
      ["Chieftains 2000", "Single malt", "40 000", "400 000"],
      ["Fettercairn 28", "Single malt", "90 000"],
      ["Redbreast 12 ans", "Irish whiskey", "12 000", "120 000"],
      ["Redbreast 15 ans", "Irish whiskey", "21 000", "230 000"],
      ["Jack Daniel's N°7", "Bourbon & Tennessee", "9 000", "85 000"],
      ["Jack Daniel's Honey", "Bourbon & Tennessee", "8 000", "80 000"],
      ["Jack Daniel's Single Barrel", "Bourbon & Tennessee", "12 000", "120 000"],
      ["Bulleit Rye", "Bourbon & Tennessee", "11 000", "95 000"],
      ["Duke Bourbon", "Bourbon & Tennessee", "16 000", "140 000"],
      ["Nikka Days", "Whisky japonais", "12 000", "100 000"],
      ["Nikka Super", "Whisky japonais", "12 000", "120 000"]
    ],
    "Spiritueux": [
      ["Bombay Sapphire", "Gin", "8 000", "85 000"],
      ["Tanqueray 10", "Gin", "10 000", "110 000"],
      ["Gin Mare", "Gin", "10 000", "110 000"],
      ["Hendrick's", "Gin", "12 000", "130 000"],
      ["Monkey 47", "Gin", "15 000", "130 000"],
      ["Belvedere", "Vodka", "10 000", "95 000"],
      ["Cîroc", "Vodka", "11 000", "110 000"],
      ["Grey Goose", "Vodka", "11 000", "100 000"],
      ["Plantation XO Barbados", "Rhum", "12 000", "120 000"],
      ["Havana 7", "Rhum", "9 000", "90 000"],
      ["Havana Selección del Maestro", "Rhum", "12 000", "110 000"],
      ["Diplomático", "Rhum", "11 000", "100 000"],
      ["Clément XO", "Rhum", "14 000", "150 000"],
      ["Zacapa Centenario Solera 23", "Rhum", "15 000", "180 000"],
      ["Depaz 2002", "Rhum", "18 000", "200 000"],
      ["Patrón Silver", "Téquila", "11 000", "130 000"],
      ["Patrón Añejo", "Téquila", "12 000", "150 000"],
      ["Patrón El Alto", "Téquila", "25 000", "280 000"],
      ["Volcán Reposado", "Téquila", "13 000", "120 000"],
      ["Volcán X.A", "Téquila", "30 000", "300 000"],
      ["Mahani Mezcal", "Mezcal", "15 000", "150 000"],
      ["Clase Azul Reposado", "Téquila", "35 000", "400 000"]
    ],
    "Cognacs": [
      ["ABK6 VS", "Cognac", "10 000", "90 000"],
      ["ABK6 VSOP", "Cognac", "14 000", "120 000"],
      ["Hennessy VS", "Cognac", "10 000", "100 000"],
      ["Hennessy VSOP", "Cognac", "15 000", "130 000"],
      ["Hennessy XO", "Cognac", "40 000", "400 000"],
      ["Tesseron XO Ovation", "Cognac", "15 000", "140 000"],
      ["Tesseron XO Tradition", "Cognac", "20 000", "180 000"],
      ["Laubade Signature", "Armagnac", "10 000", "80 000"],
      ["Laubade VSOP", "Armagnac", "12 000", "100 000"],
      ["Laubade XO", "Armagnac", "18 000", "180 000"]
    ],
    "Apéritifs & digestifs": [
      ["Pastis Ricard", "Apéritif", "6 000"],
      ["Suze", "Apéritif", "5 000"],
      ["Martini rouge ou blanc", "Apéritif", "6 000"],
      ["Campari", "Apéritif", "6 000"],
      ["Aperol", "Apéritif", "6 000"],
      ["Arak Kefraya", "Apéritif", "6 000"],
      ["Porto Offley blanc", "Apéritif", "6 000"],
      ["Porto Sandeman Ruby", "Apéritif", "6 000"],
      ["Porto Taylor's 10 ans", "Apéritif", "11 000"],
      ["Porto Taylor's 20 ans", "Apéritif", "15 000"],
      ["Get 27 ou Get 31", "Digestif", "5 500"],
      ["Limoncello", "Digestif", "5 500"],
      ["Jägermeister", "Digestif", "5 500"],
      ["Amaretto", "Digestif", "5 500"],
      ["Bailey's", "Digestif", "6 500"],
      ["Cointreau", "Digestif", "8 000"],
      ["Fernet Branca", "Digestif", "8 000"],
      ["Grappa Serago", "Digestif", "8 000"],
      ["Grand Marnier", "Digestif", "9 000"]
    ],
    "Bières & softs": [
      ["Castel", "Bière", "5 000"],
      ["Heineken", "Bière", "6 000"],
      ["Corona", "Bière", "6 000"],
      ["Desperados", "Bière", "5 000"],
      ["Coca-Cola ou Coca Zéro", "Soft", "5 000"],
      ["Sprite", "Soft", "5 000"],
      ["Schweppes Tonic ou Ginger Beer", "Soft", "5 000"],
      ["Red Bull", "Soft", "5 500"],
      ["San Bitter", "Soft", "5 000"],
      ["Espresso ou décaféiné", "Boisson chaude", "4 000"],
      ["Thés & infusions by Tchaba", "Boisson chaude", "5 000"],
      ["Latte ou cappuccino", "Boisson chaude", "5 000"],
      ["Grog avec alcool", "Boisson chaude", "9 000"],
      ["Eaux Kirène, Thonon, Vals", "Eau", "4 000"]
    ],
    "Cigares": [
      ["Cohiba", "Habanos, La Havane, Cuba"],
      ["Montecristo", "Habanos, La Havane, Cuba"],
      ["Romeo y Julieta", "Habanos, La Havane, Cuba"],
      ["H. Upmann", "Habanos, La Havane, Cuba"],
      ["Hoyo de Monterrey", "Habanos, La Havane, Cuba"],
      ["Plasencia", "Nicaragua"],
      ["Alma Fuerte", "Plasencia, Nicaragua"],
      ["Sélection du moment", "Habanos et cigares du Nouveau Monde selon arrivage"]
    ]
  };

  var DATASETS = [
    { label: "Cuisine", data: MENU, note: "Prix en francs CFA · service continu de 12h00 à la fermeture" },
    { label: "Cave & Bar", data: CAVE, note: "Prix en francs CFA · verre / bouteille lorsque deux prix sont indiqués" }
  ];

  var switchEl = document.getElementById("menuSwitch");
  var tabsEl = document.getElementById("menuTabs");
  var gridEl = document.getElementById("menuGrid");
  var noteEl = document.getElementById("menuNote");

  var currentNote = "";
  var CIGAR_NOTE = "Cave à cigares. Modules et prix communiqués par votre hôte, selon arrivage.";

  function renderMenu(data, cat) {
    gridEl.innerHTML = "";
    noteEl.textContent = (cat === "Cigares") ? CIGAR_NOTE : currentNote;
    data[cat].forEach(function (item, i) {
      var priceHTML = "";
      if (item[2]) {
        priceHTML = '<div class="mi-price">' + item[2] +
          (item[3] ? " <span class='mi-b'>/ " + item[3] + "</span>" : "") + "</div>";
      }
      var desc = item[1] ? '<div class="mi-desc">' + item[1] + "</div>" : "";
      var el = document.createElement("div");
      el.className = "menu-item";
      el.innerHTML = '<div class="mi-name">' + item[0] + "</div>" + priceHTML + desc;
      gridEl.appendChild(el);
      setTimeout(function () { el.classList.add("in"); }, 40 + i * 45);
    });
  }

  function renderTabs(data) {
    tabsEl.innerHTML = "";
    Object.keys(data).forEach(function (cat, i) {
      var b = document.createElement("button");
      b.className = "menu-tab" + (i === 0 ? " active" : "");
      b.textContent = cat;
      b.addEventListener("click", function () {
        tabsEl.querySelectorAll(".menu-tab").forEach(function (t) { t.classList.remove("active"); });
        b.classList.add("active");
        renderMenu(data, cat);
      });
      tabsEl.appendChild(b);
    });
  }

  function selectDataset(idx) {
    var set = DATASETS[idx];
    switchEl.querySelectorAll("button").forEach(function (b, i) {
      b.classList.toggle("active", i === idx);
    });
    currentNote = set.note;
    renderTabs(set.data);
    renderMenu(set.data, Object.keys(set.data)[0]);
  }

  DATASETS.forEach(function (set, i) {
    var b = document.createElement("button");
    b.textContent = set.label;
    b.addEventListener("click", function () { selectDataset(i); });
    switchEl.appendChild(b);
  });
  selectDataset(0);

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
      var heure = form.heure.value;
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
        "Heure : " + (heure || "a preciser") + "\n" +
        "Convives : " + convives;

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
      window.open(url, "_blank");

      note.textContent = "Redirection vers WhatsApp pour confirmer votre reservation...";
      note.style.color = "var(--accent-2)";
    });
  }
})();
