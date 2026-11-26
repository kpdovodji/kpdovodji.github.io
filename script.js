/*
  Affichage du site à partir de data.js.
  Chaque page HTML contient seulement <body data-page="...">, et ce script construit le contenu.
*/
(function () {
  "use strict";

  var S = window.SITE;
  var LANGS = ["en", "fr"];
  var lang = "en";
  try {
    var saved = window.localStorage.getItem("lang");
    if (LANGS.indexOf(saved) > -1) lang = saved;
  } catch (e) { /* stockage indisponible : on garde l'anglais */ }
  var fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (LANGS.indexOf(fromUrl) > -1) lang = fromUrl;

  var heroAnimated = false;

  /* ---------- Outils ---------- */

  function t(v) {
    if (v == null) return "";
    if (typeof v === "string" || typeof v === "number" || Array.isArray(v)) return v;
    return v[lang] != null ? v[lang] : (v.en != null ? v.en : "");
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function email() { return S.person.emailUser + "@" + S.person.emailDomain; }
  // Adresse affichée sous la forme « kuassi-pierre (dot) dovodji@... » contre le spam ; le lien reste la vraie adresse.
  function emailShown() { return S.person.emailUser.replace(/\./g, " (dot) ") + "@" + S.person.emailDomain; }

  function isExternal(href) { return /^https?:/.test(href); }

  function link(l, cls) {
    var href = l.href;
    var attrs = isExternal(href) || /\.pdf$/i.test(href) ? ' target="_blank" rel="noopener"' : "";
    return '<a class="' + (cls || "doc-link") + '" href="' + esc(href) + '"' + attrs + ">" + esc(t(l.label)) + "</a>";
  }

  function links(list, cls) {
    if (!list || !list.length) return "";
    return '<p class="links">' + list.map(function (l) { return link(l, cls); }).join("") + "</p>";
  }

  var MONTHS = {
    en: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
    fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
  };
  var MONTHS_LONG = {
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
  };

  function parseD(s) {
    var p = String(s).split("-").map(Number);
    return { y: p[0], m: p[1] || null, d: p[2] || null };
  }

  function fmtRange(a, b) {
    var A = parseD(a), B = b ? parseD(b) : null, M = MONTHS[lang];
    if (!A.m) return String(A.y);
    if (!A.d) return MONTHS_LONG[lang][A.m - 1] + " " + A.y;
    var one = function (D) { return D.d + " " + M[D.m - 1] + " " + D.y; };
    if (!B) return one(A);
    if (B.y === A.y && B.m === A.m) return A.d + "–" + B.d + " " + M[A.m - 1] + " " + A.y;
    if (B.y === A.y) return A.d + " " + M[A.m - 1] + " – " + B.d + " " + M[B.m - 1] + " " + A.y;
    return one(A) + " – " + one(B);
  }

  function monthYear(s) {
    var D = parseD(s);
    return D.m ? MONTHS[lang][D.m - 1] + " " + D.y : String(D.y);
  }

  function today() {
    var d = new Date();
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  function isUpcoming(ev) {
    var end = ev.end || ev.start;
    if (end.length === 7) end += "-31";
    if (end.length === 4) end += "-12-31";
    return end >= today();
  }

  function phdYearText() {
    var start = parseD(S.person.phdStart);
    var now = new Date();
    var months = (now.getFullYear() - start.y) * 12 + (now.getMonth() + 1 - start.m);
    var n = Math.max(1, Math.min(4, Math.floor(months / 12) + 1));
    var en = ["first-year", "second-year", "third-year", "fourth-year"];
    var fr = ["première année", "deuxième année", "troisième année", "quatrième année"];
    return lang === "fr" ? fr[n - 1] : en[n - 1];
  }

  function sortedTalks() {
    return S.talks.slice().sort(function (a, b) { return a.start < b.start ? 1 : -1; });
  }

  /* ---------- Icônes (dessinées à la main, trait de la couleur du texte) ---------- */

  var ICON_PATHS = {
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    book: '<path d="M4 4.5h10.5A3.5 3.5 0 0 1 18 8v12H7.5A3.5 3.5 0 0 1 4 16.5z"/><path d="M4 16.5A3.5 3.5 0 0 1 7.5 13H18"/>',
    person: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.5a7.2 7.2 0 0 1 14.4 0"/>',
    code: '<path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.6 5.5l-3.2 13"/>',
    wave: '<path d="M2.5 9.5c3.2-4.6 6.3-4.6 9.5 0s6.3 4.6 9.5 0"/><path d="M2.5 16c3.2-4.6 6.3-4.6 9.5 0s6.3 4.6 9.5 0"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    moon: '<path d="M20 14.6A8.2 8.2 0 0 1 9.4 4 8.2 8.2 0 1 0 20 14.6z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };

  function icon(name) {
    return '<svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICON_PATHS[name] + "</svg>";
  }

  // Même dessin que favicon.svg : une trace satellitaire sur une courbe de niveau
  var BRAND_MARK = '<svg class="brand-mark" viewBox="0 0 32 32" width="26" height="26" aria-hidden="true" focusable="false"><rect width="32" height="32" rx="8" fill="#0F2C44"/><path d="M5 22c6-1 8-9 13-9s6 6 9 5" fill="none" stroke="#7CC6CF" stroke-width="2" stroke-linecap="round"/><g fill="#F2B33D"><circle cx="9" cy="27" r="1.6"/><circle cx="12" cy="20" r="1.6"/><circle cx="15" cy="13" r="1.6"/><circle cx="18" cy="6" r="1.6"/></g></svg>';

  function isDark() { return document.documentElement.classList.contains("dark"); }

  /* ---------- Textes de l'interface ---------- */

  var UI = {
    nav: [
      { id: "home", href: "index.html", label: { en: "About", fr: "Accueil" } },
      { id: "cv", href: "cv.html", label: { en: "CV", fr: "CV" } },
      { id: "research", href: "research.html", label: { en: "Research", fr: "Recherche" } },
      { id: "publications", href: "publications.html", label: { en: "Publications", fr: "Publications" } },
      { id: "software", href: "software.html", label: { en: "Software", fr: "Logiciels" } },
      { id: "talks", href: "conferences.html", label: { en: "Talks", fr: "Conférences" } },
      { id: "teaching", href: "teaching.html", label: { en: "Teaching", fr: "Enseignement" } },
      { id: "contact", href: "contact.html", label: { en: "Contact", fr: "Contact" } }
    ],
    skip: { en: "Skip to content", fr: "Aller au contenu" },
    menu: { en: "Menu", fr: "Menu" },
    langButton: { en: "FR", fr: "EN" },
    langLabel: { en: "Afficher le site en français", fr: "Show the site in English" },
    darkLabel: { en: "Dark mode", fr: "Mode sombre" },
    seeResearch: { en: "My research", fr: "Ma recherche" },
    about: { en: "Short bio", fr: "Présentation" },
    topics: { en: "Research topics", fr: "Thèmes de recherche" },
    inBrief: { en: "Research in brief", fr: "Ma recherche en bref" },
    latest: { en: "Recent and upcoming", fr: "Récemment et à venir" },
    allTalks: { en: "All talks and conferences", fr: "Toutes les conférences" },
    upcoming: { en: "Upcoming", fr: "À venir" },
    roles: {
      talk: { en: "Talk", fr: "Exposé" },
      participant: { en: "Participant", fr: "Participation" }
    },
    types: {
      conference: { en: "Conference", fr: "Conférence" },
      workshop: { en: "Workshop", fr: "Workshop" },
      seminar: { en: "Seminar", fr: "Séminaire" },
      school: { en: "School", fr: "École" }
    },
    footerRole: { en: "PhD student at IMB, Université Bourgogne Europe", fr: "doctorant à l'IMB, Université Bourgogne Europe" },
    updated: { en: "Last updated", fr: "Dernière mise à jour" },
    photoAlt: { en: "Portrait of Pierre Dovodji", fr: "Portrait de Pierre Dovodji" },
    pages: {
      cv: { title: { en: "Curriculum vitae", fr: "Curriculum vitae" } },
      research: {
        title: { en: "Research", fr: "Recherche" },
        intro: { en: "My PhD thesis and earlier projects.", fr: "Ma thèse et mes projets précédents." }
      },
      publications: {
        title: { en: "Publications", fr: "Publications" },
        intro: { en: "Papers, theses and reports.", fr: "Articles, mémoires et rapports." }
      },
      software: {
        title: { en: "Software", fr: "Logiciels" },
        intro: { en: "Code that comes out of my research.", fr: "Les codes issus de ma recherche." }
      },
      talks: {
        title: { en: "Talks", fr: "Conférences" },
        intro: { en: "Events where I gave a talk or took part, most recent first.", fr: "Les événements où j'ai présenté mon travail ou auxquels j'ai participé, du plus récent au plus ancien." }
      },
      teaching: {
        title: { en: "Teaching", fr: "Enseignement" },
        intro: {
          en: "As part of my PhD, I teach tutorials (TD) in statistics and mathematics at Université Bourgogne Europe. Course materials are linked below when they are available.",
          fr: "Dans le cadre de ma thèse, j'assure des TD de statistiques et de mathématiques à l'Université Bourgogne Europe. Les documents de cours sont en lien quand ils sont disponibles."
        }
      },
      contact: {
        title: { en: "Contact", fr: "Contact" },
        intro: { en: "The best way to reach me is by email.", fr: "Le plus simple est de m'écrire par e-mail." }
      }
    }
  };

  // La page Software n'apparaît dans le menu que si S.software.show vaut true (voir data.js)
  function navVisible(n) { return n.id !== "software" || (S.software && S.software.show); }

  /* ---------- En-tête, pied de page, cartes ---------- */

  function themeButtonInner() { return icon(isDark() ? "sun" : "moon"); }

  function renderHeader(page) {
    var items = UI.nav.filter(navVisible).map(function (n) {
      var cur = n.id === page ? ' aria-current="page"' : "";
      return '<li><a href="' + n.href + '"' + cur + ">" + esc(t(n.label)) + "</a></li>";
    }).join("");
    var other = lang === "en" ? "fr" : "en";
    return '<a class="skip-link" href="#app">' + esc(t(UI.skip)) + "</a>" +
      '<header class="site-header"><div class="wrap header-inner">' +
      '<a class="brand" href="index.html">' + BRAND_MARK + "<span>" + esc(S.person.name) + "</span></a>" +
      '<nav id="site-nav" class="site-nav" aria-label="Main"><ul>' + items + "</ul></nav>" +
      '<div class="header-tools">' +
      '<button class="tool-btn lang-toggle" type="button" lang="' + other + '" aria-label="' + esc(t(UI.langLabel)) + '">' + esc(t(UI.langButton)) + "</button>" +
      '<button class="tool-btn theme-toggle" type="button" aria-pressed="' + isDark() + '" aria-label="' + esc(t(UI.darkLabel)) + '">' + themeButtonInner() + "</button>" +
      '<button class="tool-btn menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="' + esc(t(UI.menu)) + '">' + icon("menu") + "</button>" +
      "</div></div></header>";
  }

  function renderFooter() {
    return '<footer class="site-footer"><div class="wrap"><p>© ' + new Date().getFullYear() + " " + esc(S.person.name) + ", " +
      esc(t(UI.footerRole)) + ". " + esc(t(UI.updated)) + " " + esc(t(S.updated)) + ".</p></div></footer>";
  }

  function pageHead(key) {
    var p = UI.pages[key];
    return '<header class="page-head"><div class="page-title"><h1>' + esc(t(p.title)) + '</h1><span class="title-rule" aria-hidden="true"></span></div>' +
      (p.intro ? '<p class="lede">' + esc(t(p.intro)) + "</p>" : "") + "</header>";
  }

  // Une section en carte, avec son titre (déjà en texte simple) et son contenu (HTML)
  function card(id, title, body, cls) {
    return '<section class="card' + (cls ? " " + cls : "") + '"' + (title ? ' aria-labelledby="' + id + '"' : "") + ">" +
      (title ? '<h2 id="' + id + '">' + esc(title) + "</h2>" : "") + body + "</section>";
  }

  function button(href, iconName, label, cls) {
    var ext = isExternal(href) ? ' target="_blank" rel="noopener"' : "";
    return '<a class="btn ' + (cls || "btn-soft") + '" href="' + esc(href) + '"' + ext + ">" + icon(iconName) + "<span>" + esc(label) + "</span></a>";
  }

  /* ---------- Accueil ---------- */

  function renderHome() {
    var P = S.person;
    var bio = '<p class="lead">' + esc(t(P.statement)) + "</p>" + t(P.bio).map(function (para) {
      return "<p>" + esc(para.replace("{year}", phdYearText())) + "</p>";
    }).join("");

    var brief = '<ul class="dot-list">' + S.research.brief.map(function (b) {
      return "<li><strong>" + esc(t(b.term)) + "</strong><span>" + esc(t(b.text)) + "</span></li>";
    }).join("") + "</ul>";

    var latest = '<ul class="dot-list">' + sortedTalks().slice(0, 4).map(function (ev) {
      var up = isUpcoming(ev) ? ' <span class="badge">' + esc(t(UI.upcoming)) + "</span>" : "";
      return "<li><strong>" + esc(t(ev.event)) + up + "</strong><span>" + esc(fmtRange(ev.start, ev.end)) + ", " +
        esc(t(UI.roles[ev.role])).toLowerCase() + ", " + esc(t(ev.place)) + "</span></li>";
    }).join("") + '</ul><p class="card-more"><a href="conferences.html">' + esc(t(UI.allTalks)) + "</a></p>";

    var chips = '<ul class="chips" aria-label="' + esc(t(UI.topics)) + '">' + t(P.chips).map(function (c) {
      return '<li class="chip">' + esc(c) + "</li>";
    }).join("") + "</ul>";

    var actions = '<p class="hero-actions">' +
      button("cv.html", "doc", "CV") +
      button("publications.html", "book", t({ en: "Publications", fr: "Publications" })) +
      (P.researchgate ? button(P.researchgate, "person", "ResearchGate") : "") +
      button("https://github.com/" + P.github, "code", "GitHub") +
      button("research.html", "wave", t(UI.seeResearch), "btn-primary") + "</p>";

    var hero = '<section class="card hero-card" aria-labelledby="hero-name">' +
      '<canvas class="hero-canvas" aria-hidden="true"></canvas>' +
      '<div class="hero-grid">' +
      '<div class="hero-photo"><img src="' + esc(P.photo) + '" alt="' + esc(t(UI.photoAlt)) + '" width="240" height="300" ' +
      "onerror=\"this.parentNode.parentNode.classList.add('no-photo');this.parentNode.remove()\"></div>" +
      '<div class="hero-text">' +
      '<h1 id="hero-name">' + esc(P.name) + "</h1>" +
      '<p class="hero-role">' + esc(t(P.role)) + "</p>" +
      '<p class="hero-sub">' + esc(t(P.affiliation)) + "</p>" +
      '<p class="hero-email-line"><a class="hero-email" href="mailto:' + esc(email()) + '">' + icon("mail") + '<span><span class="nw">' + esc(emailShown().split("@")[0]) + '</span><wbr><span class="nw">@' + esc(P.emailDomain) + "</span></span></a></p>" +
      chips + actions +
      "</div></div></section>";

    return '<div class="wrap page page-home">' + hero +
      card("about-h", t(UI.about), '<div class="prose">' + bio + "</div>") +
      '<div class="card-pair">' +
      card("brief-h", t(UI.inBrief), brief) +
      card("latest-h", t(UI.latest), latest) +
      "</div></div>";
  }

  /* ---------- CV ---------- */

  var CVT = {
    toolbarNote: {
      en: "This is the full version of my CV. To get a PDF, choose “Save as PDF” in the print window.",
      fr: "Voici la version complète de mon CV. Pour obtenir un PDF, choisissez « Enregistrer au format PDF » dans la fenêtre d'impression."
    },
    print: { en: "Save as PDF", fr: "Enregistrer en PDF" },
    phd: { en: "PhD project (ongoing)", fr: "Thèse de doctorat (en cours)" },
    title: { en: "Title", fr: "Titre" },
    period: { en: "Period", fr: "Période" },
    institution: { en: "Institution", fr: "Établissement" },
    supervisors: { en: "Supervisors", fr: "Encadrants" },
    summary: { en: "Summary", fr: "Résumé" },
    interests: { en: "Research interests", fr: "Thèmes de recherche" },
    paper: { en: "Paper in preparation", fr: "Article en préparation" },
    talks: { en: "Talks and conferences", fr: "Conférences et exposés" },
    experience: { en: "Research experience", fr: "Expérience de recherche" },
    education: { en: "Education", fr: "Formation" },
    teaching: { en: "Teaching", fr: "Enseignement" },
    outreach: { en: "Outreach", fr: "Médiation scientifique" },
    skills: { en: "Skills", fr: "Compétences" },
    languages: { en: "Languages", fr: "Langues" },
    seminarTalk: { en: "Seminar talk", fr: "Exposé en séminaire" },
    contributedTalk: { en: "Talk", fr: "Exposé" },
    hoursUnit: { en: "h", fr: "h" }
  };

  function cvSection(title, body) {
    return '<section class="cv-section"><div class="cv-bar" aria-hidden="true"></div><h2>' + esc(title) + "</h2></section>" + body;
  }

  function cvItem(hint, html) {
    return '<div class="cv-item"><div class="cv-hint">' + esc(hint) + '</div><div class="cv-body">' + html + "</div></div>";
  }

  function renderCV() {
    var P = S.person, R = S.research;
    var th = R.thesis;

    var head = '<header class="cv-head"><div class="cv-id"><p class="cv-name">' + esc(P.nameCV) + "</p>" +
      '<p class="cv-title">' + esc(t(P.role)) + "</p></div>" +
      '<address class="cv-contact">' + esc(P.lab.replace(" (IMB, UMR CNRS 5584)", "")) + "<br>" +
      esc(P.address[0]) + "<br>" + esc(P.address[1]) + "<br>" +
      '<a href="mailto:' + esc(email()) + '">' + esc(emailShown()) + "</a><br>" +
      '<a href="https://' + esc(P.website) + '">' + esc(P.website) + "</a><br>" +
      '<a href="https://github.com/' + esc(P.github) + '" target="_blank" rel="noopener">github.com/' + esc(P.github) + "</a>" +
      "</address>" +
      '<img class="cv-photo" src="' + esc(P.photo) + '" alt="" width="80" onerror="this.remove()">' +
      "</header>";

    var phd = cvSection(t(CVT.phd),
      cvItem(t(CVT.title), "<em>" + esc(t(th.title)) + "</em>") +
      cvItem(t(CVT.period), esc(t(th.period))) +
      cvItem(t(CVT.institution), esc(P.lab) + ", " + esc(P.university) + ", Dijon") +
      cvItem(t(CVT.supervisors), esc(t(th.supervisors))) +
      cvItem(t(CVT.summary), esc(t(th.summary))));

    var interests = cvSection(t(CVT.interests), cvItem("", esc(t(R.interests))));

    var paper = cvSection(t(CVT.paper), S.publications.map(function (p) {
      return cvItem(p.year, esc(p.authors.join(", ")) + ". <em>" + esc(p.title) + ".</em> " + esc(t(p.status)) + ".");
    }).join(""));

    var talks = cvSection(t(CVT.talks), sortedTalks().map(function (ev) {
      var role = ev.role === "talk" ? (ev.type === "seminar" ? t(CVT.seminarTalk) : t(CVT.contributedTalk)) : t(UI.roles.participant);
      var up = isUpcoming(ev) ? ' <span class="cv-tag">' + esc(t(UI.upcoming)) + "</span>" : "";
      var body = (ev.role === "talk" ? "<strong>" + esc(role) + "</strong>" : esc(role)) + ", " + esc(t(ev.event)) + ", " + esc(t(ev.place)) + "." + up;
      if (ev.title) body += '<br><span class="cv-sub">' + esc(t(ev.title)) + "</span>";
      body += links(ev.links, "cv-link");
      return cvItem(monthYear(ev.start), body);
    }).join(""));

    var exp = cvSection(t(CVT.experience), S.experience.map(function (e) {
      return cvItem(t(e.when), "<strong>" + esc(t(e.title)) + "</strong>, <em>" + esc(t(e.where)) + '</em><p class="cv-desc">' + esc(t(e.text)) + "</p>" + links(e.links, "cv-link"));
    }).join(""));

    var edu = cvSection(t(CVT.education), S.education.map(function (e) {
      return cvItem(e.when, "<strong>" + esc(t(e.title)) + "</strong>, <em>" + esc(t(e.where)) + "</em>" +
        (e.grade ? ", <strong>" + esc(t(e.grade)) + "</strong>" : "") + '<p class="cv-desc">' + esc(t(e.text)) + "</p>");
    }).join(""));

    var teach = cvSection(t(CVT.teaching), S.teaching.map(function (y) {
      var lines = y.courses.map(function (c) {
        var parts = [];
        var lvl = t(c.level) + (c.program ? " " + t(c.program) : "");
        parts.push(esc(lvl));
        var s = esc(t(c.subject));
        if (c.hours) s += " (" + c.hours + " " + t(CVT.hoursUnit) + (c.kind ? " " + esc(t(c.kind)) : "") + ")";
        parts.push(s);
        return "<li>" + parts.join(", ") + "</li>";
      }).join("");
      return cvItem(y.year, "<strong>" + esc(y.where) + '</strong><ul class="cv-list">' + lines + "</ul>");
    }).join(""));

    var out = cvSection(t(CVT.outreach), S.outreach.map(function (o) {
      return cvItem(t(o.when), "<strong>" + esc(t(o.title)) + "</strong>, <em>" + esc(o.place) + '</em><p class="cv-desc">' + esc(t(o.text)) + "</p>");
    }).join(""));

    var langLine = S.languages.map(function (l) { return t(l.label) + " (" + t(l.text).charAt(0).toLowerCase() + t(l.text).slice(1) + ")"; }).join(", ");
    var skills = cvSection(t(CVT.skills), S.skills.map(function (s) {
      return cvItem(t(s.label), esc(t(s.text)));
    }).join("") + cvItem(t(CVT.languages), esc(langLine)));


    return '<div class="cv-page">' +
      '<div class="cv-toolbar"><h1>' + esc(t(UI.pages.cv.title)) + "</h1>" +
      '<p class="cv-note">' + esc(t(CVT.toolbarNote)) + "</p>" +
      '<button type="button" class="btn btn-primary cv-print">' + esc(t(CVT.print)) + "</button></div>" +
      '<article class="cv-sheet">' + head + phd + interests + paper + talks + exp + edu + teach + out + skills + "</article>" +
      "</div>";
  }

  /* ---------- Recherche ---------- */

  function entryRow(when, inner) {
    return '<li class="entry"><span class="when">' + esc(when) + "</span><div>" + inner + "</div></li>";
  }

  function renderResearch() {
    var th = S.research.thesis;
    var desc = t(th.description).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var apps = '<div class="mini-grid">' + th.applications.map(function (a) {
      return '<div class="mini"><h3>' + esc(t(a.title)) + "</h3><p>" + esc(t(a.text)) + "</p></div>";
    }).join("") + "</div>";

    var thesis = '<section class="card card-glow thesis-card" aria-labelledby="thesis-h">' +
      '<p class="kicker">' + esc(t({ en: "PhD thesis", fr: "Thèse de doctorat" })) + ", " + esc(t(th.period)) + "</p>" +
      '<h2 id="thesis-h">' + esc(t(th.title)) + "</h2>" +
      '<p class="where">' + esc(t({ en: "Supervised by ", fr: "Sous la direction de " })) + esc(t(th.supervisors)) + "</p>" +
      '<div class="prose">' + desc + "</div>" + apps +
      '<p class="muted note">' + esc(t(th.data)) + "</p></section>";

    var earlier = '<ul class="entries">' + S.experience.map(function (e) {
      return entryRow(t(e.when), "<h3>" + esc(t(e.title)) + "</h3>" +
        '<p class="where">' + esc(t(e.where)) + "</p><p>" + esc(t(e.text)) + "</p>" + links(e.links));
    }).join("") +
      entryRow("", "<h3>" + esc(t({ en: "GitHub projects", fr: "Projets GitHub" })) + "</h3><p>" + esc(t(S.projects.text)) + "</p>" +
        links([{ label: "github.com/" + S.person.github, href: S.projects.href }])) + "</ul>";

    return '<div class="wrap page">' + pageHead("research") + thesis +
      card("earlier-h", t({ en: "Earlier projects", fr: "Projets précédents" }), earlier) + "</div>";
  }

  /* ---------- Publications ---------- */

  function renderPublications() {
    var pubs = '<ul class="entries">' + S.publications.map(function (p) {
      var authors = p.authors.map(function (a) {
        return /Dovodji/.test(a) ? "<strong>" + esc(a) + "</strong>" : esc(a);
      }).join(", ");
      return entryRow(p.year, '<h3 class="pub-title">' + esc(p.title) + "</h3>" +
        '<p class="pub-authors">' + authors + "</p>" +
        '<p class="where"><span class="badge badge-quiet">' + esc(t(p.status)) + "</span> " + esc(t(p.note)) + "</p>" + links(p.links));
    }).join("") + "</ul>";
    var reports = '<ul class="entries">' + S.reports.map(function (r) {
      return entryRow(r.year, '<h3 class="pub-title">' + esc(t(r.title)) + "</h3>" +
        '<p class="where">' + esc(t(r.kind)) + "</p>" + links(r.links));
    }).join("") + "</ul>";
    return '<div class="wrap page">' + pageHead("publications") +
      card("papers-h", t({ en: "Papers", fr: "Articles" }), pubs) +
      card("reports-h", t({ en: "Theses and reports", fr: "Mémoires et rapports" }), reports) + "</div>";
  }

  /* ---------- Logiciels (page cachée tant que S.software.show vaut false) ---------- */

  function renderSoftware() {
    var items = (S.software ? S.software.items : []).map(function (p, i) {
      return '<section class="card" aria-labelledby="sw-' + i + '">' +
        '<h2 id="sw-' + i + '">' + esc(p.name) + (p.status ? ' <span class="badge">' + esc(t(p.status)) + "</span>" : "") + "</h2>" +
        '<div class="prose"><p>' + esc(t(p.text)) + "</p></div>" + links(p.links) + "</section>";
    }).join("");
    return '<div class="wrap page">' + pageHead("software") + items + "</div>";
  }

  /* ---------- Conférences (frise) ---------- */

  function renderTalks() {
    var groups = {};
    var order = [];
    sortedTalks().forEach(function (ev) {
      var y = parseD(ev.start).y;
      if (!groups[y]) { groups[y] = []; order.push(y); }
      groups[y].push(ev);
    });

    var legend = '<ul class="legend" aria-label="' + esc(t({ en: "Legend", fr: "Légende" })) + '">' +
      '<li><span class="mark mark-talk" aria-hidden="true"></span>' + esc(t({ en: "I gave a talk", fr: "J'ai présenté un exposé" })) + "</li>" +
      '<li><span class="mark mark-attended" aria-hidden="true"></span>' + esc(t({ en: "I took part", fr: "J'ai participé" })) + "</li></ul>";

    var body = order.map(function (y) {
      var evs = groups[y].map(function (ev) {
        var up = isUpcoming(ev);
        var cls = "event " + (ev.role === "talk" ? "is-talk" : "is-attended") + (up ? " is-upcoming" : "");
        var html = '<li class="' + cls + '">' +
          '<p class="event-date">' + esc(fmtRange(ev.start, ev.end)) +
          (up ? ' <span class="badge">' + esc(t(UI.upcoming)) + "</span>" : "") + "</p>" +
          "<h3>" + esc(t(ev.event)) + "</h3>" +
          '<p class="event-meta">' + esc(t(UI.types[ev.type])) + ", " + esc(t(ev.place)) + "</p>";
        if (ev.role === "talk") {
          html += '<p class="event-talk"><span class="vh">' + esc(t(UI.roles.talk)) + ". </span>" +
            (ev.title ? "<em>" + esc(t(ev.title)) + "</em>" : esc(t({ en: "Contributed talk", fr: "Exposé" }))) + "</p>";
        } else {
          html += '<p class="vh">' + esc(t(UI.roles.participant)) + "</p>";
        }
        if (ev.details) html += '<p class="event-details">' + esc(t(ev.details)) + "</p>";
        html += links(ev.links);
        return html + "</li>";
      }).join("");
      return card("y" + y, String(y), '<ol class="events">' + evs + "</ol>", "year-card");
    }).join("");

    return '<div class="wrap page">' + pageHead("talks") + legend + body + "</div>";
  }

  /* ---------- Enseignement ---------- */

  function renderTeaching() {
    var years = S.teaching.filter(function (y) { return !y.hideOnTeachingPage; }).map(function (y) {
      var rows = y.courses.map(function (c) {
        var topics = "";
        if (c.topics) {
          var list = t(c.topics);
          if (typeof list[0] === "string") {
            topics = '<p class="topics">' + esc(list.join(", ")) + ".</p>";
          } else {
            topics = '<ul class="syllabus">' + list.map(function (it) {
              var sub = it.sub ? "<ul>" + it.sub.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "";
              return "<li><span>" + esc(it.text) + "</span>" + sub + "</li>";
            }).join("") + "</ul>";
          }
        }
        var kind = c.kind ? t(c.kind) : "";
        var hours = c.hours ? c.hours + " h " + kind : kind.charAt(0).toUpperCase() + kind.slice(1);
        return '<li class="course">' +
          '<div class="course-level"><span class="level">' + esc(t(c.level)) + "</span>" +
          (c.program ? '<span class="program">' + esc(t(c.program)) + "</span>" : "") + "</div>" +
          '<div class="course-main"><h3>' + esc(t(c.subject)) + "</h3>" + topics + links(c.materials) + "</div>" +
          '<div class="course-hours">' + esc(hours) + "</div></li>";
      }).join("");
      return card("t" + y.year, y.year, '<p class="year-where">' + esc(y.where) + '</p><ul class="courses">' + rows + "</ul>");
    }).join("");

    var shown = S.outreach.filter(function (o) { return !o.hideOnTeachingPage; });
    var outreach = shown.length ? card("outreach-h", t({ en: "Outreach and mentoring", fr: "Médiation scientifique et tutorat" }),
      '<ul class="entries">' + shown.map(function (o) {
        return entryRow(t(o.when), "<h3>" + esc(t(o.title)) + "</h3>" +
          '<p class="where">' + esc(o.place) + "</p><p>" + esc(t(o.text)) + "</p>");
      }).join("") + "</ul>") : "";

    return '<div class="wrap page">' + pageHead("teaching") + years + outreach + "</div>";
  }

  /* ---------- Contact ---------- */

  function renderContact() {
    var P = S.person;
    var subject = encodeURIComponent(t({ en: "Message from your website", fr: "Message depuis votre site" }));
    var row = function (label, html) {
      return '<div class="contact-row"><dt>' + esc(label) + "</dt><dd>" + html + "</dd></div>";
    };
    var online = '<p><a href="https://github.com/' + esc(P.github) + '" target="_blank" rel="noopener">github.com/' + esc(P.github) + "</a></p>" +
      (P.researchgate ? '<p><a href="' + esc(P.researchgate) + '" target="_blank" rel="noopener">ResearchGate</a></p>' : "");
    var body = '<dl class="contact-list">' +
      row(t({ en: "Email", fr: "E-mail" }),
        '<p class="contact-email"><a href="mailto:' + esc(email()) + '">' + '<span class="nw">' + esc(emailShown().split("@")[0]) + '</span><wbr><span class="nw">@' + esc(P.emailDomain) + "</span></a></p>" +
        '<p><a class="btn btn-primary" href="mailto:' + esc(email()) + "?subject=" + subject + '">' + icon("mail") + "<span>" +
        esc(t({ en: "Write to me", fr: "M'écrire" })) + "</span></a></p>") +
      row(t({ en: "Address", fr: "Adresse" }),
        "<address>" + esc(P.lab) + "<br>" + esc(P.university) + "<br>" +
        esc(P.address[0]) + "<br>" + esc(P.address[1]) + "</address>") +
      row(t({ en: "Online", fr: "En ligne" }), online) +
      "</dl>";
    return '<div class="wrap page">' + pageHead("contact") + card("", "", body, "contact-card") + "</div>";
  }

  /* ---------- Figure de l'accueil : traces satellitaires et champ reconstruit ---------- */

  function initHero(canvas) {
    if (!canvas) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function field(X, Y, A) {
      var yc = 0.52 + 0.13 * Math.sin(2 * Math.PI * X / 1.5 + 0.7) + 0.05 * Math.sin(2 * Math.PI * X / 0.6 + 1.3);
      var v = 1.1 * Math.tanh((Y - yc) / 0.09);
      var E = [
        [0.16, 0.22, 0.95, 0.075], [0.41, 0.80, -0.9, 0.08], [0.62, 0.24, 0.8, 0.065],
        [0.84, 0.78, -0.85, 0.07], [0.30, 0.68, -0.5, 0.05], [0.93, 0.30, 0.6, 0.06], [0.52, 0.38, 0.45, 0.045]
      ];
      for (var i = 0; i < E.length; i++) {
        var dx = X - E[i][0] * A, dy = Y - E[i][1];
        v += E[i][2] * Math.exp(-(dx * dx + dy * dy) / (2 * E[i][3] * E[i][3]));
      }
      return v;
    }

    function rng(seed) {
      return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    }

    var state = null;

    function build() {
      var rect = canvas.getBoundingClientRect();
      var W = Math.max(320, Math.round(rect.width)), H = Math.max(240, Math.round(rect.height));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      var A = W / H, g = 6;
      var nx = Math.ceil(W / g) + 1, ny = Math.ceil(H / g) + 1;
      var F = new Float32Array(nx * ny);
      for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++) F[j * nx + i] = field(i * g / H, j * g / H, A);

      // Courbes de niveau (marching squares) dessinées sur un canvas hors écran
      var off = document.createElement("canvas");
      off.width = canvas.width; off.height = canvas.height;
      var oc = off.getContext("2d");
      oc.scale(dpr, dpr);
      oc.lineJoin = "round"; oc.lineCap = "round";
      var levels = [];
      for (var L = -1.8; L <= 1.81; L += 0.2) levels.push(Math.round(L * 10) / 10);
      var EDGES = {
        1: [[3, 2]], 2: [[2, 1]], 3: [[3, 1]], 4: [[0, 1]], 5: [[0, 1], [2, 3]], 6: [[0, 2]], 7: [[3, 0]],
        8: [[3, 0]], 9: [[0, 2]], 10: [[3, 0], [1, 2]], 11: [[0, 1]], 12: [[3, 1]], 13: [[2, 1]], 14: [[3, 2]]
      };
      levels.forEach(function (lv) {
        var zero = Math.abs(lv) < 1e-6;
        oc.beginPath();
        for (var j = 0; j < ny - 1; j++) {
          for (var i = 0; i < nx - 1; i++) {
            var a = F[j * nx + i], b = F[j * nx + i + 1], c = F[(j + 1) * nx + i + 1], d = F[(j + 1) * nx + i];
            var k = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
            var segs = EDGES[k];
            if (!segs) continue;
            var x0 = i * g, y0 = j * g, x1 = x0 + g, y1 = y0 + g;
            var pt = function (e) {
              var s;
              if (e === 0) { s = (lv - a) / (b - a); return [x0 + s * g, y0]; }
              if (e === 1) { s = (lv - b) / (c - b); return [x1, y0 + s * g]; }
              if (e === 2) { s = (lv - d) / (c - d); return [x0 + s * g, y1]; }
              s = (lv - a) / (d - a); return [x0, y0 + s * g];
            };
            for (var q = 0; q < segs.length; q++) {
              var p1 = pt(segs[q][0]), p2 = pt(segs[q][1]);
              oc.moveTo(p1[0], p1[1]); oc.lineTo(p2[0], p2[1]);
            }
          }
        }
        if (zero) { oc.strokeStyle = "rgba(124, 198, 207, 0.95)"; oc.lineWidth = 1.8; }
        else {
          var w = 0.22 + 0.33 * (1 - Math.abs(lv) / 1.8);
          oc.strokeStyle = lv > 0 ? "rgba(124, 198, 207," + w + ")" : "rgba(160, 190, 214," + w + ")";
          oc.lineWidth = 1;
        }
        oc.stroke();
      });

      // Traces satellitaires montantes et descendantes
      var r = rng(7), dots = [];
      var th = 66 * Math.PI / 180, ct = Math.cos(th), st = Math.sin(th);
      var spacing = Math.max(90, W / 7), step = 9, len = H / st;
      var tracks = [];
      for (var x = -H * ct / st; x < W + spacing; x += spacing) {
        tracks.push({ x: x, dir: -1 });
        tracks.push({ x: x + spacing / 2, dir: 1 });
      }
      // La trace suivie par le satellite : une trace montante qui arrive en haut vers 92 % de la largeur
      var hero = null, best = Infinity;
      tracks.forEach(function (tr, ti) {
        if (tr.dir > 0) return;
        var topX = tr.x + len * ct;
        var dist = Math.abs(topX - 0.92 * W);
        if (dist < best && tr.x > 0) { best = dist; hero = { ti: ti, x0: tr.x }; }
      });
      if (hero) hero.sPark = (H - 0.12 * H) / st;

      tracks.forEach(function (tr, ti) {
        for (var s2 = 0; s2 <= len; s2 += step) {
          var px = tr.x + s2 * ct;
          var py = tr.dir < 0 ? H - s2 * st : s2 * st;
          if (px < 0 || px > W || py < 0 || py > H) continue;
          if (r() < 0.1) continue; // données manquantes
          dots.push({ x: px, y: py, t: ti, s: s2 });
        }
      });

      state = { W: W, H: H, dpr: dpr, off: off, dots: dots, nTracks: tracks.length, hero: hero, ct: ct, st: st };
    }

    // Petit satellite (corps clair, deux panneaux solaires), orienté dans le sens de la trace
    function drawSatellite(ctx, x, y, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(1.5, 1.5);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#A9C4D0";
      ctx.beginPath(); ctx.moveTo(0, -15); ctx.lineTo(0, 15); ctx.stroke();
      ctx.fillStyle = "#3E8C99";
      ctx.strokeStyle = "#9FD3DA";
      [-16, 5].forEach(function (py) {
        ctx.fillRect(-3.5, py, 7, 11);
        ctx.strokeRect(-3.5, py, 7, 11);
        ctx.beginPath();
        ctx.moveTo(-3.5, py + 3.7); ctx.lineTo(3.5, py + 3.7);
        ctx.moveTo(-3.5, py + 7.3); ctx.lineTo(3.5, py + 7.3);
        ctx.stroke();
      });
      ctx.fillStyle = "#E8F1F4";
      ctx.fillRect(-5.5, -4, 11, 8);
      ctx.fillStyle = "#F2B33D";
      ctx.beginPath(); ctx.arc(7.5, 0, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    function draw(pDots, pField, pSat) {
      var ctx = canvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (pField > 0) {
        ctx.globalAlpha = pField;
        ctx.drawImage(state.off, 0, 0);
        ctx.globalAlpha = 1;
      }
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.fillStyle = "#F2B33D";
      var limit = pDots * state.nTracks;
      var hero = state.hero;
      var sNow = hero ? pSat * hero.sPark : 0;
      for (var i = 0; i < state.dots.length; i++) {
        var d = state.dots[i];
        if (hero && d.t === hero.ti) {
          if (d.s > sNow) continue;
          ctx.globalAlpha = 0.9;
        } else {
          if (d.t > limit) continue;
          ctx.globalAlpha = Math.min(1, (limit - d.t)) * 0.9;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (hero && pSat > 0) {
        var sx = hero.x0 + sNow * state.ct;
        var sy = state.H - sNow * state.st;
        drawSatellite(ctx, sx, sy, Math.atan2(-state.st, state.ct));
      }
    }

    build();
    if (reduce || heroAnimated) {
      draw(1, 1, 1);
    } else {
      heroAnimated = true;
      var t0 = null;
      var tick = function (ts) {
        if (!document.body.contains(canvas)) return;
        if (t0 === null) t0 = ts;
        var e = ts - t0;
        var pd = Math.min(1, e / 1800);
        var pf = Math.max(0, Math.min(1, (e - 1300) / 1300));
        var u = Math.max(0, Math.min(1, (e - 600) / 4800));
        var ps = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; // départ et arrivée en douceur
        draw(pd, pf, ps);
        if (e < 5500) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    }

    var timer = null;
    var onResize = function () {
      if (!document.body.contains(canvas)) { window.removeEventListener("resize", onResize); return; }
      clearTimeout(timer);
      timer = setTimeout(function () { build(); draw(1, 1, 1); }, 150);
    };
    window.addEventListener("resize", onResize);
  }

  /* ---------- Assemblage ---------- */

  var RENDER = {
    home: renderHome, cv: renderCV, research: renderResearch, publications: renderPublications,
    software: renderSoftware, talks: renderTalks, teaching: renderTeaching, contact: renderContact
  };

  function render() {
    var page = document.body.getAttribute("data-page") || "home";
    document.documentElement.lang = lang;
    document.getElementById("site-header").innerHTML = renderHeader(page);
    document.getElementById("app").innerHTML = (RENDER[page] || renderHome)();
    document.getElementById("site-footer").innerHTML = page === "cv" ? "" : renderFooter();

    var navItem = UI.nav.filter(function (n) { return n.id === page; })[0];
    if (page !== "home" && navItem) document.title = t(navItem.label) + " | " + S.person.name;

    var toggle = document.querySelector(".lang-toggle");
    toggle.addEventListener("click", function () {
      lang = lang === "en" ? "fr" : "en";
      try { window.localStorage.setItem("lang", lang); } catch (e) { /* rien */ }
      render();
      var again = document.querySelector(".lang-toggle");
      if (again) again.focus();
    });

    var theme = document.querySelector(".theme-toggle");
    theme.addEventListener("click", function () {
      var dark = !isDark();
      document.documentElement.classList.toggle("dark", dark);
      try { window.localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) { /* rien */ }
      theme.setAttribute("aria-pressed", String(dark));
      theme.innerHTML = themeButtonInner();
    });

    var menu = document.querySelector(".menu-toggle");
    menu.addEventListener("click", function () {
      var open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", open ? "false" : "true");
      document.getElementById("site-nav").classList.toggle("is-open", !open);
    });

    var printBtn = document.querySelector(".cv-print");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

    if (page === "home") initHero(document.querySelector(".hero-canvas"));
  }

  document.addEventListener("DOMContentLoaded", render);
})();
