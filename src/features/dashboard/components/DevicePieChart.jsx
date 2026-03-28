import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "@/shared/components/ui/Card";

const COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#84cc16", "#6366f1",
];

const DevicePieChart = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <Card title="Qurilma turlari">
        <p className="text-gray-400 text-sm mt-4">Ma'lumot mavjud emas</p>
      </Card>
    );
  }

  return (
    <Card title="Qurilma turlari">
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              dataKey="count"
              nameKey="type"
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value, name) => [value, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-2">
        {data.map((item, index) => (
          <div key={item.type} className="flex items-center gap-1.5 text-xs">
            <div
              className="size-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-gray-600">
              {item.type} ({item.count})
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DevicePieChart;
