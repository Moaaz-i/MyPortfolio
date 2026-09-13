// jprot config — Moaaz Yahia Zakaria Portfolio
const SITE_URL = "https://moaaz-i.vercel.app";
const AVATAR = "/avatar.png";

/** @type {import('jprot').JprotConfig} */
export default {
  title: "Moaaz Yahia Zakaria",
  tagline:
    "Full-Stack & Systems Engineer — Building zero-dependency developer tools, high-performance backends, and lightweight C++ engines. Available for hire.",
  description:
    "Portfolio of Moaaz Yahia Zakaria — Full-Stack & Systems Engineer specializing in zero-dependency developer tools, Node.js HTTP frameworks, encrypted databases, and embedded C++ systems.",
  lang: "en",
  dir: "ltr",
  url: SITE_URL,
  author: "Moaaz Yahia Zakaria",
  email: "moaaz.yahia.shrif@gmail.com",
  themeColor: "#4f46e5",
  avatar: AVATAR,
  ogImage: SITE_URL + AVATAR,

  // SEO / social
  ogColor: "#1e1b4b",
  ogTextColor: "#ffffff",
  sameAs: ["https://github.com/Moaaz-i"],
  twitter: "@Moaaz_i",

  themePicker: false,

  // Hero
  hero: {
    title: "Moaaz Yahia Zakaria",
    avatar: AVATAR,
    subtitle:
      "Full-Stack & Systems Engineer — I build zero-dependency tools, encrypted databases, HTTP engines, and real-time embedded systems. Always shipping, always learning.",
    links: [
      { label: "View Projects", url: "#projects" },
      { label: "GitHub", url: "https://github.com/Moaaz-i" },
      { label: "Contact", url: "#contact" },
    ],
  },

  // Homepage projects section
  projectsTitle: "Featured Work",

  // Footer
  footerText: "© 2026 Moaaz Yahia Zakaria · Built with JPROT",

  // Navigation
  nav: [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Projects", url: "/#projects" },
    { label: "Resume", url: "/resume" },
    { label: "Blog", url: "/blog" },
    { label: "Repos", url: "/repos" },
  ],

  // Labels
  labels: {
    all: "All",
    liveDemo: "Live Demo",
    source: "Source",
    details: "Details",
    noPosts: "No posts yet.",
    searchPlaceholder: "Search pages, posts, tags...",
    searchEmpty: "No results",
    onThisPage: "On this page",
    printResume: "Download / Print",
    resumeExperience: "Experience",
    resumeEducation: "Education",
    resumeSkills: "Skills",
    pageNotFound: "Page not found",
    backToHome: "Back to",
    home: "Home",
    projects: "Projects",
    blog: "Blog",
  },

  // Homepage sections
  sections: [
    {
      component: "Stats",
      items: [
        { value: "50+", label: "Public Repositories" },
        { value: "12+", label: "Open-Source Tools" },
        { value: "5+", label: "Languages & Runtimes" },
        { value: "100%", label: "Zero-Dep Philosophy" },
      ],
    },
    {
      component: "Skills",
      title: "Technical Skills",
      items: [
        { name: "JavaScript / Node.js", level: 95 },
        { name: "TypeScript", level: 82 },
        { name: "C++ (Systems & Embedded)", level: 85 },
        { name: "React / Next.js", level: 85 },
        { name: "HTML / CSS", level: 90 },
        { name: "Embedded (Arduino / ESP32)", level: 85 },
        { name: "Python / FastAPI", level: 70 },
        { name: "CI/CD & DevOps", level: 72 },
      ],
    },
    {
      component: "Services",
      title: "What I Do",
      subtitle:
        "End-to-end engineering across the full stack and into the hardware.",
      items: [
        {
          icon: "⚡",
          title: "Full-Stack Web Development",
          description:
            "End-to-end applications with React, Next.js, Node.js, TypeScript, and modern REST APIs. Clean architecture, real-time features, and production-ready deployments.",
          link: "#projects",
        },
        {
          icon: "🔧",
          title: "Developer Tooling & Frameworks",
          description:
            "CLI tools, HTTP frameworks, task schedulers, compilers, and VS Code extensions — the kind of software that makes other developers faster.",
          link: "#projects",
        },
        {
          icon: "⚙️",
          title: "Systems & Embedded Engineering",
          description:
            "High-performance C++ engines, micro-RTOS frameworks for Arduino/ESP32, audio synthesis, and firmware with sub-millisecond startup.",
          link: "#projects",
        },
        {
          icon: "🔒",
          title: "Backend Architecture & Security",
          description:
            "Zero-knowledge encrypted databases, authentication systems, rate limiting, and API design built for scale and privacy.",
          link: "#projects",
        },
      ],
    },
    {
      component: "Testimonials",
      title: "What People Say",
      items: [
        {
          text: "Moaaz shipped a zero-dependency task scheduler with a real-time dashboard that replaced an entire Redis stack in our pipeline. Exceptional systems thinking.",
          name: "Open-Source Contributor",
          role: "CronFlex user",
        },
        {
          text: "His C++ HTTP engine inside Node.js is the kind of work most developers would never attempt — custom parser, radix router, sub-millisecond static responses.",
          name: "Node.js Maintainer",
          role: "Code reviewer",
        },
        {
          text: "I used MicroTaskX on an ESP32 project and the CPU profiling + automatic sleep kept battery life through the roof. Clean, well-documented firmware engineering.",
          name: "Embedded Hobbyist",
          role: "Arduino library user",
        },
      ],
    },
    {
      component: "Learning",
      title: "Learning Journey",
      subtitle:
        "Early training builds and coursework — where the front-end fundamentals took shape.",
      stages: [
        {
          name: "HTML & CSS",
          items: [
            {
              name: "Fokir",
              desc: "Personal portfolio template",
              lang: "CSS",
              url: "https://github.com/Moaaz-i/Fokir",
            },
            {
              name: "Mealify",
              desc: "Restaurant landing template",
              lang: "CSS",
              url: "https://github.com/Moaaz-i/Mealify",
            },
            {
              name: "DevFolio",
              desc: "Developer portfolio template",
              lang: "HTML",
              url: "https://github.com/Moaaz-i/DevFolio",
            },
            {
              name: "Grid Masterclass",
              desc: "CSS Grid layout practice",
              lang: "HTML",
              url: "https://github.com/Moaaz-i/Grid_masterclass",
            },
            {
              name: "Engage Bakery",
              desc: "Bakery homepage clone",
              lang: "HTML",
              url: "https://github.com/Moaaz-i/Engage_Bakery-html",
            },
            {
              name: "Exam",
              desc: "Exam / assessment page",
              lang: "HTML",
              url: "https://github.com/Moaaz-i/Exam",
            },
          ],
        },
        {
          name: "JavaScript & Apps",
          items: [
            {
              name: "Random Quote Generator",
              desc: "Quote generator widget",
              lang: "JS",
              url: "https://github.com/Moaaz-i/Random-Quote-Generator",
            },
            {
              name: "Weather",
              desc: "Weather card widget",
              lang: "JS",
              url: "https://github.com/Moaaz-i/Weather",
            },
            {
              name: "SPA Task",
              desc: "Single-page app exercise",
              lang: "JS",
              url: "https://github.com/Moaaz-i/spa-task",
              demo: "https://spa-task-xi.vercel.app",
            },
            {
              name: "Login System",
              desc: "Login flow exercise",
              lang: "JS",
              url: "https://github.com/Moaaz-i/Login-System",
            },
            {
              name: "CRUD System",
              desc: "CRUD list app",
              lang: "JS",
              url: "https://github.com/Moaaz-i/crud_system",
            },
            {
              name: "Bookmark",
              desc: "Bookmark manager",
              lang: "TS",
              url: "https://github.com/Moaaz-i/Bookmark",
            },
            {
              name: "Editable Table",
              desc: "In-place editable table",
              lang: "JS",
              url: "https://github.com/Moaaz-i/editable-table",
            },
            {
              name: "JS Assignment #1",
              desc: "First JS coursework",
              lang: "JS",
              url: "https://github.com/Moaaz-i/js-assignment-1",
            },
          ],
        },
      ],
    },
    {
      component: "CTA",
      title: "Have a project in mind?",
      text: "I'm available for freelance work and full-time roles. Let's build something fast, minimal, and production-ready.",
      label: "Start a conversation",
      url: "mailto:moaaz.yahia.shrif@gmail.com",
    },
    {
      component: "Contact",
      title: "Get in Touch",
      subtitle:
        "Open to freelance projects and full-time roles. Let's build something great.",
      email: "moaaz.yahia.shrif@gmail.com",
      social: [{ label: "GitHub", url: "https://github.com/Moaaz-i" }],
    },
  ],

  // Extra <head> tags
  head: `<link rel="icon" type="image/png" href="${AVATAR}">
    <link rel="apple-touch-icon" href="${AVATAR}">
    <script src="/hash-scroll.js" defer></script>
    <script src="/repos-pager.js" defer></script>
    <script src="/live-shots.js" defer></script>`,
};
