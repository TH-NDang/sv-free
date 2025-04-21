import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";
type FileTypeData = {
  type: string;
  count: number;
};

export function PieChartComponent({ data }: { data: FileTypeData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#2563eb"
          label
        />
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
