/**
 * Seed script — populates the database with categories and the full app catalog.
 * Run with:  pnpm --filter @trueapp/api db:seed
 *
 * WARNING: This script TRUNCATES existing data before seeding.
 */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL is required. Export it before running this script.");
  process.exit(1);
}

const queryClient = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(queryClient, { schema });

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const j = (v: unknown) => JSON.stringify(v);

// ─────────────────────────────────────────────
// Category seed data
// ─────────────────────────────────────────────

const CATEGORY_ROWS = [
  {
    id: "productivity",
    slug: "productivity",
    label: "Productivity",
    icon: "⚡",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    accent: "#8b5cf6",
    description: "Tools that help you focus, create, and ship faster.",
    appCount: 84,
    subcategories: j([
      { id: "note-taking", label: "Note-Taking", icon: "📝", micros: [{ id: "long-form", label: "Long-form Writing" }, { id: "quick-capture", label: "Quick Capture" }, { id: "visual-notes", label: "Visual Notes" }, { id: "markdown", label: "Markdown-first" }] },
      { id: "task-management", label: "Task Management", icon: "✅", micros: [{ id: "todo", label: "To-do Lists" }, { id: "gtd", label: "GTD System" }, { id: "kanban", label: "Kanban Boards" }, { id: "daily-planner", label: "Daily Planner" }] },
      { id: "time-tracking", label: "Time Tracking", icon: "⏱", micros: [{ id: "pomodoro", label: "Pomodoro" }, { id: "billable-hours", label: "Billable Hours" }, { id: "focus-timer", label: "Focus Timer" }] },
      { id: "launchers", label: "Launchers & Shortcuts", icon: "🚀", micros: [{ id: "app-launcher", label: "App Launcher" }, { id: "clipboard", label: "Clipboard Manager" }, { id: "snippets", label: "Text Snippets" }] },
    ]),
    intentTags: j(["I want to focus more", "I need to manage tasks", "I want to capture ideas"]),
  },
  {
    id: "design",
    slug: "design",
    label: "Design & Creative",
    icon: "🎨",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
    accent: "#ec4899",
    description: "Create, iterate, and ship world-class visual work.",
    appCount: 56,
    subcategories: j([
      { id: "ui-ux", label: "UI/UX Design", icon: "🖥", micros: [{ id: "prototyping", label: "Prototyping" }, { id: "wireframing", label: "Wireframing" }, { id: "design-systems", label: "Design Systems" }, { id: "handoff", label: "Dev Handoff" }] },
      { id: "illustration", label: "Illustration & Art", icon: "✏️", micros: [{ id: "vector", label: "Vector Art" }, { id: "digital-painting", label: "Digital Painting" }, { id: "pixel-art", label: "Pixel Art" }] },
      { id: "photo-editing", label: "Photo Editing", icon: "📸", micros: [{ id: "ai-enhanced", label: "AI-Enhanced" }, { id: "professional", label: "Professional" }, { id: "quick-edit", label: "Quick Edit" }] },
      { id: "video", label: "Video Production", icon: "🎬", micros: [{ id: "editing", label: "Editing" }, { id: "motion", label: "Motion Graphics" }, { id: "color", label: "Color Grading" }] },
    ]),
    intentTags: j(["I need to prototype UI", "I want to edit photos", "I want to create illustrations"]),
  },
  {
    id: "developer-tools",
    slug: "developer-tools",
    label: "Developer Tools",
    icon: "⌨️",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
    accent: "#0ea5e9",
    description: "Everything engineers need to build, debug, and ship.",
    appCount: 72,
    subcategories: j([
      { id: "database", label: "Database Tools", icon: "🗃", micros: [{ id: "gui", label: "GUI Clients" }, { id: "query", label: "Query Editors" }, { id: "migration", label: "Migration Tools" }] },
      { id: "api", label: "API Development", icon: "🔌", micros: [{ id: "testing", label: "API Testing" }, { id: "mocking", label: "API Mocking" }, { id: "docs", label: "Documentation" }] },
      { id: "network", label: "Network & Debugging", icon: "🌐", micros: [{ id: "proxy", label: "HTTP Proxy" }, { id: "traffic", label: "Traffic Analysis" }] },
      { id: "project-mgmt", label: "Project Management", icon: "📋", micros: [{ id: "issue-tracking", label: "Issue Tracking" }, { id: "roadmaps", label: "Roadmaps" }] },
    ]),
    intentTags: j(["I need a database GUI", "I want to debug APIs", "I want to manage devops"]),
  },
  {
    id: "communication",
    slug: "communication",
    label: "Communication",
    icon: "💬",
    gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
    accent: "#10b981",
    description: "Better email, messaging, and team communication tools.",
    appCount: 38,
    subcategories: j([
      { id: "email", label: "Email Clients", icon: "📧", micros: [{ id: "ai-email", label: "AI-Enhanced Email" }, { id: "productivity-email", label: "Productivity-First" }] },
      { id: "messaging", label: "Team Messaging", icon: "💬", micros: [{ id: "async", label: "Async-First" }, { id: "real-time", label: "Real-Time Chat" }] },
      { id: "video-calls", label: "Video & Calls", icon: "📹", micros: [{ id: "meetings", label: "Meetings" }, { id: "async-video", label: "Async Video" }] },
    ]),
    intentTags: j(["I want better email workflows", "I need team messaging", "I want async communication"]),
  },
  {
    id: "security",
    slug: "security",
    label: "Security & Privacy",
    icon: "🔒",
    gradient: "linear-gradient(135deg, #22c55e 0%, #059669 100%)",
    accent: "#22c55e",
    description: "Protect your passwords, privacy, and digital identity.",
    appCount: 41,
    subcategories: j([
      { id: "passwords", label: "Password Managers", icon: "🔐", micros: [{ id: "personal", label: "Personal" }, { id: "family", label: "Family Sharing" }, { id: "business", label: "Business" }] },
      { id: "vpn", label: "VPN & Privacy", icon: "🌐", micros: [{ id: "vpn", label: "VPN Services" }, { id: "dns", label: "Private DNS" }] },
      { id: "2fa", label: "Two-Factor Auth", icon: "🗝", micros: [{ id: "totp", label: "TOTP Apps" }, { id: "hardware", label: "Hardware Keys" }] },
    ]),
    intentTags: j(["I need a password manager", "I want privacy online", "I want better 2FA"]),
  },
  {
    id: "utilities",
    slug: "utilities",
    label: "Utilities & System",
    icon: "🛠",
    gradient: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    accent: "#94a3b8",
    description: "System utilities, cleaners, and essential Mac tools.",
    appCount: 47,
    subcategories: j([
      { id: "system", label: "System Tools", icon: "⚙️", micros: [{ id: "cleaners", label: "Mac Cleaners" }, { id: "monitors", label: "Performance Monitors" }] },
      { id: "quick-capture", label: "Quick Capture", icon: "📋", micros: [{ id: "scratchpad", label: "Scratchpads" }, { id: "clipboard", label: "Clipboard Tools" }] },
      { id: "file-mgmt", label: "File Management", icon: "📁", micros: [{ id: "finders", label: "Finder Replacements" }, { id: "sync", label: "File Sync" }] },
    ]),
    intentTags: j(["I want to clean up my Mac", "I need a quick scratchpad", "I want system monitoring"]),
  },
  {
    id: "writing",
    slug: "writing",
    label: "Writing & Publishing",
    icon: "✍️",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    accent: "#f59e0b",
    description: "Distraction-free writing, editing, and publishing tools.",
    appCount: 29,
    subcategories: j([
      { id: "word-processors", label: "Word Processors", icon: "📄", micros: [{ id: "long-form-2", label: "Long-Form" }, { id: "academic", label: "Academic" }] },
      { id: "screenwriting", label: "Screenwriting", icon: "🎬", micros: [{ id: "scripts", label: "Scripts & Screenplays" }] },
      { id: "blogging", label: "Blogging & CMS", icon: "📰", micros: [{ id: "cms", label: "Content Management" }, { id: "static", label: "Static Sites" }] },
    ]),
    intentTags: j(["I want to write distraction-free", "I need to write a book", "I want to publish online"]),
  },
  {
    id: "finance",
    slug: "finance",
    label: "Finance & Money",
    icon: "💰",
    gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    accent: "#14b8a6",
    description: "Budget, invest, and track your personal finances.",
    appCount: 33,
    subcategories: j([
      { id: "budgeting", label: "Budgeting", icon: "📊", micros: [{ id: "zero-based", label: "Zero-Based" }, { id: "tracking", label: "Expense Tracking" }] },
      { id: "investing", label: "Investing", icon: "📈", micros: [{ id: "stocks", label: "Stocks & ETFs" }, { id: "crypto", label: "Cryptocurrency" }] },
    ]),
    intentTags: j(["I want to manage my money", "I need to track spending", "I want to invest"]),
  },
  {
    id: "health",
    slug: "health",
    label: "Health & Fitness",
    icon: "💪",
    gradient: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
    accent: "#f97316",
    description: "Apps that help you sleep better, move more, and feel good.",
    appCount: 52,
    subcategories: j([
      { id: "fitness", label: "Fitness & Workouts", icon: "🏋️", micros: [{ id: "strength", label: "Strength Training" }, { id: "cardio", label: "Cardio" }] },
      { id: "meditation", label: "Mindfulness", icon: "🧘", micros: [{ id: "meditation-apps", label: "Meditation" }, { id: "sleep", label: "Sleep Tracking" }] },
    ]),
    intentTags: j(["I want healthier habits", "I need better sleep", "I want to track fitness"]),
  },
  {
    id: "education",
    slug: "education",
    label: "Education & Learning",
    icon: "📚",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
    accent: "#8b5cf6",
    description: "Learn anything — languages, code, science, and more.",
    appCount: 44,
    subcategories: j([
      { id: "languages", label: "Languages", icon: "🌍", micros: [{ id: "vocab", label: "Vocabulary" }, { id: "immersion", label: "Immersion Learning" }] },
      { id: "coding-learn", label: "Coding", icon: "💻", micros: [{ id: "courses", label: "Courses" }, { id: "practice", label: "Practice" }] },
    ]),
    intentTags: j(["I want to learn to code", "I want to learn a language", "I want to study effectively"]),
  },
];

// ─────────────────────────────────────────────
// App seed data
// ─────────────────────────────────────────────

const APP_ROWS = [
  // ── Notion ─────────────────────────────────
  {
    id: "notion", slug: "notion", name: "Notion",
    tagline: "All-in-one workspace for notes, wikis, databases, and projects",
    description: "Notion blends notes, databases, kanban boards, and wikis into one powerful canvas. Millions of teams use it to build everything from company handbooks to engineering specs — and argue endlessly about the right way to structure their workspace.",
    logoEmoji: "📝", logoGradient: "from-slate-700 to-slate-900",
    developer: "Notion Labs, Inc.", website: "https://notion.so",
    platforms: j(["web", "macos", "ios", "android"]),
    categoryId: "productivity", subcategoryId: "note-taking",
    tags: j([{ id: "ai-powered", label: "AI-Powered", variant: "violet" }, { id: "team-ready", label: "Team-Ready", variant: "blue" }, { id: "freemium", label: "Freemium", variant: "emerald" }, { id: "flexible", label: "Highly Flexible", variant: "slate" }]),
    alternativeIds: j(["craft", "bear", "linear"]),
    isFeatured: true, isTrending: false, isEditorsPick: false, launchYear: 2016,
    score: { overall: 7.8, privacy: 6.5, valueForMoney: 7.2, uxDesign: 8.5, pricingTransparency: 7.8, noAds: 10, onboarding: 6.8, support: 7.2, verdict: "great", verdictText: "Notion is a productivity powerhouse with exceptional design, but AI add-ons inflate costs and privacy could be stronger." },
    pricing: { model: "freemium", hasFreeVersion: true, monthlyPrice: "$12", annualPrice: "$96/yr", oneTimePrice: null, trialDays: null, annualDiscount: "20%", hiddenCosts: j(["Notion AI is $10/mo per member (not included in base plan)", "Guests counted toward member limits on paid plans"]), paywallAggression: 2, summary: "Generous free tier for individuals. Team plans feel fair at $12/mo, but the AI add-on significantly increases costs for teams. Annual billing saves 20%." },
    review: { count: 4821, pros: j(["Infinite flexibility — build virtually any system", "Beautiful, polished editing experience", "Free tier is genuinely usable long-term", "Real-time collaboration is seamless", "Huge template ecosystem from the community"]), cons: j(["Notion AI costs extra and feels bolted-on rather than native", "Performance degrades in very large workspaces", "Steep learning curve for new users", "Offline sync is unreliable, especially on mobile", "Privacy-conscious users should note US data hosting"]), expertVerdict: "Notion remains the gold standard for flexible knowledge management, but the push toward AI add-ons and the complex pricing for teams means it's no longer the obvious choice for everyone. For individuals, the free tier is hard to beat.", featuredQuoteText: "I replaced six tools with Notion. Then slowly rebuilt two of those tools elsewhere. It's powerful but requires discipline to avoid over-engineering.", featuredQuoteAuthor: "Marcus T.", featuredQuoteRole: "Product Manager at a Series B startup" },
  },
  // ── Linear ─────────────────────────────────
  {
    id: "linear", slug: "linear", name: "Linear",
    tagline: "Issue tracking and project management built for speed",
    description: "Linear is the project management tool that's actually fast. Built for modern software teams, it combines issue tracking, cycles, roadmaps, and projects into a crisp, keyboard-first experience.",
    logoEmoji: "◆", logoGradient: "from-violet-600 to-indigo-700",
    developer: "Linear Orbit, Inc.", website: "https://linear.app",
    platforms: j(["web", "macos", "ios"]),
    categoryId: "developer-tools", subcategoryId: "project-mgmt",
    tags: j([{ id: "premium-design", label: "Premium Design", variant: "violet" }, { id: "keyboard-first", label: "Keyboard-First", variant: "blue" }, { id: "freemium", label: "Freemium", variant: "emerald" }, { id: "fast", label: "Blazing Fast", variant: "amber" }]),
    alternativeIds: j(["notion"]),
    isFeatured: true, isTrending: true, isEditorsPick: true, launchYear: 2019,
    score: { overall: 9.2, privacy: 8.0, valueForMoney: 9.0, uxDesign: 9.8, pricingTransparency: 9.5, noAds: 10, onboarding: 8.8, support: 8.5, verdict: "exceptional", verdictText: "Linear is a masterclass in software product design. Fast, beautiful, and thoughtfully priced — the rare tool that feels like a privilege to use." },
    pricing: { model: "freemium", hasFreeVersion: true, monthlyPrice: "$8", annualPrice: "$72/yr per member", oneTimePrice: null, trialDays: null, annualDiscount: "25%", hiddenCosts: j([]), paywallAggression: 1, summary: "Generously free for small teams (up to 3 active cycles). Paid plans at $8/mo per member are very fair given the quality. No hidden upsells, no surprise limits." },
    review: { count: 2934, pros: j(["Fastest issue tracker ever built — feels instant", "Design quality is best-in-class, no debate", "Keyboard shortcuts make power users significantly faster", "Roadmaps and cycles are brilliantly implemented", "Free tier is genuinely useful for small teams"]), cons: j(["Less flexible than Jira for complex enterprise workflows", "No native time tracking", "Mobile app is less powerful than desktop", "Limited third-party integrations compared to Jira"]), expertVerdict: "Linear is the tool that made engineers stop hating their PM software. If you're building software and not using Linear, you're leaving productivity on the table.", featuredQuoteText: "Linear made me realize how much cognitive overhead Jira was adding to my team. Switching felt like upgrading hardware.", featuredQuoteAuthor: "Priya R.", featuredQuoteRole: "Engineering Director" },
  },
  // ── Figma ──────────────────────────────────
  {
    id: "figma", slug: "figma", name: "Figma",
    tagline: "Design, prototype, and collaborate in the browser",
    description: "Figma is where modern product design happens. Browser-based, real-time collaborative, and deeply integrated with developer workflows — it has effectively become the universal design tool for product teams worldwide.",
    logoEmoji: "🎨", logoGradient: "from-orange-500 to-rose-600",
    developer: "Figma, Inc.", website: "https://figma.com",
    platforms: j(["web", "macos", "windows"]),
    categoryId: "design", subcategoryId: "ui-ux",
    tags: j([{ id: "collaborative", label: "Real-Time Collab", variant: "blue" }, { id: "industry-standard", label: "Industry Standard", variant: "amber" }, { id: "freemium", label: "Freemium", variant: "emerald" }, { id: "browser-based", label: "Browser-Based", variant: "slate" }]),
    alternativeIds: j(["notion", "linear"]),
    isFeatured: true, isTrending: false, isEditorsPick: false, launchYear: 2016,
    score: { overall: 8.6, privacy: 7.0, valueForMoney: 7.8, uxDesign: 9.2, pricingTransparency: 8.0, noAds: 10, onboarding: 7.5, support: 8.0, verdict: "great", verdictText: "Figma is the undisputed leader in product design. Exceptional collaboration, strong pricing for small teams, though enterprise plans get expensive quickly." },
    pricing: { model: "freemium", hasFreeVersion: true, monthlyPrice: "$15", annualPrice: "$144/yr per editor", oneTimePrice: null, trialDays: 30, annualDiscount: "20%", hiddenCosts: j(["Developers need viewer-only seats at $5/mo each", "FigJam is a separate paid product", "Organization plan ($45/mo) needed for SSO and premium features"]), paywallAggression: 2, summary: "Free tier allows 3 projects and unlimited collaborators (viewer-only). Editor seats at $15/mo. Costs scale with team size." },
    review: { count: 8102, pros: j(["Real-time collaboration is best-in-class", "Prototyping is smooth and impressive in demos", "Massive plugin ecosystem extends capabilities significantly", "Design tokens and component libraries are industry-leading", "Viewer accounts for developers are free"]), cons: j(["FigJam whiteboard is a separate, additional cost", "Large files can get noticeably slow", "Offline mode is limited", "Organization plan is expensive ($45/editor/mo)", "Adobe acquisition raised concerns about future pricing"]), expertVerdict: "Figma is simply what product design looks like now. The free tier makes it accessible, and most teams will find the professional plan worth it.", featuredQuoteText: "Our handoff process went from 40-step Zeplin workflows to one link. Figma changed design collaboration forever.", featuredQuoteAuthor: "Celine M.", featuredQuoteRole: "Head of Design at a fintech startup" },
  },
  // ── Superhuman ─────────────────────────────
  {
    id: "superhuman", slug: "superhuman", name: "Superhuman",
    tagline: "The fastest email experience ever made",
    description: "Superhuman rebuilt email from scratch around keyboard shortcuts, AI assistance, and a philosophy that your email client is costing you hours. Premium price, premium experience — no free tier, no apology.",
    logoEmoji: "⚡", logoGradient: "from-amber-500 to-orange-600",
    developer: "Superhuman, Inc.", website: "https://superhuman.com",
    platforms: j(["web", "macos", "ios"]),
    categoryId: "communication", subcategoryId: "email",
    tags: j([{ id: "premium-design", label: "Premium Design", variant: "violet" }, { id: "ai-powered", label: "AI-Powered", variant: "violet" }, { id: "keyboard-first", label: "Keyboard-First", variant: "blue" }, { id: "no-free-tier", label: "Paid Only", variant: "rose" }]),
    alternativeIds: j(["notion"]),
    isFeatured: false, isTrending: true, isEditorsPick: true, launchYear: 2017,
    score: { overall: 8.4, privacy: 7.0, valueForMoney: 6.5, uxDesign: 9.5, pricingTransparency: 8.5, noAds: 10, onboarding: 9.0, support: 9.5, verdict: "great", verdictText: "Superhuman is the finest email experience ever built. But at $30/mo with no free tier, you'll need to be honest with yourself about whether email is your actual bottleneck." },
    pricing: { model: "subscription", hasFreeVersion: false, monthlyPrice: "$30", annualPrice: "$300/yr", oneTimePrice: null, trialDays: 14, annualDiscount: "17%", hiddenCosts: j([]), paywallAggression: 1, summary: "$30/mo flat. No tiers, no hidden costs, no upsells. The entire product is included. Expensive, but extremely honest pricing for what you get. 14-day free trial available." },
    review: { count: 1842, pros: j(["Genuinely the fastest email experience — keyboard shortcuts are transformative", "AI features are deeply integrated, not bolted on", "Onboarding concierge is exceptional — real humans help you", "Snippets and templates save real, measurable time"]), cons: j(["$30/mo is hard to justify for casual email users", "No free tier at all — binary commitment required", "Requires Gmail or Outlook — no support for other providers"]), expertVerdict: "If email is your primary work tool and you spend 3+ hours per day in it, Superhuman has a strong ROI argument. For everyone else — spectacular, but hard to justify.", featuredQuoteText: "I was skeptical at $30/mo. Three weeks in, I couldn't imagine going back. It's the only app I've ever recommended where I knew someone would thank me.", featuredQuoteAuthor: "James L.", featuredQuoteRole: "Founder & CEO" },
  },
  // ── Raycast ────────────────────────────────
  {
    id: "raycast", slug: "raycast", name: "Raycast",
    tagline: "Your Mac productivity hub with extensions and AI",
    description: "Raycast replaces Spotlight with a blazing-fast launcher that does everything: control your apps, run scripts, search files, manage clipboard history, and trigger AI prompts — all without leaving the keyboard.",
    logoEmoji: "🚀", logoGradient: "from-rose-500 to-orange-500",
    developer: "Raycast Technologies", website: "https://raycast.com",
    platforms: j(["macos"]),
    categoryId: "productivity", subcategoryId: "launchers",
    tags: j([{ id: "free-tier-great", label: "Great Free Tier", variant: "emerald" }, { id: "ai-powered", label: "AI-Powered", variant: "violet" }, { id: "no-ads", label: "No Ads", variant: "emerald" }, { id: "mac-only", label: "Mac Only", variant: "slate" }, { id: "open-extensions", label: "Open Extensions", variant: "blue" }]),
    alternativeIds: j(["obsidian"]),
    isFeatured: true, isTrending: true, isEditorsPick: true, launchYear: 2020,
    score: { overall: 9.4, privacy: 8.5, valueForMoney: 9.8, uxDesign: 9.6, pricingTransparency: 9.5, noAds: 10, onboarding: 9.2, support: 8.8, verdict: "exceptional", verdictText: "Raycast is one of the best free apps ever made for Mac. If you upgrade to Pro for the AI, it remains exceptional value. Close to perfect." },
    pricing: { model: "freemium", hasFreeVersion: true, monthlyPrice: "$8", annualPrice: "$72/yr", oneTimePrice: null, trialDays: null, annualDiscount: null, hiddenCosts: j([]), paywallAggression: 1, summary: "The core Raycast launcher is entirely free and more powerful than most paid alternatives. Pro adds AI features at $8/mo — clearly delineated, no pressure to upgrade." },
    review: { count: 3217, pros: j(["Free tier is more capable than most paid alternatives", "Extension ecosystem is extraordinary — thousands of integrations", "AI features in Pro tier are natural and genuinely useful", "Clipboard history alone is worth the install", "Blazing fast — opens instantly, searches immediately"]), cons: j(["macOS only — no Windows or Linux support", "AI Pro adds ongoing subscription cost", "Some powerful features have a learning curve", "Large extension library can be overwhelming to discover"]), expertVerdict: "Raycast is the rare app that makes your entire computer feel faster. The free version exceeds what most paid launchers offer. One of the highest value installs on macOS.", featuredQuoteText: "I uninstalled Alfred after 7 years, the same day I installed Raycast. The extension ecosystem is what pushed me over.", featuredQuoteAuthor: "Tomás K.", featuredQuoteRole: "Senior Software Engineer" },
  },
  // ── Bear ───────────────────────────────────
  {
    id: "bear", slug: "bear", name: "Bear",
    tagline: "Beautiful markdown notes for iPhone, iPad, and Mac",
    description: "Bear is a focused markdown writing environment with powerful tagging, excellent export options, and exceptional typographic design. It's what happens when designers make a notes app — and it shows.",
    logoEmoji: "🐻", logoGradient: "from-amber-600 to-red-700",
    developer: "Shiny Frog Ltd.", website: "https://bear.app",
    platforms: j(["macos", "ios"]),
    categoryId: "productivity", subcategoryId: "note-taking",
    tags: j([{ id: "premium-design", label: "Premium Design", variant: "violet" }, { id: "privacy-focused", label: "Privacy-Focused", variant: "emerald" }, { id: "apple-only", label: "Apple Ecosystem", variant: "slate" }, { id: "markdown", label: "Markdown-First", variant: "blue" }]),
    alternativeIds: j(["craft", "notion"]),
    isFeatured: false, isTrending: false, isEditorsPick: true, launchYear: 2016,
    score: { overall: 8.1, privacy: 9.0, valueForMoney: 8.5, uxDesign: 9.4, pricingTransparency: 9.8, noAds: 10, onboarding: 9.0, support: 8.0, verdict: "great", verdictText: "Bear is perhaps the most beautifully designed notes app on any platform. Apple-only is a real limitation, but for those in the ecosystem it's exceptional." },
    pricing: { model: "freemium", hasFreeVersion: true, monthlyPrice: "$2.99", annualPrice: "$29.99/yr", oneTimePrice: null, trialDays: null, annualDiscount: "16%", hiddenCosts: j([]), paywallAggression: 1, summary: "One of the most fairly priced subscriptions in the App Store. The free version lets you fully evaluate Bear without limits on notes. Pro at $2.99/mo or $29.99/yr for sync, themes, and export." },
    review: { count: 6201, pros: j(["Best-in-class typography and reading experience", "Nested tagging system is genuinely innovative", "iCloud sync is fast and reliable", "Export to PDF, HTML, DOCX, and Markdown", "Very fair pricing with clear free vs. Pro distinction"]), cons: j(["Apple-only: no Windows or Android version", "No real-time collaboration", "Tables are limited compared to Notion or Craft", "Web clipper is less capable than Evernote"]), expertVerdict: "Bear's blend of design beauty, writing focus, and fair pricing makes it one of the best notes apps in the App Store. The Apple-only limitation is real, but for those in the ecosystem it's hard to beat.", featuredQuoteText: "Bear makes writing feel like it matters. Other apps store notes — Bear respects them.", featuredQuoteAuthor: "Sophia D.", featuredQuoteRole: "Technical Writer" },
  },
  // ── Craft ──────────────────────────────────
  {
    id: "craft", slug: "craft", name: "Craft",
    tagline: "Premium document editor built for Apple platforms",
    description: "Craft is a document editor that makes creating structured, beautiful documents feel natural. Blocks-based like Notion, but with Apple-native performance, offline-first syncing, and a design that feels intentionally luxurious.",
    logoEmoji: "📐", logoGradient: "from-blue-500 to-indigo-600",
    developer: "Craft Docs Limited", website: "https://craft.do",
    platforms: j(["macos", "ios", "web", "windows"]),
    categoryId: "productivity", subcategoryId: "note-taking",
    tags: j([{ id: "premium-design", label: "Premium Design", variant: "violet" }, { id: "offline-first", label: "Offline-First", variant: "emerald" }, { id: "apple-optimized", label: "Apple-Optimized", variant: "slate" }, { id: "freemium", label: "Freemium", variant: "emerald" }]),
    alternativeIds: j(["bear", "notion"]),
    isFeatured: false, isTrending: false, isEditorsPick: true, launchYear: 2020,
    score: { overall: 8.9, privacy: 9.2, valueForMoney: 8.8, uxDesign: 9.7, pricingTransparency: 9.5, noAds: 10, onboarding: 8.5, support: 8.5, verdict: "great", verdictText: "Craft sets the bar for document editing on Apple platforms. The design is spectacular, offline sync is excellent, and pricing is honest." },
    pricing: { model: "freemium", hasFreeVersion: true, monthlyPrice: "$4.99", annualPrice: "$44.99/yr", oneTimePrice: null, trialDays: null, annualDiscount: "25%", hiddenCosts: j([]), paywallAggression: 1, summary: "Free tier offers up to 1,000 blocks and 7 documents — enough to genuinely evaluate the app. Pro at $4.99/mo is clear, fair, and includes all features. No enterprise upsell pressure." },
    review: { count: 2891, pros: j(["The most beautiful document editor on Mac and iPad", "Native app performance — feels like the platform, not web", "Offline-first with reliable iCloud sync", "Deep linking within documents is powerful", "Shareability — publish documents as polished web pages"]), cons: j(["Free tier block limit (1,000) hits faster than expected", "Real-time collaboration less capable than Notion or Figma", "Windows/Web versions feel less premium than Mac/iOS", "No database/table views like Notion"]), expertVerdict: "If you're in the Apple ecosystem and want a premium document experience with honest pricing, Craft is the best answer. Notion for power/teams, Craft for quality and feel.", featuredQuoteText: "I started using Craft for meeting notes and ended up rewriting my entire company wiki. It makes Notion look like a spreadsheet.", featuredQuoteAuthor: "Oliver H.", featuredQuoteRole: "Founder" },
  },
  // ── 1Password ──────────────────────────────
  {
    id: "onepassword", slug: "1password", name: "1Password",
    tagline: "The password manager trusted by millions and their families",
    description: "1Password secures your passwords, credit cards, secure notes, and passkeys in end-to-end encrypted vaults. Travel mode, Watchtower breach monitoring, and family sharing make it the most complete security product in its category.",
    logoEmoji: "🔐", logoGradient: "from-blue-600 to-cyan-500",
    developer: "AgileBits Inc.", website: "https://1password.com",
    platforms: j(["all"]),
    categoryId: "security", subcategoryId: "passwords",
    tags: j([{ id: "privacy-focused", label: "Privacy-Focused", variant: "emerald" }, { id: "family-plan", label: "Great Family Plan", variant: "blue" }, { id: "end-to-end", label: "End-to-End Encrypted", variant: "emerald" }, { id: "no-free-tier", label: "Paid Only", variant: "rose" }]),
    alternativeIds: j(["raycast"]),
    isFeatured: false, isTrending: false, isEditorsPick: true, launchYear: 2006,
    score: { overall: 8.8, privacy: 9.8, valueForMoney: 8.6, uxDesign: 8.5, pricingTransparency: 9.0, noAds: 10, onboarding: 8.0, support: 8.5, verdict: "great", verdictText: "1Password is arguably the best password manager available. Security is exceptional, family plans are excellent value, and the design has improved dramatically." },
    pricing: { model: "subscription", hasFreeVersion: false, monthlyPrice: "$2.99", annualPrice: "$35.88/yr", oneTimePrice: null, trialDays: 14, annualDiscount: null, hiddenCosts: j([]), paywallAggression: 1, summary: "$2.99/mo for individuals, $4.99/mo for families of up to 5. No hidden costs. Business plans are clearly documented. One of the most straightforward subscriptions in security software." },
    review: { count: 9421, pros: j(["Best-in-class security model with Secret Key + Master Password", "Travel Mode hides sensitive vaults at border crossings", "Watchtower monitors for breached credentials", "Family plan is exceptional value for households", "Cross-platform support is genuinely comprehensive"]), cons: j(["No free tier — requires paid commitment from day one", "Interface can feel complex for non-technical users", "Migration from other managers is not seamless"]), expertVerdict: "1Password is what you recommend to people you care about. The secret key model, family sharing, and cross-platform experience are genuinely best-in-class. The lack of a free tier is its only meaningful downside.", featuredQuoteText: "Set up 1Password for my parents. Dad called me to say he feels 'actually safe online' for the first time. That's the product doing its job.", featuredQuoteAuthor: "Anya K.", featuredQuoteRole: "Security Engineer" },
  },
  // ── Proxyman ───────────────────────────────
  {
    id: "proxyman", slug: "proxyman", name: "Proxyman",
    tagline: "Modern native HTTP proxy for debugging on Mac and iOS",
    description: "Proxyman is a beautiful, native macOS HTTP proxy that lets developers intercept, inspect, and modify network traffic. It's what Charles Proxy would look like if it were built today — and it shows.",
    logoEmoji: "🔬", logoGradient: "from-indigo-500 to-purple-600",
    developer: "Proxyman LLC", website: "https://proxyman.io",
    platforms: j(["macos", "ios", "windows"]),
    categoryId: "developer-tools", subcategoryId: "network",
    tags: j([{ id: "no-subscription", label: "No Subscription", variant: "emerald" }, { id: "native-app", label: "Native Mac App", variant: "blue" }, { id: "privacy-focused", label: "No Cloud", variant: "emerald" }, { id: "premium-design", label: "Premium Design", variant: "violet" }]),
    alternativeIds: j(["tableplus", "linear"]),
    isFeatured: false, isTrending: false, isEditorsPick: false, launchYear: 2019,
    score: { overall: 9.0, privacy: 9.5, valueForMoney: 9.4, uxDesign: 9.2, pricingTransparency: 9.8, noAds: 10, onboarding: 8.5, support: 8.8, verdict: "exceptional", verdictText: "Proxyman is the definitive HTTP debugging tool for macOS. One-time purchase, no cloud dependency, beautiful native design — it's exactly what great developer tools should look like." },
    pricing: { model: "paid-once", hasFreeVersion: true, monthlyPrice: null, annualPrice: null, oneTimePrice: "$89", trialDays: null, annualDiscount: null, hiddenCosts: j([]), paywallAggression: 1, summary: "Free version fully functional with some request limits. One-time license at $89 for unlimited use. No subscription, no recurring costs, no cloud uploads of your data." },
    review: { count: 1204, pros: j(["One-time purchase — no subscription creep", "Completely native Mac and iOS app — fast and beautiful", "SSL certificate handling is effortless compared to Charles", "No data leaves your machine — everything is local", "Breakpoints for modifying requests in flight"]), cons: j(["One-time price is steep upfront for freelancers", "Windows version is newer and less mature", "Learning curve for SSL pinning bypass"]), expertVerdict: "Proxyman is what all developer tools should aspire to: native, fast, private, and honestly priced with a one-time purchase. A must-have for any iOS or web developer.", featuredQuoteText: "I paid $89 for Proxyman and use it daily. Versus $20/mo for another tool I barely opened. Single best purchase I made this year.", featuredQuoteAuthor: "Wei C.", featuredQuoteRole: "iOS Developer" },
  },
  // ── TablePlus ──────────────────────────────
  {
    id: "tableplus", slug: "tableplus", name: "TablePlus",
    tagline: "Modern, native database management GUI",
    description: "TablePlus supports PostgreSQL, MySQL, SQLite, Redis, and 15+ more databases in a single, gorgeous native Mac and Windows app. It's the database GUI that modern developers actually want to open.",
    logoEmoji: "🗃", logoGradient: "from-teal-500 to-cyan-600",
    developer: "TablePlus Inc.", website: "https://tableplus.com",
    platforms: j(["macos", "windows", "ios"]),
    categoryId: "developer-tools", subcategoryId: "database",
    tags: j([{ id: "no-subscription", label: "No Subscription", variant: "emerald" }, { id: "premium-design", label: "Premium Design", variant: "violet" }, { id: "privacy-focused", label: "Local Only", variant: "emerald" }, { id: "multi-db", label: "Multi-Database", variant: "blue" }]),
    alternativeIds: j(["proxyman"]),
    isFeatured: false, isTrending: false, isEditorsPick: false, launchYear: 2017,
    score: { overall: 8.7, privacy: 9.5, valueForMoney: 9.2, uxDesign: 9.0, pricingTransparency: 9.6, noAds: 10, onboarding: 8.8, support: 8.2, verdict: "great", verdictText: "TablePlus is the database GUI that finally respected developers' time and money. One-time price, native design, comprehensive database support." },
    pricing: { model: "freemium", hasFreeVersion: true, monthlyPrice: null, annualPrice: null, oneTimePrice: "$89", trialDays: null, annualDiscount: null, hiddenCosts: j([]), paywallAggression: 1, summary: "Free tier includes 2 tabs, 2 open windows, and limited connections — enough to evaluate thoroughly. License is one-time at $89, includes 12 months of updates." },
    review: { count: 2108, pros: j(["Supports 20+ databases in one native app", "One-time purchase — stop paying monthly for DB GUI tools", "Design quality far exceeds TableAdmin and older tools", "Safe mode prevents accidental destructive queries", "SSH tunneling and advanced connection options"]), cons: j(["Advanced query features lag behind DataGrip", "Windows version is less mature than Mac", "Team collaboration features are limited"]), expertVerdict: "For developers who want a beautiful, fast, multi-database tool without a subscription — TablePlus is the clear answer. DataGrip wins on power features; TablePlus wins everywhere else.", featuredQuoteText: "Finally, a database GUI I don't dread opening. Cancelled my DataGrip subscription the same week.", featuredQuoteAuthor: "Andrés V.", featuredQuoteRole: "Full-Stack Developer" },
  },
  // ── Structured ─────────────────────────────
  {
    id: "structured", slug: "structured", name: "Structured",
    tagline: "Visual daily planner for planning your day like a timeline",
    description: "Structured is a beautiful visual timeline planner for iPhone, iPad, and Mac. Instead of a flat to-do list, it lays your day out chronologically so you can see exactly what's happening and when.",
    logoEmoji: "📅", logoGradient: "from-violet-500 to-purple-700",
    developer: "Structured App GmbH", website: "https://structured.app",
    platforms: j(["ios", "macos"]),
    categoryId: "productivity", subcategoryId: "task-management",
    tags: j([{ id: "premium-design", label: "Premium Design", variant: "violet" }, { id: "beginner-friendly", label: "Beginner-Friendly", variant: "emerald" }, { id: "visual-planning", label: "Visual Timeline", variant: "blue" }, { id: "apple-only", label: "Apple Ecosystem", variant: "slate" }]),
    alternativeIds: j(["notion", "bear"]),
    isFeatured: false, isTrending: true, isEditorsPick: false, launchYear: 2020,
    score: { overall: 8.5, privacy: 9.0, valueForMoney: 8.4, uxDesign: 9.5, pricingTransparency: 9.2, noAds: 10, onboarding: 9.5, support: 8.0, verdict: "great", verdictText: "Structured makes planning your day genuinely enjoyable. The visual timeline approach is innovative, the design is gorgeous, and the pricing is very fair." },
    pricing: { model: "freemium", hasFreeVersion: true, monthlyPrice: "$3.99", annualPrice: "$29.99/yr", oneTimePrice: null, trialDays: 7, annualDiscount: "37%", hiddenCosts: j([]), paywallAggression: 1, summary: "Free tier allows 5 tasks per day — limited but genuinely enough to evaluate. Pro at $29.99/yr is excellent value given the design quality. Annual billing is smartly discounted." },
    review: { count: 4102, pros: j(["Visual timeline is a genuinely better way to plan a day", "The most beautiful day planner on iOS", "Calendar integration makes it actually useful in real life", "Beginner-friendly — zero learning curve", "Annual pricing is very competitive"]), cons: j(["Free tier limit (5 tasks/day) is reached quickly", "Apple-only — no Android or Windows", "Not powerful enough to replace Notion or full task managers", "Recurring tasks are limited"]), expertVerdict: "Structured is the daily planning app for people who've given up on daily planning apps. The visual timeline removes the friction of listing and prioritizing simultaneously.", featuredQuoteText: "My ADHD brain finally has a planner it can work with. The timeline makes time feel real instead of abstract.", featuredQuoteAuthor: "Dana F.", featuredQuoteRole: "UX Researcher" },
  },
  // ── Obsidian ───────────────────────────────
  {
    id: "obsidian", slug: "obsidian", name: "Obsidian",
    tagline: "A second brain for your notes, stored entirely on your device",
    description: "Obsidian is a local-first markdown note-taking app famous for its bidirectional linking graph view. Your notes are plain markdown files stored on your device — no cloud dependency, no vendor lock-in, no subscription required.",
    logoEmoji: "💎", logoGradient: "from-purple-600 to-purple-900",
    developer: "Dynalist Inc.", website: "https://obsidian.md",
    platforms: j(["all"]),
    categoryId: "productivity", subcategoryId: "note-taking",
    tags: j([{ id: "free-for-personal", label: "Free for Personal", variant: "emerald" }, { id: "privacy-focused", label: "Privacy-Focused", variant: "emerald" }, { id: "local-first", label: "Local-First", variant: "blue" }, { id: "highly-customizable", label: "Highly Customizable", variant: "violet" }, { id: "no-subscription", label: "No Sub Required", variant: "emerald" }]),
    alternativeIds: j(["bear", "craft", "notion"]),
    isFeatured: true, isTrending: false, isEditorsPick: false, launchYear: 2020,
    score: { overall: 9.1, privacy: 9.9, valueForMoney: 9.7, uxDesign: 7.8, pricingTransparency: 9.8, noAds: 10, onboarding: 6.5, support: 7.8, verdict: "exceptional", verdictText: "Obsidian scores near-perfect on privacy and value. The UX has improved dramatically but still requires more setup than Bear or Craft. The strongest choice for privacy-first note-takers." },
    pricing: { model: "freemium", hasFreeVersion: true, monthlyPrice: null, annualPrice: null, oneTimePrice: null, trialDays: null, annualDiscount: null, hiddenCosts: j(["Sync addon: $4/mo for encrypted cloud sync", "Publish addon: $8/mo for publishing notes as websites", "Commercial license: $50 one-time for business use"]), paywallAggression: 1, summary: "Completely free for personal use — forever, no strings. Optional paid addons for sync and publishing are clearly priced. Commercial license required for business use at a one-time $50." },
    review: { count: 5610, pros: j(["Completely free for personal use — genuinely, forever", "Your notes are plain .md files — total portability", "Best-in-class privacy — nothing stored in the cloud by default", "Plugin ecosystem is extraordinary — 1,000+ community plugins", "Graph view is genuinely useful for connecting ideas"]), cons: j(["Default UI is underwhelming — requires setup to look great", "Steep learning curve compared to Bear or Craft", "Sync requires either Obsidian Sync ($4/mo) or iCloud workarounds", "Mobile experience is less polished than desktop"]), expertVerdict: "Obsidian is the choice that respects your autonomy most. Free, local, portable, and infinitely extensible. The learning investment pays off for power users.", featuredQuoteText: "I've used every note app. Obsidian is the only one I'm not afraid of losing because my notes are just files on my drive.", featuredQuoteAuthor: "Lena B.", featuredQuoteRole: "Academic Researcher" },
  },
  // ── CleanMyMac X ───────────────────────────
  {
    id: "cleanmymac", slug: "cleanmymac-x", name: "CleanMyMac X",
    tagline: "The smart Mac cleaner and performance optimizer",
    description: "CleanMyMac X scans your Mac to remove junk files, uninstall apps cleanly, optimize performance, and protect against malware. The most popular Mac maintenance app, now with a subscription model that has divided its longtime users.",
    logoEmoji: "🧹", logoGradient: "from-sky-500 to-blue-600",
    developer: "MacPaw Inc.", website: "https://macpaw.com/cleanmymac",
    platforms: j(["macos"]),
    categoryId: "utilities", subcategoryId: "system",
    tags: j([{ id: "mac-only", label: "Mac Only", variant: "slate" }, { id: "beginner-friendly", label: "Beginner-Friendly", variant: "emerald" }, { id: "subscription-required", label: "Subscription Required", variant: "rose" }, { id: "real-time-protection", label: "Malware Protection", variant: "blue" }]),
    alternativeIds: j(["raycast"]),
    isFeatured: false, isTrending: false, isEditorsPick: false, launchYear: 2016,
    score: { overall: 7.2, privacy: 7.0, valueForMoney: 6.5, uxDesign: 8.8, pricingTransparency: 7.0, noAds: 10, onboarding: 9.2, support: 7.5, verdict: "decent", verdictText: "CleanMyMac X looks great and works well, but the forced subscription model for what was once a one-time tool remains a sticking point for long-time users." },
    pricing: { model: "subscription", hasFreeVersion: true, monthlyPrice: "$14.95", annualPrice: "$39.95/yr", oneTimePrice: null, trialDays: 30, annualDiscount: "78%", hiddenCosts: j(["Price shown is for single device — multi-device plans cost more", "SetApp bundle may be better value for existing SetApp subscribers"]), paywallAggression: 3, summary: "Free version limited to scanning only — no cleaning without payment. Annual plan at $39.95/yr is far better value than monthly. The switch from one-time purchase to subscription was controversial." },
    review: { count: 18420, pros: j(["Best-looking Mac maintenance app by a wide margin", "Incredibly simple to use — one click cleaning", "App Uninstaller actually removes all related files", "Malware detection has improved significantly"]), cons: j(["Switch to subscription model alienated loyal one-time purchasers", "The cleaning benefits are debated — macOS manages itself fairly well", "Free version is essentially a demo — very limited"]), expertVerdict: "CleanMyMac X remains the most user-friendly Mac maintenance tool, but experienced users often question whether it adds meaningful value over macOS's built-in tools.", featuredQuoteText: "I bought it once, used it for 5 years, then they moved to subscriptions. I'm still deciding if I'm annoyed enough to switch.", featuredQuoteAuthor: "Richard M.", featuredQuoteRole: "Graphic Designer" },
  },
  // ── Tot ────────────────────────────────────
  {
    id: "tot", slug: "tot", name: "Tot",
    tagline: "Collect and edit your text snippets — seven dots, that's it",
    description: "Tot is the simplest text scratchpad imaginable. Seven colored dots in your menu bar. Click one, type. That's the whole app — and it's perfect. Made by the people who made Twitterrific.",
    logoEmoji: "·", logoGradient: "from-rose-500 to-pink-600",
    developer: "Iconfactory", website: "https://tot.rocks",
    platforms: j(["macos", "ios"]),
    categoryId: "utilities", subcategoryId: "quick-capture",
    tags: j([{ id: "no-subscription", label: "No Subscription", variant: "emerald" }, { id: "minimal", label: "Deliberately Minimal", variant: "slate" }, { id: "one-time", label: "One-Time Purchase", variant: "emerald" }, { id: "privacy-focused", label: "Local Only", variant: "emerald" }]),
    alternativeIds: j(["raycast", "bear"]),
    isFeatured: false, isTrending: false, isEditorsPick: false, launchYear: 2019,
    score: { overall: 8.3, privacy: 10, valueForMoney: 9.5, uxDesign: 9.0, pricingTransparency: 10, noAds: 10, onboarding: 10, support: 8.0, verdict: "great", verdictText: "Tot does exactly one thing and does it perfectly. One-time price, no subscription, no cloud, no nonsense. The antidote to overcomplicated productivity apps." },
    pricing: { model: "paid-once", hasFreeVersion: false, monthlyPrice: null, annualPrice: null, oneTimePrice: "$20", trialDays: null, annualDiscount: null, hiddenCosts: j([]), paywallAggression: 1, summary: "$20 once. No subscription, no cloud account, no tracking. As honest and simple as the app itself." },
    review: { count: 1841, pros: j(["Does exactly what it says, nothing more", "One-time purchase with no subscription ever", "Your text stays entirely on your device", "A menu bar tool that actually earns its space", "Markdown support is a welcome bonus"]), cons: j(["Only 7 dots — by design, but limits use cases", "No sync between devices without iCloud manual setup", "Very basic compared to full note-taking apps"]), expertVerdict: "Tot is the app that proves the best tools have constraints. Seven scratchpads, always accessible, always local. Sometimes less really is more.", featuredQuoteText: "I've tried every clipboard manager and scratchpad app. Tot is the only one that never got in my way.", featuredQuoteAuthor: "Paul N.", featuredQuoteRole: "Indie Developer" },
  },
];

// ─────────────────────────────────────────────
// Seed runner
// ─────────────────────────────────────────────

async function seed() {
  console.log("🌱  Starting seed...");

  // Truncate in reverse FK order
  await db.execute(sql`TRUNCATE app_review_summaries, app_pricing, app_scores, apps, categories CASCADE`);
  console.log("🗑   Tables truncated.");

  // Insert categories
  for (const cat of CATEGORY_ROWS) {
    await db.insert(schema.categories).values({
      id: cat.id,
      slug: cat.slug,
      label: cat.label,
      icon: cat.icon,
      gradient: cat.gradient,
      accent: cat.accent,
      description: cat.description,
      appCount: cat.appCount,
      subcategories: cat.subcategories,
      intentTags: cat.intentTags,
    });
  }
  console.log(`✅  Seeded ${CATEGORY_ROWS.length} categories.`);

  // Insert apps + related rows
  for (const app of APP_ROWS) {
    await db.insert(schema.apps).values({
      id: app.id,
      slug: app.slug,
      name: app.name,
      tagline: app.tagline,
      description: app.description,
      logoEmoji: app.logoEmoji,
      logoGradient: app.logoGradient,
      developer: app.developer,
      website: app.website,
      platforms: app.platforms,
      categoryId: app.categoryId,
      subcategoryId: app.subcategoryId,
      tags: app.tags,
      alternativeIds: app.alternativeIds,
      isFeatured: app.isFeatured,
      isTrending: app.isTrending,
      isEditorsPick: app.isEditorsPick,
      launchYear: app.launchYear,
    });

    await db.insert(schema.appScores).values({
      appId: app.id,
      overall: app.score.overall,
      privacy: app.score.privacy,
      valueForMoney: app.score.valueForMoney,
      uxDesign: app.score.uxDesign,
      pricingTransparency: app.score.pricingTransparency,
      noAds: app.score.noAds,
      onboarding: app.score.onboarding,
      support: app.score.support,
      verdict: app.score.verdict,
      verdictText: app.score.verdictText,
    });

    await db.insert(schema.appPricing).values({
      appId: app.id,
      model: app.pricing.model,
      hasFreeVersion: app.pricing.hasFreeVersion,
      monthlyPrice: app.pricing.monthlyPrice,
      annualPrice: app.pricing.annualPrice,
      oneTimePrice: app.pricing.oneTimePrice,
      trialDays: app.pricing.trialDays,
      annualDiscount: app.pricing.annualDiscount,
      hiddenCosts: app.pricing.hiddenCosts,
      paywallAggression: app.pricing.paywallAggression,
      summary: app.pricing.summary,
    });

    await db.insert(schema.appReviewSummaries).values({
      appId: app.id,
      count: app.review.count,
      pros: app.review.pros,
      cons: app.review.cons,
      expertVerdict: app.review.expertVerdict,
      featuredQuoteText: app.review.featuredQuoteText,
      featuredQuoteAuthor: app.review.featuredQuoteAuthor,
      featuredQuoteRole: app.review.featuredQuoteRole,
    });
  }

  console.log(`✅  Seeded ${APP_ROWS.length} apps.`);
  console.log("🎉  Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
