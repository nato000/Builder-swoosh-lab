import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/types";
import { usePatients } from "@/context/PatientContext";
import { format } from "date-fns";

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  const { getPatientVisits } = usePatients();
  const visits = getPatientVisits(patient.id);
  const lastVisit = visits[0];

  const getInitials = () => {
    const name = patient.name || "";
    const surname = patient.surname || "";
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase() || "P";
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={patient.photo} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-sm truncate">
                {patient.name && patient.surname
                  ? `${patient.name} ${patient.surname}`
                  : patient.name || patient.surname || "Unnamed Patient"}
              </h3>
              {visits.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {visits.length} visit{visits.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            <div className="space-y-1 text-xs text-muted-foreground">
              {patient.email && <p className="truncate">{patient.email}</p>}
              {patient.phone && <p>{patient.phone}</p>}
              {patient.dateOfBirth && (
                <p>
                  DOB: {format(new Date(patient.dateOfBirth), "MMM d, yyyy")}
                </p>
              )}
              {lastVisit && (
                <p className="font-medium text-primary">
                  Last visit: {format(new Date(lastVisit.date), "MMM d, yyyy")}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
