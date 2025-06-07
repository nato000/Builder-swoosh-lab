import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Visit } from "@/types";
import { format } from "date-fns";
import {
  Calendar,
  FileText,
  Image,
  Package,
  ShoppingCart,
  Wrench,
} from "lucide-react";

interface VisitCardProps {
  visit: Visit;
  onClick: () => void;
}

export function VisitCard({ visit, onClick }: VisitCardProps) {
  const totalProcedures = visit.procedures.length;
  const totalProducts = visit.products.length;
  const totalSoldProducts = visit.soldProducts.length;
  const totalPhotos = visit.photos.length;

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">
                {format(new Date(visit.date), "EEEE, MMMM d, yyyy")}
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(visit.date), "h:mm a")}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {totalProcedures > 0 && (
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                <Wrench className="h-3 w-3" />
                {totalProcedures} procedure{totalProcedures !== 1 ? "s" : ""}
              </Badge>
            )}

            {totalProducts > 0 && (
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                <Package className="h-3 w-3" />
                {totalProducts} product{totalProducts !== 1 ? "s" : ""}
              </Badge>
            )}

            {totalSoldProducts > 0 && (
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                <ShoppingCart className="h-3 w-3" />
                {totalSoldProducts} sold
              </Badge>
            )}

            {totalPhotos > 0 && (
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                <Image className="h-3 w-3" />
                {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {visit.notes && (
            <div className="flex items-start gap-2">
              <FileText className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground line-clamp-2">
                {visit.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
