import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  const generatePageLink = (page: number) => {
    const url = new URL(baseUrl, "http://localhost");
    url.searchParams.set("page", page.toString());
    return `${url.pathname}${url.search}`;
  };

  // Generate array of page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Number of pages to show before and after current page

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis if needed before range
    if (rangeStart > 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add page numbers in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed after range
    if (rangeEnd < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis after range
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={generatePageLink(currentPage - 1)}>
            <IconChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <IconChevronLeft className="h-4 w-4" />
          </span>
        )}
      </Button>

      {pageNumbers.map((page, i) => {
        // Handle ellipsis
        if (page < 0) {
          return (
            <span
              key={`ellipsis-${i}`}
              className="text-muted-foreground mx-1 px-1"
            >
              …
            </span>
          );
        }

        // Handle page numbers
        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            asChild={currentPage !== page}
          >
            {currentPage !== page ? (
              <Link href={generatePageLink(page)}>{page}</Link>
            ) : (
              <span>{page}</span>
            )}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={generatePageLink(currentPage + 1)}>
            <IconChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <IconChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  );
}
