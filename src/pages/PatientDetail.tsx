import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  Search,
} from "lucide-react";
import { VisitCard } from "@/components/VisitCard";
import { usePatients } from "@/context/PatientContext";
import { format } from "date-fns";
import { VisitSearchFilters } from "@/types";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPatient, updatePatient, getPatientVisits } = usePatients();

  const patient = id ? getPatient(id) : undefined;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(patient || {});
  const [visitFilters, setVisitFilters] = useState<VisitSearchFilters>({});

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
            <Button onClick={() => navigate("/")}>
              Return to Patient List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const visits = getPatientVisits(patient.id, visitFilters);

  const getInitials = () => {
    const name = patient.name || "";
    const surname = patient.surname || "";
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase() || "P";
  };

  const handleSave = () => {
    updatePatient(patient.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(patient);
    setIsEditing(false);
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
          </div>

          {/* Patient Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={patient.photo} />
                    <AvatarFallback className="text-lg">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {patient.name && patient.surname
                        ? `${patient.name} ${patient.surname}`
                        : patient.name || patient.surname || "Unnamed Patient"}
                    </h1>
                    <p className="text-muted-foreground">
                      Patient since{" "}
                      {format(new Date(patient.createdAt), "MMM yyyy")}
                    </p>
                  </div>
                </div>
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {isExpanded ? "Collapse" : "Expand"}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </CardHeader>

            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Patient Data */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          Patient Information
                        </h3>
                        {!isEditing ? (
                          <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button onClick={handleSave} size="sm">
                              Save
                            </Button>
                            <Button
                              onClick={handleCancel}
                              variant="outline"
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={editData.name || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>Surname</Label>
                            <Input
                              value={editData.surname || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  surname: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={editData.email || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>Phone</Label>
                            <Input
                              value={editData.phone || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>Date of Birth</Label>
                            <Input
                              type="date"
                              value={
                                editData.dateOfBirth
                                  ? editData.dateOfBirth.split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  dateOfBirth: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Name:</strong>{" "}
                            {patient.name || "Not provided"}
                          </div>
                          <div>
                            <strong>Surname:</strong>{" "}
                            {patient.surname || "Not provided"}
                          </div>
                          <div>
                            <strong>Email:</strong>{" "}
                            {patient.email || "Not provided"}
                          </div>
                          <div>
                            <strong>Phone:</strong>{" "}
                            {patient.phone || "Not provided"}
                          </div>
                          <div>
                            <strong>Date of Birth:</strong>{" "}
                            {patient.dateOfBirth
                              ? format(new Date(patient.dateOfBirth), "PPP")
                              : "Not provided"}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Questionnaire */}
                    {patient.questionnaire &&
                      patient.questionnaire.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Questionnaire
                          </h3>
                          <div className="space-y-4">
                            {patient.questionnaire.map((qa) => (
                              <div
                                key={qa.id}
                                className="border rounded-lg p-4"
                              >
                                <div className="font-medium text-sm mb-2">
                                  Question {qa.questionNumber}:{" "}
                                  {qa.questionText}
                                </div>
                                {qa.answer && (
                                  <div className="text-sm text-muted-foreground">
                                    {qa.answer}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Notes */}
                    {patient.notes && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Notes</h3>
                        {isEditing ? (
                          <Textarea
                            value={editData.notes || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                notes: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        ) : (
                          <p className="text-sm">{patient.notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Visit History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Visit History</CardTitle>
                <Button
                  onClick={() => navigate(`/patient/${patient.id}/add-visit`)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Visit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visit Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    placeholder="Filter by date"
                    value={visitFilters.date || ""}
                    onChange={(e) =>
                      setVisitFilters({
                        ...visitFilters,
                        date: e.target.value || undefined,
                      })
                    }
                    className="pl-9"
                  />
                </div>
                {visitFilters.date && (
                  <Button
                    variant="outline"
                    onClick={() => setVisitFilters({})}
                    size="sm"
                  >
                    Clear
                  </Button>
                )}
              </div>

              {/* Visit List */}
              {visits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No visits found. Add the first visit to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visits.map((visit) => (
                    <VisitCard
                      key={visit.id}
                      visit={visit}
                      onClick={() =>
                        navigate(`/patient/${patient.id}/visit/${visit.id}`)
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
