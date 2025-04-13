"use client";

import { Check, Plus, Search, Trash, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

// Mock data - replace with actual data fetching
const initialUsers: User[] = [
  {
    id: "usr_1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2023-11-10",
  },
  {
    id: "usr_2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "Active",
    createdAt: "2023-12-05",
  },
  {
    id: "usr_3",
    name: "Mark Johnson",
    email: "mark@example.com",
    role: "User",
    status: "Inactive",
    createdAt: "2024-01-15",
  },
  {
    id: "usr_4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "Editor",
    status: "Active",
    createdAt: "2024-02-20",
  },
  {
    id: "usr_5",
    name: "David Lee",
    email: "david@example.com",
    role: "User",
    status: "Pending",
    createdAt: "2024-03-01",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddUser = () => {
    if (isEditing && selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...selectedUser, ...newUser } : user
        )
      );
      setIsEditing(false);
      setSelectedUser(null);
    } else {
      const newId = `usr_${Date.now()}`;
      const createdAt = new Date().toISOString().split("T")[0];
      setUsers([
        ...users,
        {
          ...newUser,
          id: newId,
          status: newUser.status || "Pending",
          role: "User",
          createdAt,
        } as User,
      ]);
    }
    setNewUser({ name: "", email: "" });
    setShowAddForm(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
    if (selectedUser?.id === id) setSelectedUser(null);
  };
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {(showAddForm || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit User" : "Add New User"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <Select
              value={newUser.status}
              onValueChange={(value) =>
                setNewUser({ ...newUser, status: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button onClick={handleAddUser}>Save</Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setIsEditing(false);
                setSelectedUser(null);
                setNewUser({ name: "", email: "" });
              }}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader className="px-6 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Search users..."
                className="h-9"
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset về trang 1 khi tìm kiếm
                }}
              />
              <Button size="sm" variant="ghost" className="h-9 px-2">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Active"
                          ? "default"
                          : user.status === "Inactive"
                            ? "destructive"
                            : "secondary"
                      }
                      className={
                        user.status === "Active"
                          ? "gap-1 bg-green-500 hover:bg-green-600"
                          : user.status === "Inactive"
                            ? "gap-1 bg-red-500 hover:bg-red-600"
                            : user.status === "Suspended"
                              ? "gap-1 bg-yellow-500 text-black hover:bg-yellow-600"
                              : "gap-1"
                      }
                    >
                      {user.status === "Active" && (
                        <Check className="h-3 w-3" />
                      )}
                      {user.status === "Inactive" && <X className="h-3 w-3" />}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user);
                          setNewUser(user);
                          setIsEditing(true);
                          setShowAddForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-6 py-4">
          <div className="text-muted-foreground text-xs">
            Showing <strong>{paginatedUsers.length}</strong> of{" "}
            <strong>{filteredUsers.length}</strong> users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Chi tiết người dùng */}
      {selectedUser && (
        <Card className="border-primary shadow-lg">
          <CardHeader>
            <CardTitle>User Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Name:</strong> {selectedUser?.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser?.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser?.role}
            </p>
            <p>
              <strong>Status:</strong> {selectedUser?.status}
            </p>
            <p>
              <strong>Created At:</strong> {selectedUser?.createdAt}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Close
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
