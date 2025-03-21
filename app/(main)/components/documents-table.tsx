import { DownloadIcon, EyeIcon, MoreHorizontalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { Document } from "../types/document";

export function DocumentsTable({ documents }: { documents: Document[] }) {
  return (
    <Card className="flex w-full flex-col gap-4">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead className="w-[300px]">Document</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-16 overflow-hidden rounded">
                      <Image
                        src={doc.thumbnailUrl}
                        alt={doc.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href={`/documents/${doc.id}`}
                        className="font-medium hover:underline"
                      >
                        {doc.title}
                      </Link>
                      <span className="text-muted-foreground text-xs">
                        {doc.author}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.category}</Badge>
                </TableCell>
                <TableCell>{doc.fileType}</TableCell>
                <TableCell>{doc.fileSize}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{doc.downloadCount}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/documents/${doc.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/documents/${doc.id}/download`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/documents/${doc.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/documents/${doc.id}/download`}>
                            Download
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Save to Collection</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-6">
        <div className="text-muted-foreground text-sm">
          Showing {documents.length > 0 ? 1 : 0}-
          {Math.min(documents.length, 10)} of {documents.length} documents
        </div>
        <Pagination className="mx-0 w-fit">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            {documents.length > 10 && (
              <>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
