
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import { Search, Award, Hourglass, Puzzle } from "lucide-react";

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const BadgeSystem: React.FC = () => {
  // Using the badge data structure from your example
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 1, 
      name: "Explorateur", 
      description: "A terminé le module 1", 
      icon: <Search className="h-8 w-8 text-white" />,
      unlocked: true
    },
    {
      id: 2, 
      name: "Génie scientifique", 
      description: "Score > 80% à un quiz", 
      icon: <Award className="h-8 w-8 text-white" />,
      unlocked: false
    },
    {
      id: 3, 
      name: "Maître du temps", 
      description: "7 jours d'activité consécutifs", 
      icon: <Hourglass className="h-8 w-8 text-white" />,
      unlocked: false,
      progress: 3,
      maxProgress: 7
    },
    {
      id: 4, 
      name: "Puzzle Master", 
      description: "A résolu 5 puzzles", 
      icon: <Puzzle className="h-8 w-8 text-white" />,
      unlocked: false,
      progress: 2,
      maxProgress: 5
    }
  ]);

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  const unlockBadge = (id: number) => {
    // This is just for demo purposes - in a real app you'd have proper logic
    setBadges(
      badges.map(badge => 
        badge.id === id ? { ...badge, unlocked: true } : badge
      )
    );
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-brand-blue">Mes Badges</h3>
        <div className="flex flex-wrap gap-4" id="badges-earned">
          {unlockedBadges.length > 0 ? (
            unlockedBadges.map(badge => (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="achievement" 
                    state="unlocked" 
                    className="cursor-pointer rounded-full bg-gradient-to-br from-amber-300 to-amber-500"
                  >
                    {badge.icon}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-bold">{badge.name}</p>
                    <p className="text-xs">{badge.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))
          ) : (
            <p className="text-gray-500 italic">Pas encore de badges débloqués</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-brand-blue">Badges à Débloquer</h3>
        <div className="flex flex-wrap gap-4" id="badges-locked">
          {lockedBadges.map(badge => (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <Badge 
                  variant="locked" 
                  className="cursor-pointer group rounded-full"
                  onClick={() => unlockBadge(badge.id)} // Just for demo
                >
                  {badge.icon}
                  {badge.progress !== undefined && (
                    <span className="absolute bottom-0 text-[10px] bg-black/70 text-white w-full text-center">
                      {badge.progress}/{badge.maxProgress}
                    </span>
                  )}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-bold">{badge.name}</p>
                  <p className="text-xs">{badge.description}</p>
                  {badge.progress !== undefined && (
                    <p className="text-xs mt-1">
                      Progrès: {badge.progress}/{badge.maxProgress}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeSystem;
