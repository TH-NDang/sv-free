import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // const generatePageLink = (page: number) => {
  //   const url = new URL("http://localhost");
  //   url.searchParams.set("page", page.toString());
  //   return `${url.pathname}${url.search}`;
  // };

  // Generate array of page numbers to show
  // const getPageNumbers = () => {
  //   const pages = [];
  //   const delta = 2; // Number of pages to show before and after current page

  //   // Always show first page
  //   pages.push(1);

  //   // Calculate range around current page
  //   const rangeStart = Math.max(2, currentPage - delta);
  //   const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  //   // Add ellipsis if needed before range
  //   if (rangeStart > 2) {
  //     pages.push(-1); // -1 represents ellipsis
  //   }

  //   // Add page numbers in range
  //   for (let i = rangeStart; i <= rangeEnd; i++) {
  //     pages.push(i);
  //   }

  //   // Add ellipsis if needed after range
  //   if (rangeEnd < totalPages - 1) {
  //     pages.push(-2); // -2 represents ellipsis after range
  //   }

  //   // Always show last page if there is more than one page
  //   if (totalPages > 1) {
  //     pages.push(totalPages);
  //   }

  //   return pages;
  // };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      <div className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}
