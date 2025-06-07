import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { PatientCard } from "@/components/PatientCard";
import { usePatients } from "@/context/PatientContext";

export default function Index() {
  const navigate = useNavigate();
  const { filteredPatients, searchFilters, setSearchFilters } = usePatients();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Patient Management</h1>
            <Button
              onClick={() => navigate("/add-patient")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Patient
            </Button>
          </div>

          {/* Search Bar */}
          <SearchBar
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
          />

          {/* Patient List */}
          <div className="space-y-3">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {Object.keys(searchFilters).length > 0
                    ? "No patients found matching your search criteria."
                    : "No patients yet. Add your first patient to get started."}
                </p>
                {Object.keys(searchFilters).length === 0 && (
                  <Button
                    onClick={() => navigate("/add-patient")}
                    className="mt-4"
                    variant="outline"
                  >
                    Add First Patient
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredPatients.length} patient
                    {filteredPatients.length !== 1 ? "s" : ""} found
                  </p>
                </div>
                <div className="grid gap-3">
                  {filteredPatients.map((patient) => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      onClick={() => navigate(`/patient/${patient.id}`)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
