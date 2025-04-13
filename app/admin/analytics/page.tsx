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
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { TopDocument, User } from "./types";

async function fetchAnalyticsData() {
  const response = await fetch("/api/analytics");
  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }
  return response.json();
}

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analyticsData"],
    queryFn: fetchAnalyticsData,
    // onError: () => toast.error("Failed to load analytics data"),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [docSearchTerm, setDocSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [docPage, setDocPage] = useState(1);
  const itemsPerPage = 5;

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

  const {
    categoryData,
    monthlyStats,
    fileTypeData,
    topDocuments,
    users,
    newUsers,
    pendingDocuments,
    totalDownloads,
    totalViews,
  } = data;

  // Logic tìm kiếm và phân trang người dùng
  const filteredUsers = newUsers.filter(
    (user: User) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Logic tìm kiếm và phân trang tài liệu
  const filteredDocs = topDocuments.filter((doc: TopDocument) =>
    doc.title.toLowerCase().includes(docSearchTerm.toLowerCase())
  );
  const indexOfLastDoc = docPage * itemsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - itemsPerPage;
  const currentDocs = filteredDocs.slice(indexOfFirstDoc, indexOfLastDoc);
  const totalDocPages = Math.ceil(filteredDocs.length / itemsPerPage);

  // Logic lọc theo thời gian
  const filteredDocumentData = monthlyStats.filter((data: Document) => {
    if (timeFilter === "7days") {
      const recentMonths = monthlyStats.slice(-2);
      return recentMonths.includes(data);
    }
    if (timeFilter === "30days") {
      const recentMonths = monthlyStats.slice(-4);
      return recentMonths.includes(data);
    }
    return true;
  });

  // Xuất báo cáo CSV
  const exportCSV = () => {
    const headers = ["Tiêu đề,Danh mục,Lượt tải xuống,Lượt xem"];
    const rows = topDocuments.map(
      (doc: TopDocument) => `${doc.title},${doc.category},${doc.downloads},${doc.views}`
    );
    const userHeaders = [
      "Người dùng,Email,Vai trò,Lượt tải lên,Lượt tải xuống",
    ];
    const userRows = newUsers.map(
      (user: User) =>
        `${user.name},${user.email},${user.role},${user.uploads},${user.downloads}`
    );
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
  };

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
        <Button onClick={exportCSV}>
          <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
        </Button>
      </div>

      {/* Thẻ thống kê tổng quan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          title="Tổng tài liệu"
          value={(categoryData || []).reduce((sum: number, cat: { documents: number | string }) => sum + Number(cat.documents), 0)}      />
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
            <BarChartComponent data={categoryData} />
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
            <AreaChartComponent data={filteredDocumentData} />
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
