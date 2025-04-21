import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
type DocumentData = {
  month: string;
  downloads: number;
  views: number;
};

export function AreaChartComponent({ data }: { data: DocumentData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          dataKey="downloads"
          type="natural"
          fill="#2563eb"
          fillOpacity={0.4}
          stroke="#2563eb"
          name="Lượt tải xuống"
        />
        <Area
          dataKey="views"
          type="natural"
          fill="#10b981"
          fillOpacity={0.4}
          stroke="#10b981"
          name="Lượt xem"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
