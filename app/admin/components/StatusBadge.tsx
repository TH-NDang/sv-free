import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "Active"
      ? "default"
      : status === "Inactive"
        ? "destructive"
        : "secondary";
  return (
    <Badge variant={variant}>
      {status === "Active" && <Check className="mr-1 h-3 w-3" />}
      {status === "Inactive" && <X className="mr-1 h-3 w-3" />}
      {status}
    </Badge>
  );
}
