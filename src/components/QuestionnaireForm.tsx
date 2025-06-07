import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { QuestionnaireAnswer } from "@/types";

interface QuestionnaireFormProps {
  questionnaire?: QuestionnaireAnswer[];
  onChange: (questionnaire: QuestionnaireAnswer[]) => void;
}

export function QuestionnaireForm({
  questionnaire = [],
  onChange,
}: QuestionnaireFormProps) {
  const [questions, setQuestions] = useState<QuestionnaireAnswer[]>(
    questionnaire.length > 0
      ? questionnaire
      : [
          {
            id: crypto.randomUUID(),
            questionNumber: 1,
            questionText: "",
            answer: "",
          },
        ],
  );

  const addQuestion = () => {
    const newQuestion: QuestionnaireAnswer = {
      id: crypto.randomUUID(),
      questionNumber: questions.length + 1,
      questionText: "",
      answer: "",
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    onChange(updatedQuestions);
  };

  const removeQuestion = (id: string) => {
    const updatedQuestions = questions
      .filter((q) => q.id !== id)
      .map((q, index) => ({ ...q, questionNumber: index + 1 }));
    setQuestions(updatedQuestions);
    onChange(updatedQuestions);
  };

  const updateQuestion = (
    id: string,
    field: "questionText" | "answer",
    value: string,
  ) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, [field]: value } : q,
    );
    setQuestions(updatedQuestions);
    onChange(updatedQuestions);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Questionnaire</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addQuestion}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="font-medium">
                Question {question.questionNumber}
              </Label>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(question.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`question-text-${question.id}`}>
                Question Text
              </Label>
              <Textarea
                id={`question-text-${question.id}`}
                placeholder="Enter question text..."
                value={question.questionText}
                onChange={(e) =>
                  updateQuestion(question.id, "questionText", e.target.value)
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`answer-${question.id}`}>Answer</Label>
              <Textarea
                id={`answer-${question.id}`}
                placeholder="Enter answer..."
                value={question.answer || ""}
                onChange={(e) =>
                  updateQuestion(question.id, "answer", e.target.value)
                }
                rows={3}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
