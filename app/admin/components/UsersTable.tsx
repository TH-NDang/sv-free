import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { User } from "../analytics/types";

export function UsersTable({ users }: { users: User[] }) {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>Tải lên</TableHead>
          <TableHead>Tải xuống</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead >Ngày tạo</TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.uploads}</TableCell>
            <TableCell>{user.downloads}</TableCell>
            <TableCell>
              <StatusBadge status={user.status} />
            </TableCell>
            <TableCell>{user.createdAt}</TableCell>
            
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}