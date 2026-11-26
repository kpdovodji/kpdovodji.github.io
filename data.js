/*
  Contenu du site. Pour mettre le site à jour, il suffit en général de modifier ce fichier.
  Chaque texte existe en anglais (en) et en français (fr).
  Les dates s'écrivent "AAAA-MM-JJ" ou "AAAA-MM" quand le jour n'est pas connu.
*/
window.SITE = {
  updated: { en: "November 2026", fr: "novembre 2026" },

  person: {
    name: "Pierre Dovodji",
    nameCV: "Pierre DOVODJI",
    role: {
      en: "PhD student in applied mathematics (statistics)",
      fr: "Doctorant en mathématiques appliquées (statistique)"
    },
    phdStart: "2025-10",
    chips: {
      en: ["Spatio-temporal statistics", "Functional data analysis", "Nonparametric statistics", "RBF splines", "Missing data", "Satellite oceanography", "Gulf Stream"],
      fr: ["Statistique spatio-temporelle", "Données fonctionnelles", "Statistique non paramétrique", "Splines RBF", "Données manquantes", "Océanographie satellitaire", "Gulf Stream"]
    },
    statement: {
      en: "I develop statistical methods to reconstruct ocean fields from noisy and irregularly sampled satellite measurements.",
      fr: "Je développe des méthodes statistiques pour reconstruire des champs océaniques à partir de mesures satellitaires bruitées et irrégulièrement échantillonnées."
    },
    // {year} est remplacé automatiquement par l'année de thèse en cours.
    bio: {
      en: [
        "I am a {year} PhD student in applied mathematics at the Institut de Mathématiques de Bourgogne (IMB), Université Bourgogne Europe, in Dijon. My supervisors are Hervé Cardot (IMB) and David Nerini (Mediterranean Institute of Oceanography, Aix-Marseille University).",
        "My background is in mathematics and statistics. Before my Master's degrees in France, I taught mathematics in secondary schools in Benin for four years. Today I also teach statistics and mathematics tutorials at the university."
      ],
      fr: [
        "Je suis doctorant en {year} en mathématiques appliquées à l'Institut de Mathématiques de Bourgogne (IMB), Université Bourgogne Europe, à Dijon. Ma thèse est dirigée par Hervé Cardot (IMB) et David Nerini (Institut Méditerranéen d'Océanologie, Aix-Marseille Université).",
        "J'ai une formation en mathématiques et en statistique. Avant mes masters en France, j'ai enseigné les mathématiques au collège et au lycée au Bénin pendant quatre ans. J'assure aussi des TD de statistiques et de mathématiques à l'université."
      ]
    },
    emailUser: "kuassi-pierre.dovodji",
    emailDomain: "u-bourgogne.fr",
    website: "kpdovodji.github.io",
    github: "kpdovodji",
    researchgate: "https://www.researchgate.net/profile/Pierre-Dovodji",
    photo: "myphoto.jpg",
    affiliation: {
      en: "Institut de Mathématiques de Bourgogne (IMB), Université Bourgogne Europe, Dijon",
      fr: "Institut de Mathématiques de Bourgogne (IMB), Université Bourgogne Europe, Dijon"
    },
    lab: "Institut de Mathématiques de Bourgogne (IMB, UMR CNRS 5584)",
    university: "Université Bourgogne Europe",
    address: ["9 avenue Alain Savary, BP 47870", "21078 Dijon Cedex, France"]
  },

  research: {
    brief: [
      {
        term: { en: "Method", fr: "Méthode" },
        text: {
          en: "Space-time radial basis function (RBF) splines, with a regularization based on a differential constraint that brings in physical knowledge.",
          fr: "Des splines à fonctions de base radiales (RBF) en espace-temps, avec une régularisation fondée sur une contrainte différentielle qui intègre la physique du problème."
        }
      },
      {
        term: { en: "Theory", fr: "Théorie" },
        text: {
          en: "Convergence of the proposed algorithms and asymptotic properties of the estimator.",
          fr: "Convergence des algorithmes proposés et propriétés asymptotiques de l'estimateur."
        }
      },
      {
        term: { en: "Applications", fr: "Applications" },
        text: {
          en: "Sea surface height and geostrophic currents in the Gulf Stream, and surface chlorophyll in the Southern Ocean.",
          fr: "Hauteur de mer et courants géostrophiques dans le Gulf Stream, chlorophylle de surface dans l'océan Austral."
        }
      }
    ],
    interests: {
      en: "Spatio-temporal statistics, nonparametric statistics, functional data analysis (sparse and irregular data), reconstruction of sparse space-time fields, RBF and constrained splines, statistics for satellite and ocean data.",
      fr: "Statistique spatio-temporelle, statistique non paramétrique, analyse de données fonctionnelles (données éparses et irrégulières), reconstruction de champs spatio-temporels épars, splines RBF et splines sous contraintes, statistique pour les données satellitaires et océaniques."
    },
    thesis: {
      title: {
        en: "New statistical models for functional data motivated by applications in oceanography",
        fr: "Nouveaux modèles statistiques pour données fonctionnelles motivés par des applications en océanographie"
      },
      period: { en: "October 2025 to 2028", fr: "Octobre 2025 à 2028" },
      supervisors: {
        en: "Hervé Cardot (IMB) and David Nerini (Mediterranean Institute of Oceanography, MIO, Aix-Marseille University)",
        fr: "Hervé Cardot (IMB) et David Nerini (Institut Méditerranéen d'Océanologie, MIO, Aix-Marseille Université)"
      },
      summary: {
        en: "Reconstruction of spatio-temporal fields from noisy and irregularly sampled satellite data, using space-time radial basis function (RBF) splines with a regularization based on a differential constraint. Study of the convergence of the proposed algorithms and of the asymptotic properties of the estimator. Applications to sea surface height in the Gulf Stream and to surface chlorophyll in the Southern Ocean, with comparison to operational and state-of-the-art methods.",
        fr: "Reconstruction de champs spatio-temporels à partir de données satellitaires bruitées et irrégulièrement échantillonnées, à l'aide de splines RBF en espace-temps avec une régularisation fondée sur une contrainte différentielle. Étude de la convergence des algorithmes proposés et des propriétés asymptotiques de l'estimateur. Applications à la hauteur de mer dans le Gulf Stream et à la chlorophylle de surface dans l'océan Austral, avec comparaison aux méthodes opérationnelles et récentes."
      },
      description: {
        en: [
          "Satellites measure the ocean along narrow tracks. The measurements are noisy, and there are large gaps in space and time. My thesis develops statistical methods that turn these scattered measurements into complete maps.",
          "I use space-time radial basis function (RBF) splines. They model spatial and temporal dependence together, and a regularization based on a differential constraint brings physical knowledge into the estimate. On the theory side, I study the convergence of the proposed algorithms and the asymptotic properties of the estimator."
        ],
        fr: [
          "Les satellites mesurent l'océan le long de traces étroites. Les mesures sont bruitées, et il manque beaucoup de données dans l'espace et dans le temps. Ma thèse développe des méthodes statistiques qui transforment ces mesures éparses en cartes complètes.",
          "J'utilise des splines à fonctions de base radiales (RBF) en espace-temps. Elles modélisent ensemble les dépendances spatiales et temporelles, et une régularisation fondée sur une contrainte différentielle intègre la physique dans l'estimation. Du côté théorique, j'étudie la convergence des algorithmes proposés et les propriétés asymptotiques de l'estimateur."
        ]
      },
      applications: [
        {
          title: { en: "Sea surface height in the Gulf Stream", fr: "Hauteur de mer dans le Gulf Stream" },
          text: {
            en: "Reconstruction of sea surface height and geostrophic currents from altimeter tracks, to describe the Gulf Stream jet and its eddies. The method is compared with operational and recent mapping methods (DUACS, MIOST, DYMOST, BFN-QG, 4DVarNet) and with functional PCA for sparse data (PACE).",
            fr: "Reconstruction de la hauteur de mer et des courants géostrophiques à partir des traces d'altimètres, pour décrire le jet du Gulf Stream et ses tourbillons. La méthode est comparée aux méthodes de cartographie opérationnelles et récentes (DUACS, MIOST, DYMOST, BFN-QG, 4DVarNet) et à l'ACP fonctionnelle pour données éparses (PACE)."
          }
        },
        {
          title: { en: "Surface chlorophyll in the Southern Ocean", fr: "Chlorophylle de surface dans l'océan Austral" },
          text: {
            en: "Mapping of satellite chlorophyll-a in the Indian sector of the Southern Ocean, where a large part of the data is missing. The method is compared with PACE and DINEOF.",
            fr: "Cartographie de la chlorophylle a satellitaire dans le secteur indien de l'océan Austral, où une grande partie des données manque. La méthode est comparée à PACE et à DINEOF."
          }
        }
      ],
      data: {
        en: "Data: CMEMS satellite products and the NATL60 ocean simulation.",
        fr: "Données : produits satellitaires CMEMS et simulation océanique NATL60."
      }
    }
  },

  publications: [
    {
      authors: ["K. P. Dovodji", "H. Cardot", "D. Nerini"],
      title: "Spatio-temporal reconstruction of sparse environmental fields with RBF splines under a differential constraint: an application to sea surface height",
      status: { en: "In preparation", fr: "En préparation" },
      year: "2026",
      note: { en: "The code will be released with the paper.", fr: "Le code sera publié avec l'article." },
      links: []
    }
  ],

  reports: [
    {
      year: "2025",
      kind: { en: "Master's thesis (in French), Université Marie et Louis Pasteur", fr: "Mémoire de master, Université Marie et Louis Pasteur" },
      title: { en: "Statistical approximation of ocean current vector fields", fr: "Approximation statistique de champ de vecteurs de courants océaniques" },
      links: [
        { label: { en: "Thesis", fr: "Mémoire" }, href: "pdf/memoire_M2_UMLP.pdf" },
        { label: { en: "Slides", fr: "Présentation" }, href: "pdf/presentation_M2_UMLP.pdf" }
      ]
    },
    {
      year: "2025",
      kind: { en: "Master's thesis (in French), Université Bretagne Sud", fr: "Mémoire de master, Université Bretagne Sud" },
      title: { en: "Perceptual image segmentation: combining probabilistic models and learning methods", fr: "Segmentation perceptuelle d'images : combiner modèles probabilistes et méthodes d'apprentissage" },
      links: [
        { label: { en: "Thesis", fr: "Mémoire" }, href: "pdf/memoire_M2_UBS.pdf" },
        { label: { en: "Slides", fr: "Présentation" }, href: "pdf/presentation_M2_UBS.pdf" }
      ]
    },
    {
      year: "2024",
      kind: { en: "Master 1 internship report (in French)", fr: "Rapport de stage de master 1" },
      title: { en: "Analysis and forecasting of customer bookings", fr: "Analyse et prévision des réservations clients" },
      links: [
        { label: { en: "Report", fr: "Rapport" }, href: "https://github.com/kpdovodji/MesProjets/blob/main/Rapport_de_stage_M1.pdf" },
        { label: { en: "Slides", fr: "Présentation" }, href: "pdf/presentation_stage_M1.pdf" }
      ]
    }
  ],

  /*
    Conférences et exposés.
    role : "talk" (j'ai présenté) ou "participant".
    type : "conference", "workshop", "seminar" ou "school".
    Un événement dont la date de fin n'est pas passée s'affiche automatiquement comme « à venir ».
  */
  talks: [
    {
      start: "2027-02-24", end: "2027-02-26", type: "workshop", role: "participant",
      event: { en: "YES 2027 workshop, Spatio-temporal Statistics", fr: "Workshop YES 2027, Spatio-temporal Statistics" },
      place: { en: "EURANDOM, Eindhoven (Netherlands)", fr: "EURANDOM, Eindhoven (Pays-Bas)" },
      details: { en: "Young European Statisticians workshop.", fr: "Workshop Young European Statisticians." }
    },
    {
      start: "2026-10-20", type: "seminar", role: "talk",
      event: { en: "Team seminar, Mediterranean Institute of Oceanography (MIO)", fr: "Séminaire d'équipe, Institut Méditerranéen d'Océanologie (MIO)" },
      place: { en: "Marseille", fr: "Marseille" },
      title: { en: "Presentation of the space-time RBF spline method", fr: "Présentation de la méthode des splines RBF en espace-temps" },
      links: [{ label: { en: "Slides", fr: "Présentation" }, href: "pdf/mio_pierre.pdf" }]
    },
    {
      start: "2026-10-12", end: "2026-10-16", type: "school", role: "participant",
      event: { en: "22nd Journées d'Étude en Statistique, Neural networks", fr: "22es Journées d'Étude en Statistique, Réseaux de neurones" },
      place: { en: "CIRM, Marseille", fr: "CIRM, Marseille" }
    },
    {
      start: "2026-06-01", end: "2026-06-05", type: "conference", role: "participant",
      event: { en: "57th Journées de Statistique of the French Statistical Society (SFdS)", fr: "57es Journées de Statistique de la Société Française de Statistique (SFdS)" },
      place: { en: "Clermont-Ferrand", fr: "Clermont-Ferrand" }
    },
    {
      start: "2026-04", type: "conference", role: "talk",
      event: { en: "Young Researchers Days Bourgogne-Franche-Comté", fr: "Journées des Jeunes Chercheurs Bourgogne-Franche-Comté" },
      place: { en: "Dijon", fr: "Dijon" },
      links: [{ label: { en: "Slides", fr: "Présentation" }, href: "pdf/jjbc.pdf" }]
    },
    {
      start: "2026-01-28", end: "2026-01-30", type: "school", role: "participant",
      event: { en: "6th STATSKI winter school", fr: "6e école d'hiver STATSKI" },
      place: { en: "Métabief", fr: "Métabief" },
      details: {
        en: "Machine learning: stochastic optimization, proximal algorithms and neural networks. Lectures by Antoine Godichon-Baggioni (Sorbonne Université) and Nelly Pustelnik (ENS Lyon).",
        fr: "Apprentissage automatique : optimisation stochastique, algorithmes proximaux et réseaux de neurones. Cours d'Antoine Godichon-Baggioni (Sorbonne Université) et de Nelly Pustelnik (ENS Lyon)."
      }
    },
    {
      start: "2025-05-26", end: "2025-05-28", type: "workshop", role: "talk",
      event: { en: "MATHELEPH workshop", fr: "Workshop MATHELEPH" },
      place: { en: "Mediterranean Institute of Oceanography (MIO), Marseille", fr: "Institut Méditerranéen d'Océanologie (MIO), Marseille" },
      title: { en: "Approximation of vector fields under constraints", fr: "Approximation de champs vectoriels sous contraintes" },
      links: [{ label: { en: "Slides", fr: "Présentation" }, href: "pdf/matheleph.pdf" }]
    }
  ],

  /* Enseignement. hours : nombre d'heures, ou null si on ne veut pas l'afficher. */
  teaching: [
    {
      year: "2026–2027",
      where: "Université Bourgogne Europe",
      courses: [
        {
          level: "L2", program: { en: "Psychology", fr: "Psychologie" }, kind: { en: "tutorials", fr: "TD" }, hours: 40,
          subject: { en: "Parametric and nonparametric statistical tests", fr: "Tests statistiques paramétriques et non paramétriques" },
          topics: {
            en: [
              { text: "Basics of hypothesis testing", sub: ["The two types of error to avoid", "The p-value"] },
              { text: "Parametric tests", sub: ["One-sample tests for a proportion, a mean or a variance", "Comparison of two proportions, means or variances"] },
              { text: "Nonparametric tests", sub: ["Rejection region", "Normality tests, to decide whether data follow a normal distribution", "Comparison tests for data that are not normally distributed", "Chi-squared tests of independence"] }
            ],
            fr: [
              { text: "Généralités sur les tests d'hypothèses", sub: ["Les deux types d'erreur à éviter", "Notion de valeur p"] },
              { text: "Tests paramétriques", sub: ["Tests d'ajustement d'une proportion, d'une moyenne ou d'une variance", "Tests de comparaison entre deux proportions, moyennes ou variances"] },
              { text: "Tests non paramétriques", sub: ["Notion de région de rejet", "Tests de normalité, pour décider si des données suivent une loi normale", "Tests de comparaison entre des données qui ne sont pas normalement distribuées", "Tests d'indépendance du khi-deux"] }
            ]
          },
          materials: []
        },
        {
          level: "L3", program: { en: "Mathematics", fr: "Mathématiques" }, kind: { en: "tutorials", fr: "TD" }, hours: 26,
          subject: { en: "Inferential statistics", fr: "Statistique inférentielle" },
          topics: null, materials: []
        }
      ]
    },
    {
      year: "2025–2026",
      where: "Université Bourgogne Europe",
      courses: [
        {
          level: "L1", program: { en: "Psychology", fr: "Psychologie" }, kind: { en: "tutorials", fr: "TD" }, hours: 40,
          subject: { en: "Descriptive statistics", fr: "Statistiques descriptives" },
          topics: {
            en: ["Univariate and bivariate statistics", "probability", "confidence intervals"],
            fr: ["Statistiques univariées et bivariées", "probabilités", "intervalles de confiance"]
          },
          materials: [
            { label: { en: "Test 1 (CC1)", fr: "CC1" }, href: "pdf/25-26/G3_G6_CC1_25_26.pdf" }
            // Pour ajouter un document : enlever les // et mettre le vrai nom du fichier PDF.
            // , { label: { en: "Test 2 (CC2)", fr: "CC2" }, href: "pdf/25-26/NOM_DU_FICHIER_CC2.pdf" }
            // , { label: { en: "Test 3 (CC3)", fr: "CC3" }, href: "pdf/25-26/NOM_DU_FICHIER_CC3.pdf" }
            // , { label: { en: "Final exam", fr: "CF" }, href: "pdf/25-26/NOM_DU_FICHIER_CF.pdf" }
          ]
        },
        {
          level: "L2", program: { en: "Economics and management", fr: "Économie-gestion" }, kind: { en: "tutorials", fr: "TD" }, hours: 24,
          subject: { en: "Mathematics for economics", fr: "Mathématiques de l'économie" },
          topics: {
            en: ["Linear recurrences", "linear algebra", "improper integrals", "optimization", "approximate solution of equations"],
            fr: ["Récurrences linéaires", "compléments d'algèbre linéaire", "intégrales généralisées", "optimisation", "résolution approchée d'une équation"]
          },
          materials: [
            // Liens masqués pour l'instant. Pour les afficher, enlever les // au début des deux lignes.
            // { label: { en: "Course notes", fr: "Cours" }, href: "pdf/25-26/S4_cours.pdf" },
            // { label: { en: "Exercise sheets", fr: "Feuilles de TD" }, href: "pdf/25-26/S4_TD.pdf" },
            { label: { en: "Test 1 (CC1)", fr: "CC1" }, href: "pdf/25-26/L2_CC1_G1.pdf" }
            // Pour ajouter un document : enlever les // et mettre le vrai nom du fichier PDF.
            // , { label: { en: "Test 2 (CC2)", fr: "CC2" }, href: "pdf/25-26/NOM_DU_FICHIER_CC2.pdf" }
            // , { label: { en: "Final exam", fr: "CF" }, href: "pdf/25-26/NOM_DU_FICHIER_CF.pdf" }
          ]
        }
      ]
    },
    {
      year: "2019–2023",
      where: "CEG Yagbé, Cotonou (Benin)",
      hideOnTeachingPage: true, // affiché seulement dans le CV en ligne
      courses: [
        {
          level: { en: "Secondary school", fr: "Collège et lycée" }, program: null, kind: null, hours: null,
          subject: { en: "Mathematics teacher, grades 9 to 12", fr: "Professeur de mathématiques, de la 3e à la terminale" },
          topics: null, materials: []
        }
      ]
    }
  ],

  outreach: [
    {
      when: "2025–2026",
      title: { en: "MATh.en.JEANS research workshop", fr: "Atelier de recherche MATh.en.JEANS" },
      place: "Collège Louis Pasteur, Montbard",
      text: {
        en: "Supervision of math research projects with middle school pupils, from the first questions to the oral presentation of their results.",
        fr: "Encadrement de projets de recherche en mathématiques avec des collégiens, des premières questions jusqu'à la présentation orale des résultats."
      }
    },
    {
      when: { en: "Since 2023", fr: "Depuis 2023" },
      title: { en: "Volunteer mentor, AFEV", fr: "Mentor bénévole, AFEV" },
      hideOnTeachingPage: true, // affiché seulement dans le CV en ligne
      place: "Besançon",
      text: {
        en: "Individual support for pupils who have difficulties at school.",
        fr: "Accompagnement individuel d'élèves en difficulté scolaire."
      }
    }
  ],

  experience: [
    {
      when: { en: "Mar.–Aug. 2025", fr: "mars–août 2025" },
      title: { en: "Master's research internship", fr: "Stage de recherche de master 2" },
      where: { en: "MIO (Marseille) and IMB (Dijon)", fr: "MIO (Marseille) et IMB (Dijon)" },
      text: {
        en: "Statistical approximation of ocean current vector fields with constrained vector splines (divergence and curl), to study the behaviour of elephant seals. Supervisors: Hervé Cardot and David Nerini.",
        fr: "Approximation statistique de champs de vecteurs de courants océaniques par splines vectorielles sous contraintes (divergence et rotationnel), pour étudier le comportement des éléphants de mer. Encadrants : Hervé Cardot et David Nerini."
      },
      links: [
        { label: { en: "Thesis", fr: "Mémoire" }, href: "pdf/memoire_M2_UMLP.pdf" },
        { label: { en: "Slides", fr: "Présentation" }, href: "pdf/presentation_M2_UMLP.pdf" }
      ]
    },
    {
      when: "2024–2025",
      title: { en: "Master's thesis", fr: "Mémoire de master 2" },
      where: { en: "Université Bretagne Sud", fr: "Université Bretagne Sud" },
      text: {
        en: "Perceptual image segmentation that combines probabilistic mixture models and neural networks, tested on natural images. Supervisor: Claire Launay.",
        fr: "Segmentation perceptuelle d'images qui combine modèles de mélange probabilistes et réseaux de neurones, testée sur des images naturelles. Encadrante : Claire Launay."
      },
      links: [
        { label: { en: "Thesis", fr: "Mémoire" }, href: "pdf/memoire_M2_UBS.pdf" },
        { label: { en: "Slides", fr: "Présentation" }, href: "pdf/presentation_M2_UBS.pdf" }
      ]
    },
    {
      when: { en: "Apr.–June 2024", fr: "avr.–juin 2024" },
      title: { en: "Master's internship in data analysis", fr: "Stage de master 1 en analyse de données" },
      where: { en: "L'Atelier de Francisco, Besançon", fr: "L'Atelier de Francisco, Besançon" },
      text: {
        en: "Analysis and forecasting of customer bookings, handling of missing data, customer satisfaction analysis.",
        fr: "Analyse et prévision des réservations clients, gestion des données manquantes, analyse de la satisfaction client."
      },
      links: [
        { label: { en: "Report", fr: "Rapport" }, href: "https://github.com/kpdovodji/MesProjets/blob/main/Rapport_de_stage_M1.pdf" },
        { label: { en: "Slides", fr: "Présentation" }, href: "pdf/presentation_stage_M1.pdf" },
        { label: { en: "R code", fr: "Code R" }, href: "https://drive.google.com/drive/folders/1OowhRla5HcM80-CO3z-xhcoM47aUS4rL?usp=drive_link" }
      ]
    }
  ],

  // Page « Software » : elle reste cachée tant que show vaut false.
  // Quand le package sera publié : mettre show: true, ajouter le lien dans links,
  // enlever la ligne <meta name="robots" content="noindex"> de software.html et ajouter la page à sitemap.xml.
  software: {
    show: false,
    items: [
      {
        name: "ST-RBF",
        status: { en: "In preparation", fr: "En préparation" },
        text: {
          en: "A package to reconstruct spatio-temporal fields from sparse and noisy data with the space-time RBF splines developed in my thesis.",
          fr: "Un package pour reconstruire des champs spatio-temporels à partir de données éparses et bruitées, avec les splines RBF en espace-temps développées dans ma thèse."
        },
        links: []
      }
    ]
  },

  projects: {
    text: {
      en: "Applied projects and readings of research papers in statistics, machine learning and data science.",
      fr: "Projets appliqués et lectures d'articles de recherche en statistique, apprentissage automatique et science des données."
    },
    href: "https://github.com/kpdovodji"
  },

  education: [
    {
      when: "2023–2025",
      title: { en: "MSc in Statistical Modelling (Master 1 and 2), with honours", fr: "Master Modélisation statistique (M1 et M2), mention bien" },
      where: { en: "Université Marie et Louis Pasteur (formerly Université de Franche-Comté), Besançon", fr: "Université Marie et Louis Pasteur (anciennement Université de Franche-Comté), Besançon" },
      grade: { en: "Ranked 1st both years", fr: "Classé 1er les deux années" },
      text: {
        en: "Markov chains, Bayesian statistics, time series, linear models, statistical learning, deep learning.",
        fr: "Chaînes de Markov, statistique bayésienne, séries temporelles, modèles linéaires, apprentissage statistique, apprentissage profond."
      }
    },
    {
      when: "2024–2025",
      title: { en: "MSc in Mathematical Engineering (Master 2, in parallel), with honours", fr: "Master 2 Ingénierie mathématique (en parallèle), mention bien" },
      where: { en: "Université Bretagne Sud", fr: "Université Bretagne Sud" },
      grade: { en: "Ranked 3rd of 16", fr: "Classé 3e sur 16" },
      text: {
        en: "Applied statistics, numerical methods, applied probability, image processing.",
        fr: "Statistique appliquée, méthodes numériques, probabilités appliquées, traitement d'images."
      }
    },
    {
      when: "2016–2019",
      title: { en: "BSc in Fundamental Mathematics", fr: "Licence de mathématiques fondamentales" },
      where: { en: "Université d'Abomey-Calavi, Benin", fr: "Université d'Abomey-Calavi, Bénin" },
      text: {
        en: "Analysis, algebra, topology, measure theory, probability, partial differential equations.",
        fr: "Analyse, algèbre, topologie, théorie de la mesure, probabilités, équations aux dérivées partielles."
      }
    }
  ],

  skills: [
    { label: { en: "Programming", fr: "Programmation" }, text: "Python, R, Julia, SQL, SAS, C++, LaTeX" },
    {
      label: { en: "Statistics, ML", fr: "Statistique, ML" },
      text: {
        en: "Functional data analysis, spatial interpolation, time series, Bayesian statistics, deep learning",
        fr: "Analyse de données fonctionnelles, interpolation spatiale, séries temporelles, statistique bayésienne, apprentissage profond"
      }
    },
    { label: { en: "Libraries", fr: "Bibliothèques" }, text: "NumPy, SciPy, pandas, statsmodels, scikit-learn, PyTorch, TensorFlow, Matplotlib" },
    { label: { en: "Data", fr: "Données" }, text: { en: "Satellite and model ocean data (CMEMS, NATL60)", fr: "Données océaniques satellitaires et de modèles (CMEMS, NATL60)" } },
    { label: { en: "Web", fr: "Web" }, text: "HTML, CSS, JavaScript" }
  ],

  languages: [
    { label: { en: "French", fr: "Français" }, text: { en: "Native", fr: "Langue maternelle" } },
    { label: { en: "English", fr: "Anglais" }, text: { en: "Intermediate (B1)", fr: "Intermédiaire (B1)" } }
  ]
};
