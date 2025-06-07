import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Wrench, Package, ShoppingCart } from "lucide-react";
import { PhotoUpload } from "@/components/PhotoUpload";
import { ProcedureModal } from "@/components/ProcedureModal";
import { usePatients } from "@/context/PatientContext";
import { Procedure, Product, SoldProduct } from "@/types";
import { format } from "date-fns";

const PROCEDURE_SUGGESTIONS = [
  "Consultation",
  "Follow-up",
  "Treatment",
  "Examination",
  "Surgery",
  "Therapy",
  "Check-up",
  "Cleaning",
  "X-ray",
  "Blood test",
];

const PRODUCT_SUGGESTIONS = [
  "Medication A",
  "Medication B",
  "Supplement",
  "Medical device",
  "Bandages",
  "Gauze",
  "Antiseptic",
  "Cream",
  "Tablet",
  "Injection",
];

export default function PatientVisit() {
  const { patientId, visitId } = useParams<{
    patientId: string;
    visitId: string;
  }>();
  const navigate = useNavigate();
  const { getPatient, getVisit, updateVisit } = usePatients();

  const patient = patientId ? getPatient(patientId) : undefined;
  const visit = visitId ? getVisit(visitId) : undefined;

  const [notes, setNotes] = useState(visit?.notes || "");
  const [photos, setPhotos] = useState<string[]>(visit?.photos || []);
  const [procedures, setProcedures] = useState<Procedure[]>(
    visit?.procedures || [],
  );
  const [products, setProducts] = useState<Product[]>(visit?.products || []);
  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>(
    visit?.soldProducts || [],
  );

  const [procedureModalOpen, setProcedureModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [soldProductModalOpen, setSoldProductModalOpen] = useState(false);

  if (!patient || !visit) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Visit Not Found</h1>
            <Button onClick={() => navigate("/")}>
              Return to Patient List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateVisit(visit.id, {
      notes: notes || undefined,
      photos,
      procedures,
      products,
      soldProducts,
    });
    navigate(`/patient/${patient.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/patient/${patient.id}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {patient.name && patient.surname
                    ? `${patient.name} ${patient.surname}`
                    : patient.name || patient.surname || "Unnamed Patient"}
                </h1>
                <p className="text-muted-foreground">
                  Visit on {format(new Date(visit.date), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>

          {/* Procedures */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Procedures
              </CardTitle>
              <Button
                onClick={() => setProcedureModalOpen(true)}
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              {procedures.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No procedures added yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {procedures.map((procedure) => (
                    <div
                      key={procedure.id}
                      className="p-2 border rounded text-sm"
                    >
                      {procedure.name}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products
              </CardTitle>
              <Button
                onClick={() => setProductModalOpen(true)}
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No products added yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 border rounded text-sm"
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sold Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Sold Products
              </CardTitle>
              <Button
                onClick={() => setSoldProductModalOpen(true)}
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              {soldProducts.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No sold products added yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {soldProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 border rounded text-sm"
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Visit notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter notes about this visit..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <PhotoUpload
            photos={photos}
            onChange={setPhotos}
            title="Visit Photos"
          />

          {/* Modals */}
          <ProcedureModal
            isOpen={procedureModalOpen}
            onClose={() => setProcedureModalOpen(false)}
            title="Procedures"
            items={procedures}
            onItemsChange={setProcedures}
            suggestions={PROCEDURE_SUGGESTIONS}
          />

          <ProcedureModal
            isOpen={productModalOpen}
            onClose={() => setProductModalOpen(false)}
            title="Products"
            items={products}
            onItemsChange={setProducts}
            suggestions={PRODUCT_SUGGESTIONS}
          />

          <ProcedureModal
            isOpen={soldProductModalOpen}
            onClose={() => setSoldProductModalOpen(false)}
            title="Sold Products"
            items={soldProducts}
            onItemsChange={setSoldProducts}
            suggestions={PRODUCT_SUGGESTIONS}
          />
        </div>
      </div>
    </div>
  );
}
