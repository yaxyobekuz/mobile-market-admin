import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "@/shared/components/ui/Card";

const AdsAreaChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    date: item.date.slice(5), // MM-DD
    messages: item.totalMessages,
    tokens: Math.round(item.totalTokensUsed / 100), // Scale down for chart
  }));

  return (
    <Card title="Kunlik e'lonlar" className="col-span-full">
      <div className="h-72 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value, name) => [
                value,
                name === "messages" ? "E'lonlar" : "Tokenlar (x100)",
              ]}
            />
            <Area
              type="monotone"
              dataKey="messages"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMessages)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AdsAreaChart;
