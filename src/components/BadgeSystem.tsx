
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import { Search, Award, Hourglass, Star } from "lucide-react";

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  level?: number;
  color?: string;
  subtitle?: string;
}

const BadgeSystem: React.FC = () => {
  // Badges originaux
  const [originalBadges, setOriginalBadges] = useState<Badge[]>([
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
    }
  ]);

  // Nouveaux badges de niveau
  const [levelBadges, setLevelBadges] = useState<Badge[]>([
    {
      id: 101,
      name: "Niveau 1",
      subtitle: "Initiation",
      description: "Vous avez commencé votre parcours d'apprentissage",
      icon: <Star className="h-8 w-8 text-white" />,
      unlocked: true,
      level: 1,
      color: "from-cyan-300 to-cyan-500"
    },
    {
      id: 102,
      name: "Niveau 2",
      subtitle: "Débutant Confirmé",
      description: "Vous progressez dans votre apprentissage",
      icon: <Star className="h-8 w-8 text-white" />,
      unlocked: false,
      level: 2,
      color: "from-gray-400 to-gray-600"
    },
    {
      id: 103,
      name: "Niveau 3",
      subtitle: "Intermédiaire",
      description: "Vous maîtrisez les concepts fondamentaux",
      icon: <Star className="h-8 w-8 text-white" />,
      unlocked: false,
      level: 3,
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 104,
      name: "Niveau 4",
      subtitle: "Avancé",
      description: "Vous avez une bonne expertise",
      icon: <Star className="h-8 w-8 text-white" />,
      unlocked: false,
      level: 4,
      color: "from-gray-500 to-gray-700"
    },
    {
      id: 105,
      name: "Niveau 5",
      subtitle: "Élite",
      description: "Vous êtes parmi les meilleurs",
      icon: <Star className="h-8 w-8 text-white" />,
      unlocked: false,
      level: 5,
      color: "from-red-400 to-red-600"
    },
    {
      id: 106,
      name: "Niveau 6",
      subtitle: "Légendaire",
      description: "Vous avez atteint le plus haut niveau",
      icon: <Star className="h-8 w-8 text-white" />,
      unlocked: false,
      level: 6,
      color: "from-yellow-300 to-yellow-500"
    },
  ]);

  const unlockedOriginalBadges = originalBadges.filter(badge => badge.unlocked);
  const lockedOriginalBadges = originalBadges.filter(badge => !badge.unlocked);
  
  const unlockedLevelBadges = levelBadges.filter(badge => badge.unlocked);
  const lockedLevelBadges = levelBadges.filter(badge => !badge.unlocked);

  const unlockBadge = (id: number, isLevelBadge: boolean = false) => {
    // This is just for demo purposes - in a real app you'd have proper logic
    if (isLevelBadge) {
      setLevelBadges(
        levelBadges.map(badge => 
          badge.id === id ? { ...badge, unlocked: true } : badge
        )
      );
    } else {
      setOriginalBadges(
        originalBadges.map(badge => 
          badge.id === id ? { ...badge, unlocked: true } : badge
        )
      );
    }
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow-md">
      {/* Section des badges de niveau */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-brand-blue">Niveaux Débloqués</h3>
        <div className="flex flex-wrap gap-5" id="level-badges-earned">
          {unlockedLevelBadges.length > 0 ? (
            unlockedLevelBadges.map(badge => (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <Badge 
                      variant="achievement" 
                      state="unlocked" 
                      className={`cursor-pointer rounded-full bg-gradient-to-br ${badge.color} w-20 h-20 flex items-center justify-center mb-2 border-2 border-yellow-300 relative`}
                    >
                      {badge.icon}
                      <div className="absolute -bottom-1 w-full flex justify-center">
                        <span className="text-xs bg-yellow-400 text-yellow-900 px-2 rounded-full font-bold">
                          {badge.level}
                        </span>
                      </div>
                    </Badge>
                    <span className="text-sm font-semibold">{badge.subtitle}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-bold">{badge.name}</p>
                    <p className="text-xs italic">{badge.subtitle}</p>
                    <p className="text-xs mt-1">{badge.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))
          ) : (
            <p className="text-gray-500 italic">Pas encore de niveau débloqué</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-brand-blue">Niveaux Suivants</h3>
        <div className="flex flex-wrap gap-5" id="level-badges-locked">
          {lockedLevelBadges.map(badge => (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <Badge 
                    variant="locked" 
                    className="cursor-pointer group rounded-full w-20 h-20 flex items-center justify-center mb-2 relative"
                    onClick={() => unlockBadge(badge.id, true)} // Just for demo
                  >
                    {badge.icon}
                    <div className="absolute -bottom-1 w-full flex justify-center">
                      <span className="text-xs bg-gray-300 text-gray-700 px-2 rounded-full font-bold">
                        {badge.level}
                      </span>
                    </div>
                  </Badge>
                  <span className="text-sm text-gray-500">{badge.subtitle}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-bold">{badge.name}</p>
                  <p className="text-xs italic">{badge.subtitle}</p>
                  <p className="text-xs mt-1">{badge.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-xl font-semibold mb-4 text-brand-blue">Mes Badges</h3>
        <div className="flex flex-wrap gap-4" id="badges-earned">
          {unlockedOriginalBadges.length > 0 ? (
            unlockedOriginalBadges.map(badge => (
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
          {lockedOriginalBadges.map(badge => (
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
