
import React, { useRef } from "react";
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
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { ImageQuestion } from "../types/quizTypes";

interface ImageQuestionFormProps {
  defaultValues: ImageQuestion;
  onSubmit: (data: ImageQuestion) => void;
  currentSeriesId: string;
}

const ImageQuestionForm: React.FC<ImageQuestionFormProps> = ({
  defaultValues,
  onSubmit,
  currentSeriesId,
}) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);
  const form = useForm<ImageQuestion>({
    defaultValues,
  });

  // Store form data in localStorage when form changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        localStorage.setItem(`currentForm_image_${currentSeriesId}`, JSON.stringify(value));
      } catch (error) {
        console.error("Error saving form data to localStorage:", error);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [form, currentSeriesId]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, optionIndex: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Create a data URL from the file instead of uploading to server
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageUrl = e.target.result.toString();
          
          const currentOptions = form.getValues('options');
          currentOptions[optionIndex] = {
            ...currentOptions[optionIndex],
            image: imageUrl,
            alt: file.name,
          };
          form.setValue('options', currentOptions);
          
          // Save form state after upload
          localStorage.setItem(`currentForm_image_${currentSeriesId}`, JSON.stringify(form.getValues()));
          toast.success('Image téléchargée avec succès');
        }
      };
      
      reader.onerror = () => {
        toast.error('Échec de lecture du fichier image');
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Échec du téléchargement de l\'image');
    }
  };

  const handleFormSubmit = (data: ImageQuestion) => {
    // Check if all fields are filled
    if (!data.question.trim()) {
      toast.error("Veuillez entrer une question");
      return;
    }

    // Check if images are provided
    const missingImages = data.options.some(opt => !opt.image);
    if (missingImages) {
      toast.error("Veuillez fournir des images pour toutes les options");
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
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`options.${index}.image`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Image {index + 1}</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="URL de l'image..." 
                              {...field}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRefs.current[index]?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                            <input
                              type="file"
                              ref={el => fileInputRefs.current[index] = el}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, index)}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name={`options.${index}.alt`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description {index + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder="Description..." {...field} />
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

              {form.watch(`options.${index}.image`) && (
                <img 
                  src={form.watch(`options.${index}.image`)}
                  alt={form.watch(`options.${index}.alt`)}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
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

export default ImageQuestionForm;
