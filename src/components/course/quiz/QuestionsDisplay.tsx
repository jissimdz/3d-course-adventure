
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit2, Trash2 } from "lucide-react";
import { ImageQuestion, TextQuestion } from "../types/quizTypes";

interface ImageQuestionsDisplayProps {
  questions: ImageQuestion[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const ImageQuestionsDisplay: React.FC<ImageQuestionsDisplayProps> = ({
  questions,
  onEdit,
  onDelete,
}) => {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4 mt-4">
      <div className="space-y-4">
        <h4 className="font-medium sticky top-0 bg-white py-2">Questions existantes</h4>
        {questions.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Aucune question avec images. Ajoutez-en une !
          </div>
        )}
        {questions.map((q, index) => (
          <div key={q.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium">{q.question}</p>
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(index)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="relative">
                  <img
                    src={opt.image}
                    alt={opt.alt}
                    className="w-full h-auto rounded border"
                  />
                  {opt.isCorrect && (
                    <span className="absolute top-2 right-2 text-green-500">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

interface TextQuestionsDisplayProps {
  questions: TextQuestion[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const TextQuestionsDisplay: React.FC<TextQuestionsDisplayProps> = ({
  questions,
  onEdit,
  onDelete,
}) => {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4 mt-4">
      <div className="space-y-4">
        <h4 className="font-medium sticky top-0 bg-white py-2">Questions textuelles existantes</h4>
        {questions.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Aucune question textuelle. Ajoutez-en une !
          </div>
        )}
        {questions.map((q, index) => (
          <div key={q.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium">{q.question}</p>
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(index)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex justify-between items-center p-2 border rounded">
                  <span>{opt.text}</span>
                  {opt.isCorrect && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
