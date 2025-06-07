import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { PatientForm } from "@/components/PatientForm";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";
import { PhotoUpload } from "@/components/PhotoUpload";
import { usePatients } from "@/context/PatientContext";
import { QuestionnaireAnswer } from "@/types";

export default function AddPatient() {
  const navigate = useNavigate();
  const { addPatient } = usePatients();
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireAnswer[]>([]);
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePatientSubmit = async (patientData: any) => {
    setIsSubmitting(true);
    try {
      const newPatient = addPatient({
        ...patientData,
        questionnaire: questionnaire.filter((q) => q.questionText || q.answer),
        notes: notes || undefined,
        photo: photos[0] || undefined,
      });
      navigate(`/patient/${newPatient.id}`);
    } catch (error) {
      console.error("Error adding patient:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Add New Patient</h1>
          </div>

          <div className="space-y-6">
            {/* Patient Form */}
            <PatientForm
              onSubmit={handlePatientSubmit}
              submitLabel={isSubmitting ? "Saving..." : "Save Patient"}
            />

            {/* Questionnaire */}
            <QuestionnaireForm
              questionnaire={questionnaire}
              onChange={setQuestionnaire}
            />

            {/* Photo Upload */}
            <PhotoUpload
              photos={photos}
              onChange={setPhotos}
              title="Patient Photo"
              maxPhotos={1}
            />

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">
                    Additional notes about the patient
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
