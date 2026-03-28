import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const TokenUsageChart = ({ data = [] }) => {
  if (data.length === 0) {
    return <p className="text-gray-400 text-sm py-8 text-center">Ma'lumot yo'q</p>;
  }

  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("uz", { day: "2-digit", month: "2-digit" }),
    tokens: d.totalTokensUsed || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={formatted}>
        <defs>
          <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="tokens"
          name="Tokenlar"
          stroke="#8b5cf6"
          fill="url(#colorTokens)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TokenUsageChart;
