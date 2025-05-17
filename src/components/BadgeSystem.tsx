
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import { Star, Award, Trophy, BadgeCheck } from "lucide-react";

interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const BadgeSystem: React.FC = () => {
  // This would normally come from a database or localStorage
  const [badges, setBadges] = useState<AchievementBadge[]>([
    {
      id: "puzzle-beginner",
      name: "Débutant Puzzle",
      description: "Complétez votre premier puzzle",
      icon: <Award className="h-8 w-8 text-white" />,
      unlocked: true
    },
    {
      id: "puzzle-enthusiast",
      name: "Enthousiaste Puzzle",
      description: "Complétez 5 puzzles",
      icon: <Trophy className="h-8 w-8 text-white" />,
      unlocked: false,
      progress: 3,
      maxProgress: 5
    },
    {
      id: "puzzle-master",
      name: "Maître Puzzle",
      description: "Complétez un puzzle difficile en moins de 2 minutes",
      icon: <Star className="h-8 w-8 text-white" />,
      unlocked: false
    },
    {
      id: "puzzle-collector",
      name: "Collectionneur",
      description: "Ajoutez 3 images personnalisées",
      icon: <BadgeCheck className="h-8 w-8 text-white" />,
      unlocked: false,
      progress: 1,
      maxProgress: 3
    }
  ]);

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  const unlockBadge = (id: string) => {
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
        <div className="flex flex-wrap gap-4">
          {unlockedBadges.length > 0 ? (
            unlockedBadges.map(badge => (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <Badge variant="achievement" state="unlocked" className="cursor-pointer">
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
        <div className="flex flex-wrap gap-4">
          {lockedBadges.map(badge => (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <Badge 
                  variant="locked" 
                  className="cursor-pointer group"
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
