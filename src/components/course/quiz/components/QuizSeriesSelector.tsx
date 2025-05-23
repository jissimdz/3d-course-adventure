
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuizSeries } from "../../types/quizTypes";

interface QuizSeriesSelectorProps {
  quizSeries: QuizSeries[];
  currentSeriesId: string;
  onChangeSeriesId: (id: string) => void;
}

const QuizSeriesSelector: React.FC<QuizSeriesSelectorProps> = ({
  quizSeries,
  currentSeriesId,
  onChangeSeriesId
}) => {
  if (quizSeries.length <= 1) {
    return null;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Série de quiz</label>
      <Select value={currentSeriesId} onValueChange={onChangeSeriesId}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une série" />
        </SelectTrigger>
        <SelectContent>
          {quizSeries.map(series => (
            <SelectItem key={series.id} value={series.id}>
              {series.name} ({series.imageQuestions.length + series.textQuestions.length} questions)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuizSeriesSelector;
