"use client";

import { AreaChartComponent } from "@/app/admin/components/AreaChartComponent";
import { BarChartComponent } from "@/app/admin/components/BarChartComponent";
import { PieChartComponent } from "@/app/admin/components/PieChartComponent";
import { StatCard } from "@/app/admin/components/StatCard";
import { TopDocumentsTable } from "@/app/admin/components/TopDocumentsTable";
import { UsersTable } from "@/app/admin/components/UsersTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Category } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { Download, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import { TopDocument, User } from "./types";

async function fetchAnalyticsData() {
  const response = await fetch("/api/analytics");
  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }
  return response.json();
}

// Add interfaces
interface MonthlyStats {
  month: string;
  downloads: number;
  views: number;
}

interface AnalyticsData {
  categoryData: Array<{
    category: Category;
    documents: number | string;
  }>;
  monthlyStats: MonthlyStats[];
  fileTypeData: Array<{
    type: string;
    count: number;
  }>;
  topDocuments: TopDocument[];
  users: User[];
  newUsers: User[];
  pendingDocuments: number;
  totalDownloads: number;
  totalViews: number;
}

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ["analyticsData"],
    queryFn: fetchAnalyticsData,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [docSearchTerm, setDocSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [docPage, setDocPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 5;

  // Memoize filtered data
  const filteredUsers = useMemo(() => {
    if (!data?.newUsers || !Array.isArray(data.newUsers)) return [];
    return data.newUsers.filter(
      (user: User) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.newUsers, searchTerm]);

  const filteredDocs = useMemo(() => {
    if (!data?.topDocuments || !Array.isArray(data.topDocuments)) return [];
    return data.topDocuments.filter((doc: TopDocument) =>
      doc.title.toLowerCase().includes(docSearchTerm.toLowerCase())
    );
  }, [data?.topDocuments, docSearchTerm]);

  const filteredDocumentData = useMemo(() => {
    if (!data?.monthlyStats) return [];
    return data.monthlyStats.filter((monthData: MonthlyStats) => {
      if (timeFilter === "7days") {
        const recentMonths = data.monthlyStats.slice(-2);
        return recentMonths.includes(monthData);
      }
      if (timeFilter === "30days") {
        const recentMonths = data.monthlyStats.slice(-4);
        return recentMonths.includes(monthData);
      }
      return true;
    });
  }, [data?.monthlyStats, timeFilter]);

  // Pagination calculations
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const indexOfLastDoc = docPage * itemsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - itemsPerPage;
  const currentDocs = filteredDocs.slice(indexOfFirstDoc, indexOfLastDoc);
  const totalDocPages = Math.ceil(filteredDocs.length / itemsPerPage);

  // Export CSV with loading state
  const exportCSV = async () => {
    try {
      setIsExporting(true);
      const headers = ["Tiêu đề,Danh mục,Lượt tải xuống,Lượt xem"];
      const rows =
        data?.topDocuments.map(
          (doc: TopDocument) =>
            `${doc.title},${doc.category},${doc.downloads},${doc.views}`
        ) || [];
      const userHeaders = [
        "Người dùng,Email,Vai trò,Lượt tải lên,Lượt tải xuống",
      ];
      const userRows =
        data?.newUsers.map(
          (user: User) =>
            `${user.name},${user.email},${user.role},${user.uploads},${user.downloads}`
        ) || [];
      const csvContent = [
        ...headers,
        ...rows,
        "", // Dòng trống để phân tách
        ...userHeaders,
        ...userRows,
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "bao_cao_tai_lieu_va_nguoi_dung.csv");
      toast.success("Đã xuất báo cáo thành công!");
    } catch {
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">Failed to load data. Please try again.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const {
    categoryData = [],
    fileTypeData = [],
    users = [],
    pendingDocuments = 0,
    totalDownloads = 0,
    totalViews = 0,
  } = data || {};

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Toaster />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thống kê</h1>
          <p className="text-muted-foreground">
            Quản lý dữ liệu tài liệu học tập
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={exportCSV} disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {isExporting ? "Đang xuất..." : "Xuất báo cáo"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Xuất báo cáo dưới dạng CSV</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Thẻ thống kê tổng quan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          title="Tổng tài liệu"
          value={(categoryData || []).reduce(
            (sum: number, cat: { documents: number | string }) =>
              sum + Number(cat.documents),
            0
          )}
        />
        <StatCard title="Lượt tải xuống" value={totalDownloads} />
        <StatCard title="Lượt xem" value={totalViews} />
        <StatCard title="Người dùng" value={users.length || 0} />
        <StatCard title="Tài liệu chờ duyệt" value={pendingDocuments} />
      </div>

      {/* BarChart */}
      <Card>
        <CardHeader>
          <CardTitle>Tài liệu theo danh mục</CardTitle>
          <CardDescription>Số lượng tài liệu theo ngành học</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <BarChartComponent
              data={categoryData.map((cat) => ({
                category: cat.category.name,
                documents: Number(cat.documents),
              }))}
            />
          ) : (
            <p className="text-muted-foreground text-center">
              Không có dữ liệu
            </p>
          )}
        </CardContent>
      </Card>

      {/* AreaChart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lượt tải xuống và xem</CardTitle>
              <CardDescription>Thống kê trong 6 tháng qua</CardDescription>
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 ngày qua</SelectItem>
                <SelectItem value="30days">30 ngày qua</SelectItem>
                <SelectItem value="all">Tất cả</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocumentData.length > 0 ? (
            <AreaChartComponent
              data={filteredDocumentData.map((doc) => ({
                month: doc.month,
                downloads: doc.downloads,
                views: doc.views,
              }))}
            />
          ) : (
            <p className="text-muted-foreground text-center">
              Không có dữ liệu
            </p>
          )}
        </CardContent>
      </Card>

      {/* PieChart */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bố loại file</CardTitle>
          <CardDescription>Số lượng tài liệu theo định dạng</CardDescription>
        </CardHeader>
        <CardContent>
          {fileTypeData.length > 0 ? (
            <PieChartComponent data={fileTypeData} />
          ) : (
            <p className="text-muted-foreground text-center">
              Không có dữ liệu
            </p>
          )}
        </CardContent>
      </Card>

      {/* Top tài liệu */}
      <Card>
        <CardHeader className="px-6 pt-0">
          <div className="flex items-center justify-between">
            <CardTitle>Top tài liệu phổ biến</CardTitle>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Tìm kiếm tài liệu..."
                className="h-9"
                type="search"
                value={docSearchTerm}
                onChange={(e) => {
                  setDocSearchTerm(e.target.value);
                  setDocPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {currentDocs.length > 0 ? (
            <TopDocumentsTable documents={currentDocs} />
          ) : (
            <p className="text-muted-foreground text-center">
              Không có tài liệu
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between px-6 py-4">
          <div className="text-muted-foreground text-xs">
            Hiển thị <strong>{currentDocs.length}</strong> /{" "}
            <strong>{filteredDocs.length}</strong> tài liệu
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={docPage === 1}
              onClick={() => setDocPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={docPage === totalDocPages}
              onClick={() => setDocPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Người dùng */}
      <Card>
        <CardHeader className="px-6 pt-0">
          <div className="flex items-center justify-between">
            <CardTitle>Người dùng mới</CardTitle>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Tìm kiếm người dùng..."
                className="h-9"
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {currentUsers.length > 0 ? (
            <UsersTable users={currentUsers} />
          ) : (
            <p className="text-muted-foreground text-center">
              Không có người dùng
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between px-6 py-4">
          <div className="text-muted-foreground text-xs">
            Hiển thị <strong>{currentUsers.length}</strong> /{" "}
            <strong>{filteredUsers.length}</strong> người dùng
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalUserPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
