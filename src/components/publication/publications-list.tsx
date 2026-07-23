"use client";

import { useEffect, useRef } from "react";
import { usePublicationData } from "@/hooks/usePublicationData";
import PublicationCard from "./publication-card";

interface PublicationsListProps {
  viewMode?: "grid" | "list";
  accentColor?: string;
}

export default function PublicationsList({ viewMode = "grid", accentColor = "#3b82f6" }: PublicationsListProps) {
  const {
    publications,
    isLoading,
    error,
    hasMore,
    loadMore,
  } = usePublicationData();

  // Sentinel ref — when this div enters the viewport, load more
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "200px" } // start loading 200px before hitting the bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  if (isLoading && publications.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg">Loading publications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-red-500">
          Error loading publications: {error.message}
        </p>
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg">No publications found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Grid view */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.map((publication) => (
            <PublicationCard
              key={publication.title}
              publication={publication}
              viewMode="grid"
              accentColor={accentColor}
            />
          ))}
        </div>
      ) : (
        /* List view */
        <div className="flex flex-col gap-3">
          {publications.map((publication) => (
            <PublicationCard
              key={publication.title}
              publication={publication}
              viewMode="list"
              accentColor={accentColor}
            />
          ))}
        </div>
      )}

      {/* Sentinel — intersection observer watches this */}
      <div ref={sentinelRef} className="h-4" />

      {/* Loading indicator */}
      {isLoading && publications.length > 0 && (
        <div className="flex justify-center py-6">
          <div className="h-6 w-6 border-t-2 border-foreground/40 rounded-full animate-spin" />
        </div>
      )}

      {/* End of results */}
      {!hasMore && publications.length > 0 && (
        <p className="text-center text-sm text-foreground/40 py-4">
          Showing all {publications.length} publications
        </p>
      )}
    </div>
  );
}
