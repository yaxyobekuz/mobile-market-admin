import Card from "@/shared/components/ui/Card";
import { useAppQuery } from "@/shared/lib/query/query-hooks";
import { adsAPI, adsKeys } from "@/features/advertisements/api/advertisements.api";
import AdStatusBadge from "@/features/advertisements/components/AdStatusBadge";

const RecentAdsTable = () => {
  const { data } = useAppQuery({
    queryKey: adsKeys.list({ page: 1, limit: 5 }),
    queryFn: () => adsAPI.getAll({ page: 1, limit: 5 }),
  });

  const ads = data?.data?.docs || [];

  return (
    <Card title="So'nggi e'lonlar">
      <div className="mt-4 space-y-2">
        {ads.length === 0 ? (
          <p className="text-gray-400 text-sm">E'lonlar mavjud emas</p>
        ) : (
          ads.map((ad) => (
            <div
              key={ad._id}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    {ad.deviceLabel || ad.deviceType}
                  </span>
                  <AdStatusBadge status={ad.status} />
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {ad.formattedText || ad.originalText}
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(ad.createdAt).toLocaleDateString("uz")}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentAdsTable;
