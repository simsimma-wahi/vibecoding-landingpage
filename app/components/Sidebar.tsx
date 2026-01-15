"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarWrapper";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

const navItems: NavItem[] = [
  {
    name: "Overview",
    href: "/",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "API Keys",
    href: "/dashboards",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    name: "API Playground",
    href: "/playground",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    name: "Documentation",
    href: "https://docs.example.com",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    external: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle button - shown when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-20 p-2 bg-white border border-zinc-200 rounded-lg shadow-sm hover:bg-zinc-50 transition-colors"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <div
        className={`fixed left-0 top-0 h-screen bg-white border-r border-zinc-200 flex flex-col z-10 transition-transform duration-300 ${
          isOpen ? "w-64 translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Blue accent line */}
        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
        
        {/* App name and close button */}
        <div className="pt-8 px-6 pb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">emethAI</h1>
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      {/* Navigation items */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const content = (
              <li key={item.name}>
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <span className={isActive ? "text-zinc-900" : "text-zinc-600"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {item.external && (
                    <svg className="w-4 h-4 ml-auto text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </Link>
              </li>
            );
            return content;
          })}
        </ul>
      </nav>
    </div>
    </>
  );
}
