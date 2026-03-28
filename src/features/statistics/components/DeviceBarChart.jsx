import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16",
];

const DeviceBarChart = ({ data = [] }) => {
  if (data.length === 0) {
    return <p className="text-gray-400 text-sm py-8 text-center">Ma'lumot yo'q</p>;
  }

  const formatted = data.map((d, i) => ({
    name: d.label || d._id,
    sent: d.sent || 0,
    failed: d.failed || 0,
    total: d.total || 0,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="sent" name="Yuborilgan" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="failed" name="Xato" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DeviceBarChart;
