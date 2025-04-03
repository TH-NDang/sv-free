import { AdminContent } from "@/components/admin/doc-admin-page-content";
import { Pagination } from "@/components/admin/pagination";
import {
  AdminActionButton,
  AdminTabNavigation,
} from "@/components/admin/tab-navigation";
import { Card, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Định nghĩa kiểu Document
type DocumentType = {
  id: string;
  title: string;
  description: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  authorName?: string;
  published: boolean;
  downloadCount?: number | string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface DocPageProps {
  searchParams: {
    search?: string;
    category?: string;
    page?: string;
    tab?: string;
  };
}

export default async function DocPage({ searchParams }: DocPageProps) {
  const { search, category, page = "1", tab = "documents" } = searchParams;
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = 10;

  // Sử dụng dữ liệu mẫu cố định thay vì gọi API
  const mockDocuments: DocumentType[] = [
    {
      id: "1",
      title: "Giáo trình Toán học lớp 12",
      description: "Tài liệu học tập dành cho học sinh lớp 12",
      category: {
        id: "cat1",
        name: "Toán học",
        slug: "toan-hoc",
        description: "Tài liệu Toán học các cấp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      authorName: "Nguyễn Văn A",
      published: true,
      downloadCount: 125,
      createdAt: new Date("2023-08-15"),
      updatedAt: new Date("2023-08-15"),
    },
    {
      id: "2",
      title: "Giáo trình Vật lý lớp 11",
      description: "Tài liệu học tập dành cho học sinh lớp 11",
      category: {
        id: "cat2",
        name: "Vật lý",
        slug: "vat-ly",
        description: "Tài liệu Vật lý các cấp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      authorName: "Trần Thị B",
      published: true,
      downloadCount: 98,
      createdAt: new Date("2023-07-20"),
      updatedAt: new Date("2023-07-20"),
    },
    {
      id: "3",
      title: "Giáo trình Hóa học lớp 10",
      description: "Tài liệu học tập dành cho học sinh lớp 10",
      category: {
        id: "cat3",
        name: "Hóa học",
        slug: "hoa-hoc",
        description: "Tài liệu Hóa học các cấp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      authorName: "Lê Văn C",
      published: false,
      downloadCount: 45,
      createdAt: new Date("2023-06-10"),
      updatedAt: new Date("2023-06-10"),
    },
    {
      id: "4",
      title: "Đề thi thử THPT Quốc gia môn Ngữ văn",
      description: "Bộ đề thi thử có đáp án chi tiết",
      category: {
        id: "cat4",
        name: "Ngữ văn",
        slug: "ngu-van",
        description: "Tài liệu Ngữ văn các cấp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      authorName: "Phạm Thị D",
      published: true,
      downloadCount: 210,
      createdAt: new Date("2023-05-05"),
      updatedAt: new Date("2023-05-05"),
    },
    {
      id: "5",
      title: "Tài liệu ôn thi Tiếng Anh",
      description: "Tài liệu ôn tập từ vựng và ngữ pháp",
      category: {
        id: "cat5",
        name: "Tiếng Anh",
        slug: "tieng-anh",
        description: "Tài liệu Tiếng Anh các cấp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      authorName: "Nguyễn Thị E",
      published: true,
      downloadCount: 178,
      createdAt: new Date("2023-04-15"),
      updatedAt: new Date("2023-04-15"),
    },
  ];

  // Tìm kiếm đơn giản nếu có tham số search
  let filteredDocuments = mockDocuments;
  if (search) {
    filteredDocuments = mockDocuments.filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Lọc theo category nếu có
  if (category) {
    filteredDocuments = filteredDocuments.filter(
      (doc) => doc.category?.id === category
    );
  }

  // Phân trang
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  const totalDocuments = filteredDocuments.length;
  const totalPages = Math.ceil(totalDocuments / pageSize);

  // Tạo component mẫu tại chỗ
  const DocumentsTable = ({ documents }: { documents: DocumentType[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>{doc.title}</TableCell>
            <TableCell>{doc.category?.name || "Uncategorized"}</TableCell>
            <TableCell>{doc.published ? "Published" : "Draft"}</TableCell>
            <TableCell>{doc.createdAt.toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const DocumentsTableSkeleton = () => (
    <div className="p-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage documents, categories, and tags
          </p>
        </div>
        <AdminActionButton tab={tab} />
      </div>

      <div className="space-y-4">
        <AdminTabNavigation />

        <AdminContent
          tab={tab}
          documents={paginatedDocuments}
          searchTerm={search}
          DocumentsTable={DocumentsTable}
          DocumentsTableSkeleton={DocumentsTableSkeleton}
        />

        {tab === "documents" && totalPages > 1 && (
          <Card>
            <CardFooter className="flex items-center justify-between px-6 py-4">
              <div className="text-muted-foreground text-xs">
                Showing <strong>{paginatedDocuments.length}</strong> of{" "}
                <strong>{totalDocuments}</strong> documents
              </div>
              <Pagination
                currentPage={pageNumber}
                totalPages={totalPages}
                baseUrl={`/admin?tab=${tab}&search=${search || ""}&category=${
                  category || ""
                }`}
              />
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
