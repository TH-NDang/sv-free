import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
type TopDocument = {
  id: string;
  title: string;
  category: string;
  downloads: number;
  views: number;
};

export function TopDocumentsTable({ documents }: { documents: TopDocument[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Danh mục</TableHead>
          <TableHead>Lượt tải</TableHead>
          <TableHead>Lượt xem</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-medium">{doc.title}</TableCell>
            <TableCell>{doc.category}</TableCell>
            <TableCell>{doc.downloads}</TableCell>
            <TableCell>{doc.views}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
