"use client";

import { Check, Plus, Search, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  emailVerified: boolean;
  image?: string;
  role?: string;
  banned: boolean;
  banReason?: string;
  banExpires?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface UpdateUser {
  name: string;
  email: string;
  role?: string;
  banned: boolean;
  banReason?: string;
  banExpires?: string | Date;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface SortConfig {
  sortBy: "name" | "email" | "role" | "createdAt";
  sortOrder: "asc" | "desc";
}

// Add proper date conversion
const convertDates = (user: User): User => {
  return {
    ...user,
    banExpires: user.banExpires ? new Date(user.banExpires) : undefined,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  };
};

// Improve error handling
const handleApiError = (error: unknown) => {
  console.error("API Error:", error);
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  // TODO: Replace with proper notification system
  alert(message);
};

export default function UsersPage() {
  // States
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    banned: false,
    emailVerified: false,
    role: "User",
  });

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch users with pagination and sorting
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user?page=${pagination.page}&pageSize=${pagination.pageSize}&sortBy=${sortConfig.sortBy}&sortOrder=${sortConfig.sortOrder}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data.map(convertDates));
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const searchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/search?q=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Search failed");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to search users:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Search failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      fetchUsers();
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await searchUsers();
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Handle sorting
  const handleSort = (column: SortConfig["sortBy"]) => {
    setSortConfig((prev) => ({
      sortBy: column,
      sortOrder:
        prev.sortBy === column && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  // Handle update user
  const handleUpdateUser = async (
    id: string,
    updateData: Partial<UpdateUser>
  ) => {
    try {
      // Validate required fields
      if (updateData.email && !updateData.email.includes("@")) {
        alert("Please enter a valid email address");
        return;
      }

      // console.log("fulldata", updateData);

      // Prepare update data with proper date handling
      const dataToUpdate = {
        name: updateData.name,
        email: updateData.email,
        role: updateData.role,
        banned: updateData.banned,
        banReason: updateData.banReason,
        banExpires: updateData.banExpires
          ? updateData.banExpires instanceof Date
            ? updateData.banExpires.toISOString()
            : new Date(updateData.banExpires).toISOString()
          : undefined,
      };

      // If banning user, ensure ban reason is provided
      if (dataToUpdate.banned && !dataToUpdate.banReason) {
        alert("Please provide a reason for banning the user");
        return;
      }

      // console.log(dataToUpdate);

      const response = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update user");
      }

      const updatedUser = await response.json();

      // Update local state with converted dates
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? convertDates(updatedUser) : user))
      );

      // Reset form state
      setShowAddForm(false);
      setIsEditing(false);
      setSelectedUser(null);
      setNewUser({
        name: "",
        email: "",
        banned: false,
        emailVerified: false,
        role: "User",
      });

      // Show success message
      alert("User updated successfully");

      // Refresh user list
      fetchUsers();
    } catch (error) {
      handleApiError(error);
    }
  };

  // Handle add/edit user
  const handleAddUser = async () => {
    try {
      if (!newUser.name || !newUser.email) {
        alert("Name and email are required");
        return;
      }

      console.log("newUser", newUser);
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newUser,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create user");
      }

      const createdUser = await response.json();
      setUsers((prev) => [...prev, createdUser]);

      setNewUser({ name: "", email: "", banned: false });
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save user. Please try again."
      );
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/user/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete user");
      }

      setUsers(users.filter((user) => user.id !== id));
      if (selectedUser?.id === id) setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete user. Please try again."
      );
    }
  };

  // Handle ban/unban user
  // const handleBanUser = async (
  //   id: string,
  //   banned: boolean,
  //   reason?: string,
  //   expiresAt?: Date
  // ) => {
  //   try {
  //     const response = await fetch(`/api/user/${id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         banned,
  //         banReason: reason,
  //         banExpires: expiresAt,
  //         updatedAt: new Date(),
  //       }),
  //     });

  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.message || "Failed to update user status");
  //     }

  //     const updatedUser = await response.json();
  //     setUsers((prev) =>
  //       prev.map((user) => (user.id === id ? updatedUser : user))
  //     );
  //     fetchUsers();
  //   } catch (error) {
  //     console.error("Failed to update user status:", error);
  //     alert(
  //       error instanceof Error
  //         ? error.message
  //         : "Failed to update user status. Please try again."
  //     );
  //   }
  // };

  // Effect for fetching users when pagination or sorting changes
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.pageSize, sortConfig]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
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

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <Button type="submit" variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Add/Edit User Form */}
      {(showAddForm || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit User" : "Add New User"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <select
                  id="role"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newUser.role || "User"}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="active"
                      name="status"
                      checked={!newUser.banned}
                      onChange={() => setNewUser({ ...newUser, banned: false })}
                      className="h-4 w-4 border-gray-300"
                    />
                    <label htmlFor="active">Active</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="banned"
                      name="status"
                      checked={newUser.banned}
                      onChange={() => setNewUser({ ...newUser, banned: true })}
                      className="h-4 w-4 border-gray-300"
                    />
                    <label htmlFor="banned">Banned</label>
                  </div>
                </div>
              </div>
              {newUser.banned && (
                <>
                  <div className="grid gap-2">
                    <label htmlFor="banReason" className="text-sm font-medium">
                      Ban Reason
                    </label>
                    <Input
                      id="banReason"
                      placeholder="Ban Reason"
                      value={newUser.banReason || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, banReason: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="banExpires" className="text-sm font-medium">
                      Ban Expires
                    </label>
                    <Input
                      id="banExpires"
                      type="datetime-local"
                      value={
                        newUser.banExpires
                          ? new Date(newUser.banExpires)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          banExpires: e.target.value
                            ? new Date(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              onClick={() =>
                isEditing
                  ? handleUpdateUser(selectedUser?.id || "", newUser)
                  : handleAddUser()
              }
            >
              {isEditing ? "Update" : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setIsEditing(false);
                setSelectedUser(null);
                setNewUser({
                  name: "",
                  email: "",
                  banned: false,
                  emailVerified: false,
                  role: "User",
                });
              }}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Name</p>
                <p className="text-muted-foreground text-sm">
                  {selectedUser.name}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground text-sm">
                  {selectedUser.email}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Role</p>
                <p className="text-muted-foreground text-sm">
                  {selectedUser.role}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <Badge
                  variant={selectedUser.banned ? "destructive" : "default"}
                  className={
                    selectedUser.banned ? "bg-red-500" : "bg-green-500"
                  }
                >
                  {selectedUser.banned ? "Banned" : "Active"}
                </Badge>
              </div>
              {selectedUser.banned && (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Ban Reason</p>
                    <p className="text-muted-foreground text-sm">
                      {selectedUser.banReason}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Ban Expires</p>
                    <p className="text-muted-foreground text-sm">
                      {selectedUser.banExpires
                        ? new Date(selectedUser.banExpires).toLocaleDateString()
                        : "Permanent"}
                    </p>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium">Created At</p>
                <p className="text-muted-foreground text-sm">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Users Table */}
      <Card>
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortConfig.sortBy === "name" &&
                    (sortConfig.sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email{" "}
                  {sortConfig.sortBy === "email" &&
                    (sortConfig.sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Role{" "}
                  {sortConfig.sortBy === "role" &&
                    (sortConfig.sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Created{" "}
                  {sortConfig.sortBy === "createdAt" &&
                    (sortConfig.sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.banned ? "destructive" : "default"}
                      className={
                        user.banned
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }
                    >
                      {user.banned ? (
                        <>
                          <X className="mr-1 h-3 w-3" />
                          Banned
                        </>
                      ) : (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          Active
                        </>
                      )}
                    </Badge>
                    {user.banned && user.banReason && (
                      <div className="mt-1 text-xs text-gray-500">
                        Reason: {user.banReason}
                        {user.banExpires && (
                          <div>
                            Expires:{" "}
                            {new Date(user.banExpires).toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedUser(user)}
                      >
                        Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // setSelectedUser(user);
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
            Showing <strong>{users.length}</strong> of{" "}
            <strong>{pagination.total}</strong> users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <span className="px-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
