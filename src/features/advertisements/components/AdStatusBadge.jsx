import { cn } from "@/shared/utils/cn";

const statusStyles = {
  sent: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  skipped: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  pending: "bg-gray-100 text-gray-600",
};

const statusLabels = {
  sent: "Yuborildi",
  failed: "Xato",
  skipped: "O'tkazildi",
  processing: "Jarayonda",
  pending: "Kutilmoqda",
};

const AdStatusBadge = ({ status }) => {
  return (
    <span
      className={cn(
        "text-xs font-medium px-2 py-0.5 rounded-full",
        statusStyles[status] || statusStyles.pending
      )}
    >
      {statusLabels[status] || status}
    </span>
  );
};

export default AdStatusBadge;
