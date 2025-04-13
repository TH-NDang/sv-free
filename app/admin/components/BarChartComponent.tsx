import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  type CategoryData = {
    category: string;
    documents: number;
  };
  
  export function BarChartComponent({ data }: { data: CategoryData[] }) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 10)}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="documents" fill="#2563eb" radius={8} />
        </BarChart>
      </ResponsiveContainer>
    );
  }