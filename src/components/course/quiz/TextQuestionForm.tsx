
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TextQuestion } from "../types/quizTypes";

interface TextQuestionFormProps {
  defaultValues: TextQuestion;
  onSubmit: (data: TextQuestion) => void;
  currentSeriesId: string;
}

const TextQuestionForm: React.FC<TextQuestionFormProps> = ({
  defaultValues,
  onSubmit,
  currentSeriesId,
}) => {
  const form = useForm<TextQuestion>({
    defaultValues,
  });

  // Store form data in localStorage when form changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        localStorage.setItem(`currentForm_text_${currentSeriesId}`, JSON.stringify(value));
      } catch (error) {
        console.error("Error saving form data to localStorage:", error);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [form, currentSeriesId]);

  const handleFormSubmit = (data: TextQuestion) => {
    // Check if all fields are filled
    if (!data.question.trim()) {
      toast.error("Veuillez entrer une question");
      return;
    }

    // Check if texts are provided
    const missingTexts = data.options.some(opt => !opt.text.trim());
    if (missingTexts) {
      toast.error("Veuillez fournir du texte pour toutes les options");
      return;
    }

    // Check if at least one correct option is selected
    const hasCorrectOption = data.options.some(option => option.isCorrect === true);
    if (!hasCorrectOption) {
      toast.error("Veuillez sélectionner au moins une option correcte");
      return;
    }

    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input placeholder="Entrez la question..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h4 className="font-medium">Options de réponse</h4>
          {form.watch("options").map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name={`options.${index}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option {index + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder="Texte de l'option..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`options.${index}.isCorrect`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel>Réponse correcte</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">
          {defaultValues.id > 0 ? "Modifier la Question" : "Ajouter la Question"}
        </Button>
      </form>
    </Form>
  );
};

export default TextQuestionForm;
