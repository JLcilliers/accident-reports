"use client";

import { useState, useEffect } from "react";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop sidebar TOC */}
      <nav className="hidden xl:block sticky top-28 self-start">
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-medium text-neutral-900 mb-4 uppercase tracking-wide">
            Table of Contents
          </h2>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left w-full text-sm py-1.5 transition-colors ${
                    item.level === 3 ? "pl-4" : ""
                  } ${
                    activeId === item.id
                      ? "text-[#2A7D6E] font-medium"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile floating TOC button */}
      <div className="xl:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-[#2A7D6E] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#236859] transition-colors"
          aria-label="Table of contents"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
          </svg>
        </button>
      </div>

      {/* Mobile TOC overlay */}
      {isOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-neutral-900">
                  Jump to Section
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left w-full py-3 px-4 rounded-xl text-sm transition-colors ${
                        item.level === 3 ? "pl-8" : ""
                      } ${
                        activeId === item.id
                          ? "bg-[#E8F5F2] text-[#2A7D6E] font-medium"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
