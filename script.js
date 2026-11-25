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

  /* ---------- Textes de l'interface ---------- */

  var UI = {
    nav: [
      { id: "home", href: "index.html", label: { en: "Home", fr: "Accueil" } },
      { id: "cv", href: "cv.html", label: { en: "CV", fr: "CV" } },
      { id: "research", href: "research.html", label: { en: "Research", fr: "Recherche" } },
      { id: "publications", href: "publications.html", label: { en: "Publications", fr: "Publications" } },
      { id: "talks", href: "conferences.html", label: { en: "Talks", fr: "Conférences" } },
      { id: "teaching", href: "teaching.html", label: { en: "Teaching", fr: "Enseignement" } },
      { id: "contact", href: "contact.html", label: { en: "Contact", fr: "Contact" } }
    ],
    skip: { en: "Skip to content", fr: "Aller au contenu" },
    menu: { en: "Menu", fr: "Menu" },
    langButton: { en: "Français", fr: "English" },
    langLabel: { en: "Afficher le site en français", fr: "Show the site in English" },
    viewCV: { en: "View my CV", fr: "Voir mon CV" },
    seeResearch: { en: "My research", fr: "Ma recherche" },
    about: { en: "About", fr: "À propos" },
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
      talks: {
        title: { en: "Talks and conferences", fr: "Conférences et exposés" },
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

  /* ---------- En-tête et pied de page ---------- */

  function renderHeader(page) {
    var items = UI.nav.map(function (n) {
      var cur = n.id === page ? ' aria-current="page"' : "";
      return '<li><a href="' + n.href + '"' + cur + ">" + esc(t(n.label)) + "</a></li>";
    }).join("");
    var other = lang === "en" ? "fr" : "en";
    return '<a class="skip-link" href="#app">' + esc(t(UI.skip)) + "</a>" +
      '<header class="site-header"><div class="wrap header-inner">' +
      '<a class="wordmark" href="index.html">' + esc(S.person.name) + "</a>" +
      '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">' + esc(t(UI.menu)) + "</button>" +
      '<nav id="site-nav" class="site-nav" aria-label="Main"><ul>' + items + "</ul>" +
      '<button class="lang-toggle" type="button" lang="' + other + '" aria-label="' + esc(t(UI.langLabel)) + '">' + esc(t(UI.langButton)) + "</button>" +
      "</nav></div></header>";
  }

  function renderFooter() {
    return '<footer class="site-footer"><div class="wrap footer-inner">' +
      "<p>" + esc(S.person.name) + "<br>" + esc(S.person.lab) + "</p>" +
      '<p><a href="mailto:' + esc(email()) + '">' + esc(emailShown()) + "</a><br>" +
      '<a href="https://github.com/' + esc(S.person.github) + '" target="_blank" rel="noopener">github.com/' + esc(S.person.github) + "</a></p>" +
      '<p class="muted">' + esc(t(UI.updated)) + " " + esc(t(S.updated)) + "</p>" +
      "</div></footer>";
  }

  function pageHead(key) {
    var p = UI.pages[key];
    return '<header class="page-head"><h1>' + esc(t(p.title)) + "</h1>" +
      (p.intro ? '<p class="lede">' + esc(t(p.intro)) + "</p>" : "") + "</header>";
  }

  /* ---------- Accueil ---------- */

  function renderHome() {
    var bio = t(S.person.bio).map(function (para) {
      return "<p>" + esc(para.replace("{year}", phdYearText())) + "</p>";
    }).join("");

    var brief = S.research.brief.map(function (b) {
      return "<div><dt>" + esc(t(b.term)) + "</dt><dd>" + esc(t(b.text)) + "</dd></div>";
    }).join("");

    var latest = sortedTalks().slice(0, 4).map(function (ev) {
      var up = isUpcoming(ev) ? ' <span class="badge">' + esc(t(UI.upcoming)) + "</span>" : "";
      return '<li><span class="when">' + esc(fmtRange(ev.start, ev.end)) + "</span>" +
        '<span class="what">' + esc(t(ev.event)) + up + '<span class="where">' +
        esc(t(UI.roles[ev.role])) + ", " + esc(t(ev.place)) + "</span></span></li>";
    }).join("");

    return '<section class="hero" aria-labelledby="hero-name">' +
      '<canvas class="hero-canvas" aria-hidden="true"></canvas>' +
      '<div class="wrap hero-inner"><div class="hero-text">' +
      '<h1 id="hero-name">' + esc(S.person.name) + "</h1>" +
      '<p class="hero-role">' + esc(t(S.person.role)) + ", " + esc(S.person.university) + ", Dijon</p>" +
      '<p class="hero-statement">' + esc(t(S.person.statement)) + "</p>" +
      '<p class="hero-actions"><a class="btn btn-primary" href="cv.html">' + esc(t(UI.viewCV)) + "</a>" +
      '<a class="btn btn-ghost" href="research.html">' + esc(t(UI.seeResearch)) + "</a></p>" +
      "</div></div>" +
      "</section>" +
      '<div class="wrap page">' +
      '<section class="home-about" aria-labelledby="about-h">' +
      '<img class="portrait" src="' + esc(S.person.photo) + '" alt="' + esc(t(UI.photoAlt)) + '" width="180" onerror="this.parentNode.classList.add(\'no-photo\');this.remove()">' +
      '<div class="prose"><h2 id="about-h">' + esc(t(UI.about)) + "</h2>" + bio + "</div></section>" +
      '<section class="home-brief" aria-labelledby="brief-h"><h2 id="brief-h">' + esc(t(UI.inBrief)) + "</h2>" +
      '<dl class="brief">' + brief + "</dl></section>" +
      '<section class="home-latest" aria-labelledby="latest-h"><h2 id="latest-h">' + esc(t(UI.latest)) + "</h2>" +
      '<ul class="latest">' + latest + "</ul>" +
      '<p><a class="more" href="conferences.html">' + esc(t(UI.allTalks)) + "</a></p></section>" +
      "</div>";
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

  function renderResearch() {
    var th = S.research.thesis;
    var desc = t(th.description).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var apps = th.applications.map(function (a) {
      return '<div class="app"><h3>' + esc(t(a.title)) + "</h3><p>" + esc(t(a.text)) + "</p></div>";
    }).join("");
    var earlier = S.experience.map(function (e) {
      return '<li class="entry"><span class="when">' + esc(t(e.when)) + '</span><div><h3>' + esc(t(e.title)) + "</h3>" +
        '<p class="where">' + esc(t(e.where)) + "</p><p>" + esc(t(e.text)) + "</p>" + links(e.links) + "</div></li>";
    }).join("");
    var projectsTitle = { en: "GitHub projects", fr: "Projets GitHub" };

    return '<div class="wrap page">' + pageHead("research") +
      '<section class="thesis" aria-labelledby="thesis-h">' +
      '<p class="kicker">' + esc(t({ en: "PhD thesis", fr: "Thèse de doctorat" })) + ", " + esc(t(th.period)) + "</p>" +
      '<h2 id="thesis-h">' + esc(t(th.title)) + "</h2>" +
      '<p class="where">' + esc(t({ en: "Supervised by ", fr: "Sous la direction de " })) + esc(t(th.supervisors)) + "</p>" +
      '<div class="prose">' + desc + "</div>" +
      '<div class="apps">' + apps + "</div>" +
      '<p class="muted">' + esc(t(th.data)) + "</p>" +
      "</section>" +
      '<section aria-labelledby="earlier-h"><h2 id="earlier-h">' + esc(t({ en: "Earlier projects", fr: "Projets précédents" })) + "</h2>" +
      '<ul class="entries">' + earlier +
      '<li class="entry"><span class="when"></span><div><h3>' + esc(t(projectsTitle)) + "</h3><p>" + esc(t(S.projects.text)) + "</p>" +
      links([{ label: "github.com/" + S.person.github, href: S.projects.href }]) + "</div></li>" +
      "</ul></section></div>";
  }

  /* ---------- Publications ---------- */

  function renderPublications() {
    var pubs = S.publications.map(function (p) {
      var authors = p.authors.map(function (a) {
        return /Dovodji/.test(a) ? "<strong>" + esc(a) + "</strong>" : esc(a);
      }).join(", ");
      return '<li class="entry"><span class="when">' + esc(p.year) + "</span><div>" +
        '<p class="pub-authors">' + authors + "</p>" +
        '<h3 class="pub-title">' + esc(p.title) + "</h3>" +
        '<p class="where"><span class="badge badge-quiet">' + esc(t(p.status)) + "</span> " + esc(t(p.note)) + "</p>" +
        links(p.links) + "</div></li>";
    }).join("");
    var reports = S.reports.map(function (r) {
      return '<li class="entry"><span class="when">' + esc(r.year) + "</span><div>" +
        '<h3 class="pub-title">' + esc(t(r.title)) + "</h3>" +
        '<p class="where">' + esc(t(r.kind)) + "</p>" + links(r.links) + "</div></li>";
    }).join("");
    return '<div class="wrap page">' + pageHead("publications") +
      '<section aria-labelledby="papers-h"><h2 id="papers-h">' + esc(t({ en: "Papers", fr: "Articles" })) + "</h2>" +
      '<ul class="entries">' + pubs + "</ul></section>" +
      '<section aria-labelledby="reports-h"><h2 id="reports-h">' + esc(t({ en: "Theses and reports", fr: "Mémoires et rapports" })) + "</h2>" +
      '<ul class="entries">' + reports + "</ul></section></div>";
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
          html += '<p class="event-talk"><span class="vh">' + esc(t(UI.roles.talk)) + '. </span>' +
            (ev.title ? "<em>" + esc(t(ev.title)) + "</em>" : esc(t({ en: "Contributed talk", fr: "Exposé" }))) + "</p>";
        } else {
          html += '<p class="vh">' + esc(t(UI.roles.participant)) + "</p>";
        }
        if (ev.details) html += '<p class="event-details">' + esc(t(ev.details)) + "</p>";
        html += links(ev.links);
        return html + "</li>";
      }).join("");
      return '<section class="year-group" aria-labelledby="y' + y + '"><h2 class="year" id="y' + y + '">' + y + "</h2>" +
        '<ol class="events">' + evs + "</ol></section>";
    }).join("");

    return '<div class="wrap page">' + pageHead("talks") + legend + '<div class="timeline">' + body + "</div></div>";
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
              var sub = it.sub ? '<ul>' + it.sub.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "";
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
      return '<section class="year-group year-group-wide" aria-labelledby="t' + esc(y.year) + '">' +
        '<h2 class="year" id="t' + esc(y.year) + '">' + esc(y.year) + "</h2>" +
        '<div><p class="year-where">' + esc(y.where) + '</p><ul class="courses">' + rows + "</ul></div></section>";
    }).join("");

    var outreach = S.outreach.filter(function (o) { return !o.hideOnTeachingPage; }).map(function (o) {
      return '<li class="entry"><span class="when">' + esc(t(o.when)) + "</span><div><h3>" + esc(t(o.title)) + "</h3>" +
        '<p class="where">' + esc(o.place) + "</p><p>" + esc(t(o.text)) + "</p></div></li>";
    }).join("");

    return '<div class="wrap page">' + pageHead("teaching") + years +
      '<section class="outreach" aria-labelledby="outreach-h"><h2 id="outreach-h">' +
      esc(t({ en: "Outreach and mentoring", fr: "Médiation scientifique et tutorat" })) + "</h2>" +
      '<ul class="entries">' + outreach + "</ul></section></div>";
  }

  /* ---------- Contact ---------- */

  function renderContact() {
    var P = S.person;
    var subject = encodeURIComponent(t({ en: "Message from your website", fr: "Message depuis votre site" }));
    var row = function (label, html) {
      return '<div class="contact-row"><dt>' + esc(label) + "</dt><dd>" + html + "</dd></div>";
    };
    return '<div class="wrap page">' + pageHead("contact") +
      '<dl class="contact-list">' +
      row(t({ en: "Email", fr: "E-mail" }),
        '<p class="contact-email"><a href="mailto:' + esc(email()) + '">' + '<span class="nw">' + esc(emailShown().split("@")[0]) + '</span><wbr><span class="nw">@' + esc(S.person.emailDomain) + "</span></a></p>" +
        '<p><a class="btn btn-primary" href="mailto:' + esc(email()) + "?subject=" + subject + '">' +
        esc(t({ en: "Write to me", fr: "M'écrire" })) + "</a></p>") +
      row(t({ en: "Address", fr: "Adresse" }),
        "<address>" + esc(P.lab) + "<br>" + esc(P.university) + "<br>" +
        esc(P.address[0]) + "<br>" + esc(P.address[1]) + "</address>") +
      row(t({ en: "Online", fr: "En ligne" }),
        '<p><a href="https://github.com/' + esc(P.github) + '" target="_blank" rel="noopener">github.com/' + esc(P.github) + "</a></p>") +
      "</dl></div>";
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
      // La trace suivie par le satellite : une trace montante qui arrive en haut vers 78 % de la largeur
      var hero = null, best = Infinity;
      tracks.forEach(function (tr, ti) {
        if (tr.dir > 0) return;
        var topX = tr.x + len * ct;
        var dist = Math.abs(topX - 0.78 * W);
        if (dist < best && tr.x > 0) { best = dist; hero = { ti: ti, x0: tr.x }; }
      });
      if (hero) hero.sPark = (H - 0.16 * H) / st;

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
    talks: renderTalks, teaching: renderTeaching, contact: renderContact
  };

  function render() {
    var page = document.body.getAttribute("data-page") || "home";
    document.documentElement.lang = lang;
    document.getElementById("site-header").innerHTML = renderHeader(page);
    document.getElementById("app").innerHTML = (RENDER[page] || renderHome)();
    document.getElementById("site-footer").innerHTML = page === "cv" ? "" : renderFooter();

    var navItem = UI.nav.filter(function (n) { return n.id === page; })[0];
    document.title = page === "home" ? S.person.name : t(navItem.label) + " | " + S.person.name;

    var toggle = document.querySelector(".lang-toggle");
    toggle.addEventListener("click", function () {
      lang = lang === "en" ? "fr" : "en";
      try { window.localStorage.setItem("lang", lang); } catch (e) { /* rien */ }
      render();
      var again = document.querySelector(".lang-toggle");
      if (again) again.focus();
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
