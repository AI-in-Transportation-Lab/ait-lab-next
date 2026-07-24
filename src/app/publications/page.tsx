"use client";

import { Search, BookOpen, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePublicationData } from "@/hooks/usePublicationData";
import PublicationsList from "@/components/publication/publications-list";
import { Spinner } from "@/components/ui/spinner";
import { ImpactFactorTable } from "@/components/publication/impact-factor-table";
import SectionHeading from "@/components/ui/section-heading";

// Professor's colour palette + original blue
// Professor's colour palette + original blue
// bg is the page background tone that matches each accent
const ACCENT_COLORS = [
  { hex: "#3b82f6", label: "Blue (default)", bg: "" },
  { hex: "#798E87", label: "Sage",           bg: "#d6dbd9" },
  { hex: "#9C964A", label: "Olive",          bg: "#dddccc" },
  { hex: "#CDC08C", label: "Sand",           bg: "#e0dbc8" },
  { hex: "#C7B19C", label: "Taupe",          bg: "#ded7ce" },
  { hex: "#D69C4E", label: "Amber",          bg: "#e0d8c0" },
  { hex: "#D8A499", label: "Rose",           bg: "#dfd5d2" },
];

export default function PublicationsPage() {
  const {
    lastUpdated,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    eraFilter,
    setEraFilter,
    categoryFilter,
    setCategoryFilter,
    allFilteredPublications: filteredPublications,
    isLoading,
    publications: _publications,
    data,
  } = usePublicationData();

  // Add state for debounced input
  const [searchInput, setSearchInput] = useState(searchQuery);
  // Track debouncing state
  const [isDebouncing, setIsDebouncing] = useState(false);
  // Grid or list view
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  // Active accent colour
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].hex);
  const [bgColor, setBgColor] = useState("");

  // Debounce search query updates
  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setIsDebouncing(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setSearchQuery]);

  // Apply accent colour as CSS custom property on the page wrapper
  const pageStyle = {
    "--pub-accent": accentColor,
    "--pub-accent-10": accentColor + "1a",
    "--pub-accent-20": accentColor + "33",
    "--pub-accent-40": accentColor + "66",
  } as React.CSSProperties;

  // Total citations across all publications
  // Total citations from Google Scholar profile (updated manually or via scraper)
  const totalCitations = 19219;

  // Helper to convert hex to rgb for shadow
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };

  return (
    <div className="min-h-screen bg-background" style={{ ...pageStyle, ...(bgColor ? { backgroundColor: bgColor } : {}) }}>
      <div className="container py-16 md:py-24">

        {/* ── Directory Hero ───────────────────────────────────── */}
        <div className="mb-10 pb-10 border-b border-border/50">
          <div className="flex items-start gap-24 max-w-[1200px]">

            {/* Left: text content */}
            <div className="flex-1">
              {/* Eyebrow */}
              <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mb-3">
                A Catalogue · {new Date().getFullYear()}
              </p>

              {/* Title */}
              <h1 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-8 leading-tight">
                AIT Lab Publications
              </h1>

              {/* Description */}
              <p className="text-sm text-foreground/60 leading-relaxed max-w-2xl mb-8">
                A <em>Research Publication</em> is a peer-reviewed article, book
                chapter, or report that advances understanding of transportation
                safety, autonomous systems, and AI-driven mobility. This is an
                open index of every paper published by the{" "}
                <strong className="text-foreground/80">
                  Artificial Intelligence in Transportation Lab at Texas State
                  University
                </strong>{" "}
                - search below and follow the link to the original.
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-8 flex-wrap">
                <div>
                  <p className="font-serif text-3xl font-semibold text-foreground">
                    {isLoading ? "—" : data.length.toLocaleString()}
                  </p>
                  <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mt-0.5">
                    Publications
                  </p>
                </div>
                <div className="w-px h-10 bg-border/50" />
                <div>
                  <p className="font-serif text-3xl font-semibold text-foreground">
                    {isLoading ? "—" : totalCitations.toLocaleString()}
                  </p>
                  <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mt-0.5">
                    Total Citations
                  </p>
                </div>
                <div className="w-px h-10 bg-border/50" />
                <div>
                  <p className="font-serif text-3xl font-semibold text-foreground">
                    {lastUpdated
                      ? new Date(lastUpdated).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                  <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mt-0.5">
                    Last Updated
                  </p>
                </div>
              </div>
            </div>

            {/* Right: AIT Lab logo mark */}
            <div
              className="hidden md:flex flex-shrink-0 w-48 h-48 items-center justify-center rounded-full self-start mt-16 border"
              style={{
                borderColor: accentColor + "66",
                boxShadow: `0 0 40px 10px rgba(${hexToRgb(accentColor)},0.15)`,
                backgroundColor: accentColor + "0d",
              }}
            >
              <img
                src="/images/ait_favicon.png"
                alt="AIT Lab"
                className="w-32 h-32 object-contain opacity-80"
              />
            </div>

          </div>
        </div>
        {/* ── End Hero ─────────────────────────────────────────── */}

        {/* Showing count */}
        <div className="flex flex-wrap items-center justify-between mb-4 mt-6 text-sm text-muted-foreground/80">
          <div className="flex items-center gap-1">
            <span className="font-medium">Showing:</span>
            <span>
              {_publications.length} of {filteredPublications.length}{" "}
              publications
            </span>
          </div>
        </div>

        {/* Search and sort section */}
        <div className="mb-8 glass-card p-4 rounded-xl" style={bgColor ? { backgroundColor: bgColor, borderColor: accentColor + "33" } : {}}>
          <div className="flex flex-wrap items-center gap-3">

            {/* Search — takes remaining space */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 h-4 w-4" />
              <Input
                placeholder="Search publications by title, authors, journal, or year..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 bg-background/50"
              />
              {isDebouncing && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-4 w-4 border-t-2 border-foreground/60 rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Era filter */}
            <Select value={eraFilter} onValueChange={(v) => { setEraFilter(v); }}>
              <SelectTrigger className="bg-background/50 w-[150px]">
                <SelectValue placeholder="All Eras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Eras</SelectItem>
                <SelectItem value="pre2015">Pre – 2015</SelectItem>
                <SelectItem value="2016-2020">2016 – 2020</SelectItem>
                <SelectItem value="2021-2025">2021 – 2025</SelectItem>
                <SelectItem value="2026+">2026 – Now</SelectItem>
              </SelectContent>
            </Select>

            {/* Category filter */}
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); }}>
              <SelectTrigger className="bg-background/50 w-[160px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="journal">Article</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="report">Report</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort order */}
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="bg-background/50 w-[130px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="az">A – Z</SelectItem>
              </SelectContent>
            </Select>

            {/* Grid / List view toggle */}
            <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-background/50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-foreground/10 text-foreground"
                    : "text-foreground/40 hover:text-foreground/70"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-foreground/10 text-foreground"
                    : "text-foreground/40 hover:text-foreground/70"
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Colour theme switcher */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-mono text-foreground/40 uppercase tracking-wider hidden sm:block">
                Theme
              </span>
              <div className="flex items-center gap-1.5">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => { setAccentColor(color.hex); setBgColor(color.bg); }}
                    title={color.label}
                    className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: color.hex,
                      borderColor: accentColor === color.hex ? color.hex : "transparent",
                      outline: accentColor === color.hex ? `2px solid ${color.hex}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Publications list */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Spinner />
          </div>
        ) : !isLoading && filteredPublications.length > 0 ? (
          <PublicationsList viewMode={viewMode} accentColor={accentColor} />
        ) : (
          <div className="text-center py-16 glass-card rounded-xl">
            <BookOpen className="h-16 w-16 mx-auto text-foreground/30 mb-4" />
            <h3 className="text-xl font-medium mb-2">No publications found</h3>
            <p className="text-foreground/60 mb-6">
              We couldn&apos;t find any publications matching your search
              criteria.
            </p>
            <button
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
                setEraFilter("all");
                setCategoryFilter("all");
              }}
              className="text-blue-500 hover:underline"
            >
              Clear search and show all publications
            </button>
          </div>
        )}

        {/* Impact Factor Section */}
        <div className="mt-16">
          <SectionHeading
            title={<span className="gradient-text">Impact Factors</span>}
            subtitle="Explore the impact factors of journals where our research is published"
          />
          <ImpactFactorTable publicationData={data} />
        </div>
      </div>
    </div>
  );
}
