import React from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Bug } from "lucide-react";

// Tableau d'URLs d'icônes bioicons pour les exemples
const BIOICON_EXAMPLES = ["https://bioicons.com/icons/cell.svg", "https://bioicons.com/icons/virus.svg", "https://bioicons.com/icons/dna.svg", "https://bioicons.com/icons/bacteria.svg", "https://bioicons.com/icons/protein.svg", "/lovable-uploads/80207e3b-3c5f-4d89-bd3c-bc2a15a56e50.png"];
interface BioiconsPanelProps {
  onAddBioicon: (iconUrl: string) => void;
  isLoading: boolean;
}
const BioiconsPanel: React.FC<BioiconsPanelProps> = ({
  onAddBioicon,
  isLoading
}) => {
  return <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">icone scientifique</h2>
      <div className="flex flex-wrap gap-2">
        {BIOICON_EXAMPLES.slice(0, 5).map((iconUrl, index) => <Button key={index} onClick={() => onAddBioicon(iconUrl)} variant="secondary" className="flex items-center gap-2" disabled={isLoading}>
            <ImageIcon size={16} />
            Icon {index + 1}
          </Button>)}

        <Button onClick={() => onAddBioicon(BIOICON_EXAMPLES[5])} variant="secondary" className="flex items-center gap-2" disabled={isLoading}>
          <Bug size={16} />
          Drosophile
        </Button>
      </div>
    </div>;
};
export { BIOICON_EXAMPLES };
export default BioiconsPanel;