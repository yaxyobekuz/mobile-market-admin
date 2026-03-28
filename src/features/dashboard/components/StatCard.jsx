import { cn } from "@/shared/utils/cn";

const StatCard = ({ title, value, icon: Icon, gradient, subtitle }) => {
  return (
    <div className="bg-white rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        {Icon && (
          <div
            className={cn(
              "size-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
              gradient || "from-blue-400 to-blue-600"
            )}
          >
            <Icon className="size-5 text-white" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
