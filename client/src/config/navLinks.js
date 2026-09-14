import {
  LayoutDashboard,
  FileText,
  ScanSearch,
  Send,
  History,
  Settings,
  PenLine,
  Sparkles,
  MessageCircle,
} from "lucide-react";

// Single source of truth for the dashboard navigation — previously
// duplicated identically in Sidebar.jsx and MobileSidebar.jsx.
export const navLinks = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "EmlyAI Chat", path: "/chat", icon: MessageCircle },
  { name: "My Resumes", path: "/resumes", icon: FileText },
  { name: "Analyze JD", path: "/analyze", icon: ScanSearch },
  { name: "Cover Letter", path: "/cover-letter", icon: PenLine },
  { name: "One Click Apply", path: "/one-click-apply", icon: Send },
  { name: "Email History", path: "/email-history", icon: History },
  // Not live yet — see LatestJobs.jsx and TASKS.md's job-feed backlog item.
  { name: "Latest Jobs", path: "/latest-jobs", icon: Sparkles, soon: true },
  { name: "Settings", path: "/settings", icon: Settings },
];
