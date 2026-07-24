import { FileText, ExternalLink } from "lucide-react";
import type { ResearchPaper } from "@/types/publication";
import Link from "next/link";

interface PublicationCardProps {
  publication: ResearchPaper;
  viewMode?: "grid" | "list";
  accentColor?: string;
}

// Venue: journal > book > publisher
function getVenue(publication: ResearchPaper): string {
  return publication.journal || publication.book || publication.publisher || "";
}

// Category label without parentheses
function getItemType(publication: ResearchPaper): string {
  if (publication.report_number) return "REPORT";
  if (publication.book) return "BOOK";
  return "ARTICLE";
}

// Authors: both names if 2, first name only + "et al." if 3+
// Authors: last name only for et al. (Harvard style)
// 1 author: full name
// 2 authors: Last1 and Last2
// 3+ authors: Last1 et al.
function getLastName(fullName: string): string {
  const suffixes = new Set(["jr", "jr.", "sr", "sr.", "ii", "iii", "iv"]);
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  while (parts.length > 1 && suffixes.has(parts[parts.length - 1].toLowerCase())) {
    parts.pop();
  }
  return parts[parts.length - 1] || fullName;
}

function formatAuthors(authors?: string): string {
  if (!authors) return "AIT Lab";
  const parts = authors.split(",").map((a) => a.trim()).filter(Boolean);
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${getLastName(parts[0])} and ${getLastName(parts[1])}`;
  return `${getLastName(parts[0])} et al.`;
}

// Year from year field or date_added fallback
function getYear(publication: ResearchPaper): string {
  if (publication.year) return String(publication.year);
  if (publication.date_added)
    return String(new Date(publication.date_added).getFullYear());
  return "";
}

// Citation count — handles string or number from API
function getCitations(publication: ResearchPaper): number {
  const val = publication.total_citations;
  if (!val) return 0;
  const n = typeof val === "string" ? parseInt(val, 10) : val;
  return isNaN(n) ? 0 : n;
}

// Truncate description to 100 chars
function getShortDescription(description?: string): string {
  if (!description) return "";
  return description.length > 100
    ? description.slice(0, 100) + "…"
    : description;
}

export default function PublicationCard({
  publication,
  viewMode = "grid",
  accentColor = "#3b82f6",
}: PublicationCardProps) {
  const itemType = getItemType(publication);
  const venue = getVenue(publication);
  const year = getYear(publication);
  const authors = formatAuthors(publication.authors);
  const citations = getCitations(publication);
  const shortDesc = getShortDescription(publication.description);

  // The main link target is source_url, falling back to url
  const mainLink = publication.source_url || publication.url;

  // Citation badge style using accent color
  const citationStyle = {
    backgroundColor: accentColor + "1a",
    color: accentColor,
  };

  // ── List row variant ──────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div className="glass-card rounded-xl px-5 py-4 flex items-start gap-4 card-hover">
        {/* Left: type + year */}
        <div className="flex-shrink-0 w-24 text-right hidden sm:block">
          <span className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
            {itemType}
          </span>
          <p className="text-sm font-semibold text-foreground/70 mt-0.5">{year}</p>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block w-px self-stretch bg-border/50 flex-shrink-0" />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-snug mb-1 line-clamp-2">
            {mainLink ? (
              <Link
                href={mainLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ ["--hover-color" as string]: accentColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "")}
              >
                {publication.title}
              </Link>
            ) : (
              publication.title
            )}
          </h3>
          <p className="text-sm text-foreground/70 line-clamp-1 mb-1">
            {authors}
            {venue ? ` · ${venue}` : ""}
          </p>
          {/* Short description */}
          {shortDesc && (
            <p className="text-xs text-foreground/60 line-clamp-1 mt-1">
              {shortDesc}
            </p>
          )}
          {/* Mobile-only: show type + year inline */}
          <p className="text-xs text-foreground/60 sm:hidden">{itemType} · {year}</p>
        </div>

        {/* Right: citations + action links */}
        <div className="flex-shrink-0 flex items-center gap-2 ml-auto">
          {citations > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap" style={citationStyle}>
              {citations} {citations === 1 ? "Citation" : "Citations"}
            </span>
          )}
          {publication.pdf_link && (
            <Link
              href={`https://raw.githubusercontent.com/Xatta-Trone/ait-lab-published-papers/refs/heads/main/${publication.pdf_link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 transition-colors"
              title="Download author copy"
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = accentColor)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "")}
            >
              <FileText className="h-4 w-4" />
            </Link>
          )}
          {mainLink && (
            <Link
              href={mainLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 transition-colors"
              title="Read the original"
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = accentColor)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "")}
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // ── Grid card variant — typewriter document style ──────────────
  return (
    <div className="glass-card rounded-xl flex flex-col h-full card-hover overflow-hidden">
      {/* Card body */}
      <div className="flex-1 p-5 flex flex-col gap-3">

        {/* Eyebrow: category only, no parentheses */}
        <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/60 leading-tight">
          {itemType}
        </div>

        {/* Title — links to source_url */}
        <h3 className="font-serif text-[1.05rem] leading-snug font-normal text-foreground line-clamp-3">
          {mainLink ? (
            <Link
              href={mainLink}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              {publication.title}
            </Link>
          ) : (
            publication.title
          )}
        </h3>

        {/* Short description — 100 chars */}
        {shortDesc && (
          <p className="font-mono text-[11px] leading-relaxed text-foreground/60 line-clamp-2">
            {shortDesc}
          </p>
        )}

        {/* Hairline divider — pushed to bottom of flex body */}
        <hr className="border-border/40 mt-auto" />

        {/* Author + Year row */}
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[11px] text-foreground/70 truncate">
            {authors}
          </span>
          <span className="font-mono text-[11px] text-foreground/70 flex-shrink-0">
            {year}
          </span>
        </div>
      </div>

      {/* Card footer: venue + links + citations */}
      <div className="border-t border-border/40 px-5 py-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/60 truncate">
          {venue}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {publication.pdf_link && (
            <Link
              href={`https://raw.githubusercontent.com/Xatta-Trone/ait-lab-published-papers/refs/heads/main/${publication.pdf_link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 transition-colors"
              title="Download author copy"
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = accentColor)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "")}
            >
              <FileText className="h-3.5 w-3.5" />
            </Link>
          )}
          {mainLink && (
            <Link
              href={mainLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 transition-colors"
              title="Read the original"
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = accentColor)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "")}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
          {citations > 0 && (
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap" style={citationStyle}>
              {citations} {citations === 1 ? "Citation" : "Citations"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
