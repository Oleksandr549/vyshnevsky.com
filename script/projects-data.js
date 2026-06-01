/* ═══════════════════════════════════════════════════════════════
   PROJECTS DATA  —  shared by projects.html & project-detail.html
   ═══════════════════════════════════════════════════════════════
   All fields are optional except id, title, type.
   Missing fields are simply not rendered — nothing breaks.

   Fields:
   ─────────────────────────────────────────────
   id          number      unique identifier
   title       string      project name
   type        string      "Landing" | "Business" | "E-commerce" | "Platform" | "Web App"
   stack       string[]    tech tags e.g. ["HTML", "CSS", "JavaScript"]
   year        string      e.g. "2024"
   country     string      e.g. "🇺🇸 United States"
   client      string      e.g. "Restaurant Business"
   platform    string      e.g. "Fiverr" | "UpWork" | "Direct"
   image       string      path to main image  e.g. "images/VRLounge.webp"
   gallery     object[]    extra media items:
                           { type: "image" | "video", src: "path/to/file" }
   brief       string      1–2 sentence task description
   deliverables string[]   what you did (bullet points)
   review      object      { text, author, initials, stars, platform, country }
                              stars: 1-5 (optional), platform: "Fiverr"|"UpWork"|"Direct"
                              initials: 2-char avatar e.g. "SK" (optional)
   liveUrl     string      live site URL (omit or "#" to hide button)
   ═══════════════════════════════════════════════════════════════ */

const PROJECTS = [

  {
    id: 1,
    title: "Nations On Fire",
    type: "Church / Event Landing Page",
    stack: ["HTML", "CSS", "JavaScript", "GSAP"],
    year: "2024",
    country: "🇵🇱 Poland",
    client: "Christian Ministry · Nations On Fire",
    platform: "Personal",
    image: "images/NationsOnFire.webp",
    gallery: [
      { type: "image", src: "images/NationsOnFire1.webp" },
      { type: "image", src: "images/NationsOnFire2.webp" },
      { type: "image", src: "images/NationsOnFire3.webp" },
      { type: "image", src: "images/NationsOnFire4.webp" },
      { type: "image", src: "images/NationsOnFire9.webp" },
      { type: "image", src: "images/NationsOnFire5.webp" },
      { type: "image", src: "images/NationsOnFire6.webp" },
      { type: "image", src: "images/NationsOnFire7.webp" },
      { type: "image", src: "images/NationsOnFire8.webp" },
      { type: "image", src: "images/NationsOnFire10.webp" },
    ],
    brief: "A multi-page website for Nations On Fire — a Polish Christian missionary movement, featuring video hero, event listings, media gallery, and support/donation flow.",
    deliverables: [
      "Video background hero section",
      "Events listing page",
      "Media page",
      "Church/NOF info sections",
      "Support & donation CTA",
      "Responsive multi-page structure"
    ],
    review: {
      text: "Great use of animation. Smooth and engaging experience.",
      author: "Design Feedback",
      initials: "DF",
      stars: 5,
      platform: "Direct",
      country: "Poland"
    },
    liveUrl: "https://oleksandr549.github.io/Nations-On-Fire-git.io/"
  },

  {
    id: 2,
    title: "KAAS Kitchens",
    type: "Business Landing Page",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2025",
    country: "🇰🇿 Kazakhstan",
    client: "Furniture & Kitchen Business",
    platform: "Personal",
    image: "images/KAAS.webp",
    gallery: [
      { type: "image", src: "images/KAAS8.webp" },
      { type: "image", src: "images/KAAS6.webp" },
      { type: "image", src: "images/KAAS4.webp" },
      { type: "image", src: "images/KAAS3.webp" },
      { type: "image", src: "images/KAAS5.webp" },
      { type: "image", src: "images/KAAS2.webp" },
      { type: "image", src: "images/KAAS1.webp" },
    ],
    brief: "A multi-page landing site for KAAS Kitchens — a Kazakhstan-based furniture company selling custom kitchens and wardrobes, with showroom locations and a callback form.",
    deliverables: [
      "Multi-page structure (kitchens, wardrobes, showrooms, about)",
      "Product catalogue UI",
      "Contact & consultation CTA",
      "Social media integration (WhatsApp, Instagram, TikTok)",
      "Responsive layout"
    ],
    review: {
      text: "Professional and clear. Works great for a local furniture business.",
      author: "Client Feedback",
      initials: "CF",
      stars: 5,
      platform: "Direct",
      country: "Kazakhstan"
    },
    liveUrl: "https://oleksandr549.github.io/KAAS.github.io/"
  },

  {
    id: 3,
    title: "HTP Group — IT Consulting",
    type: "Corporate Landing Page",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2025",
    country: "🇺🇸 United States",
    client: "High Tech Pros Group Inc.",
    platform: "Personal",
    image: "images/HTP.webp",
    gallery: [
      { type: "image", src: "images/HTP1.webp" },
      { type: "image", src: "images/HTP2.webp" },
      { type: "image", src: "images/HTP5.webp" },
      { type: "image", src: "images/HTP4.webp" },
      { type: "image", src: "images/HTP3.webp" },
    ],
    brief: "A multi-page corporate website for HTP Group Inc. — a US IT staffing, offshore development, payrolling, and billing services company operating since 1997.",
    deliverables: [
      "Multi-page site (Home, Services, About, Contact)",
      "IT expertise & tech stack section",
      "Offshore development services",
      "Payrolling & billing services sections",
      "Phone CTA & LinkedIn integration"
    ],
    review: {
      text: "Clear and structured. Good for business presentation.",
      author: "Client Feedback",
      initials: "CF",
      stars: 5,
      platform: "UpWork",
      country: "USA"
    },
    liveUrl: "https://oleksandr549.github.io/HTP.github.io/"
  },

  {
    id: 4,
    title: "CaseHug — CS2 Skin Platform",
    type: "Gaming / E-commerce Landing",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2025",
    country: "🌍 Global",
    client: "CS2 Skin Trading Platform",
    platform: "Personal",
    image: "images/CaseHyg.webp",
    gallery: [
      { type: "image", src: "images/CaseHyg1.webp" },
      { type: "image", src: "images/CaseHyg2.webp" },
      { type: "image", src: "images/CaseHyg3.webp" },
      { type: "image", src: "images/CaseHyg4.webp" },
    ],
    brief: "A promo landing page for CaseHug — a CS2 skin case-opening and trading platform, featuring top skins, hot cases, daily rewards, and a partner team section.",
    deliverables: [
      "Hero with promo CTA (+20% bonus)",
      "Top skins & hot cases listings",
      "Daily cases reward section",
      "Official esports partner banner",
      "Live support & instant platform UI",
      "Steam login integration link"
    ],
    review: {
      text: "Very clean and professional. Builds trust immediately.",
      author: "Client Feedback",
      initials: "CF",
      stars: 5,
      platform: "Fiverr",
      country: "United Kingdom"
    },
    liveUrl: "https://oleksandr549.github.io/CaseHyg.github.io/"
  },

  {
    id: 5,
    title: "TaskFlow",
    type: "Web App",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2025",
    country: "🇵🇱 Poland",
    client: "AI Productivity Tool",
    platform: "Personal",
    image: "images/TaskFlow.webp",
    gallery: [
      { type: "image", src: "images/TaskFlow4.webp" },
      { type: "image", src: "images/TaskFlow1.webp" },
      { type: "image", src: "images/TaskFlow2.webp" },
      { type: "image", src: "images/TaskFlow3.webp" },
    ],
    brief: "A fully functional AI-powered task manager web app with dashboard, projects, calendar, analytics, AI assistant (Anthropic API), and export — built in Polish.",
    deliverables: [
      "Dashboard with live stats",
      "AI task generation from description (Anthropic API)",
      "AI chat assistant",
      "Project & task management system",
      "Calendar & analytics views",
      "Weekly AI productivity report",
      "Data export"
    ],
    review: {
      text: "Simple and effective. Great base for a SaaS product.",
      author: "Product Feedback",
      initials: "PF",
      stars: 5,
      platform: "Direct",
      country: "Poland"
    },
    liveUrl: "https://oleksandr549.github.io/TaskFlow.github.io/"
  },

  {
    id: 6,
    title: "Restaurant Business",
    type: "Restaurant Landing Page",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2025",
    country: "🌍 Global",
    client: "Restaurant",
    platform: "Personal",
    image: "images/Restaurant.webp",
    gallery: [
      { type: "image", src: "images/Restaurant1.webp" },
      { type: "image", src: "images/Restaurant2.webp" },
      { type: "image", src: "images/Restaurant3.webp" },
      { type: "image", src: "images/Restaurant4.webp" },
    ],
    brief: "A Russian-language restaurant landing page featuring the brand story, food gallery, menu stats, and a table reservation CTA.",
    deliverables: [
      "Full-screen hero with reservation CTA",
      "Brand story section",
      "Dish gallery grid",
      "Menu stats (drinks, food, snacks)",
      "Table booking form",
      "Responsive design"
    ],
    review: {
      text: "Clean and appetizing design. Works great for a restaurant.",
      author: "UI Feedback",
      initials: "UF",
      stars: 5,
      platform: "Direct",
      country: "Global"
    },
    liveUrl: "https://oleksandr549.github.io/Restaurant-Busienss.github.io/"
  },

  {
    id: 7,
    title: "Digital Journalism & CSA",
    type: "Editorial / Interactive Article",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2025",
    country: "🇪🇺 Europe",
    client: "Academic Project · Journalism",
    platform: "Personal",
    image: "images/SexualAssault.webp",
    gallery: [
      { type: "image", src: "images/SexualAssault2.webp" },
      { type: "image", src: "images/SexualAssault1.webp" },
      { type: "image", src: "images/SexualAssault3.webp" },
      { type: "image", src: "images/SexualAssault4.webp" }
    ],
    brief: "A long-form digital journalism project exploring ethics of reporting on child sexual assault, combining survivor storytelling, research, and trauma-informed UX.",
    deliverables: [
      "Long-form editorial layout",
      "Multi-section scroll navigation",
      "Survivor story presentation system",
      "Responsive typography & content hierarchy",
      "Data & research sections"
    ],
    review: {
      text: "A powerful and well-structured digital experience. The content is presented clearly and professionally.",
      author: "Academic Reviewer",
      initials: "AR",
      stars: 5,
      platform: "Direct",
      country: "Poland"
    },
    liveUrl: "https://oleksandr549.github.io/SexualAssault.github.io/"
  },

  {
    id: 8,
    title: "Levantine Collective",
    type: "Editorial / Landing Page",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2025",
    country: "🇬🇧 United Kingdom",
    client: "Cultural Creative Collective · London",
    platform: "Personal",
    image: "images/LevantineCollective.webp",
    gallery: [
      { type: "image", src: "images/LevantineCollective3.webp" },
      { type: "image", src: "images/LevantineCollective2.webp" },
      { type: "image", src: "images/LevantineCollective1.webp" },
      { type: "image", src: "images/LevantineCollective4.webp" },
    ],
    brief: "A cultural landing page for The Levantine Collective — a London-based creative community celebrating Levantine identity through art, story, and community, featuring an interactive quiz and video section.",
    deliverables: [
      "Brand-focused editorial UI",
      "Interactive cultural quiz",
      "Embedded video section (Tatreez)",
      "Responsive layout",
      "Multi-page navigation structure"
    ],
    review: {
      text: "Elegant and modern design. Strong visual identity and great attention to detail.",
      author: "Design Feedback",
      initials: "DF",
      stars: 5,
      platform: "Direct",
      country: "Poland"
    },
    liveUrl: "https://oleksandr549.github.io/LevantineCollective.github.io/"
  },

  {
    id: 9,
    title: "VR Lounge",
    type: "Landing Page",
    stack: ["HTML", "CSS", "JavaScript", "GSAP"],
    year: "2025",
    country: "🇺🇸 United States",
    client: "VR Entertainment Business",
    platform: "Fiverr",
    image: "images/VRLounge.webp",
    gallery: [
      { type: "image", src: "images/VRLounge1.webp" },

    

    ],
    brief: "A conversion-focused landing page for a real VR lounge business, showcasing attractions with pricing, photo gallery, FAQ, and a waiver page.",
    deliverables: [
      "Hero section with animated CTA",
      "Attractions & pricing cards",
      "Real photo gallery",
      "FAQ accordion",
      "Waiver subpage",
      "Responsive layout"
    ],
    review: {
      text: "Modern, smooth, and very engaging. Exactly what we needed.",
      author: "Client · USA",
      initials: "CU",
      stars: 5,
      platform: "UpWork",
      country: "USA"
    },
    liveUrl: "https://oleksandr549.github.io/VRLounge2.github.io/"
  },

  {
    id: 10,
    title: "SwipeRoulette — Chat App",
    type: "Web App",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2024",
    country: "🌍 Global",
    client: "Social App Concept",
    platform: "Personal",
    image: "images/Chat0.webp",
    gallery: [
      { type: "image", src: "images/Chat1.webp" },
      { type: "image", src: "images/Chat2.webp" },
      { type: "image", src: "images/Chat3.webp" },
      { type: "image", src: "images/Chat4.webp" },

    ],
    brief: "A full-featured random chat web app UI — SwipeRoulette — with gender/region filters, subscription plans, user profiles, and an online counter.",
    deliverables: [
      "Chat interface with message list",
      "User profile & edit system",
      "Gender & region filter UI",
      "Subscription / pricing plans",
      "Authentication modals (Sign In / Register)"
    ],
    review: {
      text: "Simple, clean, and very usable interface. Feels like a real product.",
      author: "UI Feedback",
      initials: "UI",
      stars: 5,
      platform: "Direct",
      country: "Poland"
    },
    liveUrl: "https://oleksandr549.github.io/Chat.github.io/"
  },

  {
    id: 11,
    title: "Matrix Technology",
    type: "Business / Product Landing Page",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2024",
    country: "🇵🇱 Poland",
    client: "Matrix Technology · VR/5D Attractions",
    platform: "Direct",
    image: "images/Matrix.webp",
    gallery: [
      { type: "image", src: "images/Matrix1.webp" },
      { type: "image", src: "images/Matrix2.webp" },
      { type: "image", src: "images/Matrix3.webp" },
      { type: "image", src: "images/Matrix4.webp" },

    ],
    brief: "A corporate product website for Matrix Technology — a Polish company manufacturing VR and 5D attraction capsules for shopping malls, with a product catalogue, about section, and bilingual support (EN/PL).",
    deliverables: [
      "Video hero section",
      "Product catalogue (VR/5D capsules)",
      "Stats & brand growth counters",
      "Bilingual navigation (EN / PL)",
      "Contact page"
    ],
    review: {
      text: "Unique and visually striking concept. Feels very experimental and modern.",
      author: "Creative Feedback",
      initials: "CR",
      stars: 5,
      platform: "Direct",
      country: "Global"
    },
    liveUrl: "http://matrix.dreamerstudio.pl/"
  },

  {
    id: 12,
    title: "QBL — Industrial Storage Systems",
    type: "B2B Landing Page",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2024",
    country: "🇵🇱 Poland",
    client: "Industrial Equipment Manufacturer",
    platform: "Personal",
    image: "images/QBL.webp",
    gallery: [
      { type: "image", src: "images/QBL1.webp" },
      { type: "image", src: "images/QBL2.webp" },
      { type: "image", src: "images/QBL3.webp" },
      { type: "image", src: "images/QBL4.webp" },
      { type: "image", src: "images/QBL5.webp" },
      { type: "image", src: "images/QBL6.webp" },
      { type: "image", src: "images/QBL7.webp" },

    ],
    brief: "A multi-page B2B website for an industrial storage and shelving systems company, featuring a full product catalogue, references, technology, and advantages sections.",
    deliverables: [
      "Multi-page B2B structure",
      "Product catalogue (storage, drying, shop display systems)",
      "Full-width banner sections",
      "Bilingual support (EN / PL)",
      "Contact & login UI"
    ],
    review: {
      text: "Clean and professional. Well-structured for business use.",
      author: "Client Feedback",
      initials: "CF",
      stars: 5,
      platform: "Fiverr",
      country: "USA"
    },
    liveUrl: "https://oleksandr549.github.io/QBL.github.io/"
  },

  {
    id: 13,
    title: "Dream Apart",
    type: "Apartment Booking Platform",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2024",
    country: "🇵🇱 Poland",
    client: "Vacation Rental Platform",
    platform: "Personal",
    image: "images/DreamApart.webp",
    gallery: [
      { type: "image", src: "images/DreamApart1.webp" },
      { type: "image", src: "images/DreamApart2.webp" },
      { type: "image", src: "images/DreamApart3.webp" },
      { type: "image", src: "images/DreamApart4.webp" },
      { type: "image", src: "images/DreamApart5.webp" },
      { type: "image", src: "images/DreamApart6.webp" },
      { type: "image", src: "images/DreamApart7.webp" },
      { type: "image", src: "images/DreamApart8.webp" },
      { type: "image", src: "images/DreamApart9.webp" },
      { type: "image", src: "images/DreamApart10.webp" },
     

    ],
    brief: "A Polish vacation apartment booking platform UI with location/guests search, map view, filters, and a ski-resort-focused property listing.",
    deliverables: [
      "Search bar with location, dates & guest count",
      "Property listing cards with ski amenity icons",
      "Map integration placeholder",
      "Filter UI",
      "Bilingual support (PL / EN)",
      "Promo code & discount banner"
    ],
    review: {
      text: "Beautiful and atmospheric design. Strong visual mood.",
      author: "Design Feedback",
      initials: "DF",
      stars: 5,
      platform: "Direct",
      country: "Poland"
    },
    liveUrl: "https://oleksandr549.github.io/DreamApart/"
  },

  {
    id: 14,
    title: "SkiCarv",
    type: "Service Booking Landing Page",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2025",
    country: "🇵🇱 Poland",
    client: "Ski School & Equipment Rental",
    platform: "Personal",
    image: "images/Ski.webp",
    gallery: [
      { type: "image", src: "images/Ski1.webp" },
      { type: "image", src: "images/Ski2.webp" },
      { type: "image", src: "images/Ski3.webp" },
      { type: "image", src: "images/Ski4.webp" },
      { type: "image", src: "images/Ski5.webp" },
      { type: "image", src: "images/Ski6.webp" },
      { type: "image", src: "images/Ski7.webp" },

    ],
    brief: "A Polish ski school and equipment rental booking page, featuring lesson type selector, slope chooser, participant counter, and an equipment rental calculator.",
    deliverables: [
      "Lesson type & slope selector UI",
      "Adults / children counter with equipment toggle",
      "Booking inquiry form",
      "Social media links",
      "Responsive layout"
    ],
    review: {
      text: "Dynamic and energetic design. Matches the product well.",
      author: "Design Feedback",
      initials: "DF",
      stars: 5,
      platform: "Direct",
      country: "Global"
    },
    liveUrl: "https://oleksandr549.github.io/Ski-Carv.github.io/"
  },

  {
    id: 15,
    title: "KARMA Hair Transplant",
    type: "Medical / Business Landing Page",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2025",
    country: "🇩🇪 Germany",
    client: "KARMA Hair · Munich Hair Transplant Clinic",
    platform: "Fiverr",
    image: "images/KARMA.webp",
    gallery: [
      { type: "image", src: "images/KARMA1.webp" },
      { type: "image", src: "images/KARMA2.webp" },
      { type: "image", src: "images/KARMA3.webp" },
      { type: "image", src: "images/KARMA4.webp" },


    ],
    brief: "A German-language medical landing page for KARMA Hair — a Munich hair transplant clinic offering Turkish-standard FUE procedures, with before/after comparison, team, FAQ, and appointment booking.",
    deliverables: [
      "Medical service hero with appointment CTA",
      "Before/after comparison section",
      "Team & specialist profiles",
      "Blog with sidebar variations",
      "FAQ section",
      "Contact & map section",
      "Multi-page blog structure"
    ],
    review: {
      text: "Great showcase piece. Professional medical presentation.",
      author: "Fiverr Client · Germany",
      initials: "GE",
      stars: 5,
      platform: "Fiverr",
      country: "Germany"
    },
    liveUrl: "https://oleksandr549.github.io/fiverdemo.github.io/"
  },

  {
    id: 16,
    title: "Finsweet — Eco NGO Website",
    type: "NGO / Non-Profit Landing Page",
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2025",
    country: "🌍 Global",
    client: "Environmental Organization Concept",
    platform: "Personal",
    image: "images/Finsweet.webp",
    gallery: [
      { type: "image", src: "images/Finsweet1.webp" },
      { type: "image", src: "images/Finsweet2.webp" },
      { type: "image", src: "images/Finsweet3.webp" },
      { type: "image", src: "images/Finsweet4.webp" },
      { type: "image", src: "images/Finsweet5.webp" },
      { type: "image", src: "images/Finsweet6.webp" },
      { type: "image", src: "images/Finsweet7.webp" },
      { type: "image", src: "images/Finsweet8.webp" },
      { type: "image", src: "images/Finsweet9.webp" },
      { type: "image", src: "images/Finsweet10.webp" }
  
     

    ],
    brief: "A Finsweet-style premium agency website built as an environmental NGO concept — featuring tree planting stats, donation flow, project showcase, supporter logos, and a blog.",
    deliverables: [
      "Hero with live stats (trees planted, donations)",
      "Mission & about sections",
      "Project showcase grid",
      "Donation allocation pie chart",
      "Blog with multi-layout support",
      "Volunteer & donate CTA"
    ],
    review: {
      text: "Looks like a premium agency website. Clean and modern.",
      author: "Design Feedback",
      initials: "DF",
      stars: 5,
      platform: "Direct",
      country: "Poland"
    },
    liveUrl: "https://oleksandr549.github.io/finsweetwebsiteoleksandr.github.io/home.html"
  }

];