"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TeamMember, Fellow } from "@/types/team";
import Link from "next/link";
import { MdOutlineMailOutline } from "react-icons/md";
import { LiaOrcid } from "react-icons/lia";
import { FiLinkedin } from "react-icons/fi";
import { FaGoogleScholar } from "react-icons/fa6";
import { FiGithub } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { SiResearchgate } from "react-icons/si";
import ImageWithFallback from "../image-w-fallback";
import { cn } from "@/lib/utils";

interface TeamMemberCardProps {
  member: TeamMember | Fellow;
  onOpenModal: (member: TeamMember | Fellow) => void;
}

export default function TeamMemberCard({
  member,
  onOpenModal,
}: TeamMemberCardProps) {
  const isDirector = member.label.toLowerCase().includes("director");

  return (
    <Card
      className={cn(
        "glass-card h-full flex flex-col md:flex-row items-start card-hover overflow-hidden p-4",
        isDirector &&
          "relative !border-blue-500/50 bg-gradient-to-br from-blue-500/15 via-white/80 to-cyan-500/10 shadow-[0_20px_60px_-30px_rgba(59,130,246,0.9)] ring-1 ring-inset ring-blue-400/20 dark:via-black/20 md:p-6"
      )}
    >
      {isDirector && (
        <div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "relative h-full overflow-hidden rounded-md aspect-[300/450] mx-auto md:mx-0 w-full sm:w-[60%] md:w-[30%] lg:w-[20%]",
          isDirector &&
            "ring-4 ring-blue-500/15 shadow-xl md:w-[34%] lg:w-[26%]"
        )}
      >
        <ImageWithFallback
          src={"/images/team/" + member.image || "/images/placeholder.png"}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          fallbackSrc="/images/placeholder.png"
        />
      </div>
      <div
        className={cn(
          "md:w-[70%]",
          isDirector && "md:w-[66%] lg:w-[74%]"
        )}
      >
        <CardContent className={cn("p-4", isDirector && "md:p-6")}>
          <h3
            className={cn(
              "font-bold text-xl mb-1",
              isDirector && "text-2xl tracking-tight md:text-3xl"
            )}
          >
            {member.name}
          </h3>
          <p
            className={cn(
              "text-sm font-bold text-foreground/70 mb-2",
              isDirector && "text-base text-blue-600 dark:text-blue-300"
            )}
          >
            {member.label}
          </p>
          {/* <p className="text-xs text-blue-500 mb-4">{member.group}</p> */}
          <p
            className={cn(
              "line-clamp-5 break-words text-sm",
              isDirector && "md:line-clamp-6 md:text-base md:leading-relaxed"
            )}
          >
            {member.description}
          </p>
        </CardContent>
        <CardFooter
          className={cn(
            "flex gap-2 p-4 pt-0 flex-wrap",
            isDirector && "md:px-6 md:pb-6"
          )}
        >
          <Button
            className={cn(
              "text-white rounded-full px-4",
              isDirector && "shadow-md shadow-blue-500/20"
            )}
            onClick={() => onOpenModal(member)}
          >
            View Profile
          </Button>
          {member.email !== "" && (
            <Link
              href={`mailto:${member.email}`}
              className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-blue-500/10 transition-colors"
              aria-label={`Email ${member.name}`}
            >
              <MdOutlineMailOutline className="h-4 w-4 text-blue-500" />
            </Link>
          )}
          {member.linkedin !== "" && (
            <Link
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-blue-500/10 transition-colors"
              aria-label={`${member.name}'s LinkedIn profile`}
            >
              <FiLinkedin className="h-4 w-4 text-blue-500" />
            </Link>
          )}
          {member.orcid && (
            <Link
              href={member.orcid}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-blue-500/10 transition-colors"
            >
              <LiaOrcid className="h-5 w-5 text-blue-500" />
            </Link>
          )}
          {member.googleScholar && (
            <Link
              href={member.googleScholar}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-blue-500/10 transition-colors"
            >
              <FaGoogleScholar className="h-4 w-4 text-blue-500" />
            </Link>
          )}
          {member.github && (
            <Link
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-blue-500/10 transition-colors"
            >
              <FiGithub className="h-4 w-4 text-blue-500" />
            </Link>
          )}
          {member.twitter && (
            <Link
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-blue-500/10 transition-colors"
            >
              <FaXTwitter className="h-4 w-4 text-blue-500" />
            </Link>
          )}
          {member.researchGate && (
            <Link
              href={member.researchGate}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-blue-500/10 transition-colors"
            >
              <SiResearchgate className="h-4 w-4 text-blue-500" />
            </Link>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
