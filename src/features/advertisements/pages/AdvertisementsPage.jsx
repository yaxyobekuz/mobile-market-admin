import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useAppQuery, useAppMutation } from "@/shared/lib/query/query-hooks";
import useObjectState from "@/shared/hooks/useObjectState";
import { adsAPI, adsKeys } from "../api/advertisements.api";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Pagination from "@/shared/components/ui/Pagination";
import AdStatusBadge from "../components/AdStatusBadge";

const STATUS_OPTIONS = [
  { value: "all", label: "Hammasi" },
  { value: "sent", label: "Yuborildi" },
  { value: "failed", label: "Xato" },
  { value: "skipped", label: "O'tkazildi" },
  { value: "processing", label: "Jarayonda" },
];

const DEVICE_OPTIONS = [
  { value: "all", label: "Hammasi" },
  { value: "iphone", label: "iPhone" },
  { value: "samsung", label: "Samsung" },
  { value: "xiaomi", label: "Xiaomi" },
  { value: "huawei", label: "Huawei" },
  { value: "google", label: "Google Pixel" },
  { value: "oneplus", label: "OnePlus" },
  { value: "realme", label: "Realme" },
  { value: "oppo", label: "OPPO" },
  { value: "vivo", label: "Vivo" },
  { value: "tecno", label: "Tecno" },
];

const AdvertisementsPage = () => {
  const navigate = useNavigate();

  const { page, limit, status, deviceType, search, setField } = useObjectState({
    page: 1,
    limit: 20,
    status: "all",
    deviceType: "all",
    search: "",
  });

  const params = { page, limit };
  if (status && status !== "all") params.status = status;
  if (deviceType && deviceType !== "all") params.deviceType = deviceType;
  if (search) params.search = search;

  const { data, isLoading } = useAppQuery({
    queryKey: adsKeys.list(params),
    queryFn: () => adsAPI.getAll(params),
    keepPreviousData: true,
  });

  const deleteMutation = useAppMutation({
    mutationFn: (id) => adsAPI.delete(id),
    invalidateKeys: [adsKeys.lists()],
    onSuccess: () => toast.success("E'lon o'chirildi"),
  });

  const result = data?.data;
  const ads = result?.docs || [];

  return (
    <div className="space-y-4 p-4 xs:p-5">
      <h1 className="text-xl font-bold">E'lonlar</h1>

      {/* Filters */}
      <Card className="flex flex-wrap gap-3 items-end">
        <div className="w-full xs:w-48">
          <InputField
            label="Qidirish"
            placeholder="Matn bo'yicha..."
            value={search}
            onChange={(e) => {
              setField("search", e.target.value);
              setField("page", 1);
            }}
          />
        </div>

        <div className="w-full xs:w-36">
          <SelectField
            label="Holat"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(val) => {
              setField("status", val);
              setField("page", 1);
            }}
          />
        </div>

        <div className="w-full xs:w-36">
          <SelectField
            label="Qurilma"
            value={deviceType}
            options={DEVICE_OPTIONS}
            onChange={(val) => {
              setField("deviceType", val);
              setField("page", 1);
            }}
          />
        </div>
      </Card>

      {/* Ads List */}
      <Card>
        {isLoading ? (
          <p className="text-gray-400 text-sm py-8 text-center">Yuklanmoqda...</p>
        ) : ads.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">E'lonlar topilmadi</p>
        ) : (
          <div className="space-y-2">
            {ads.map((ad) => (
              <div
                key={ad._id}
                onClick={() => navigate(`/advertisements/${ad._id}`)}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {ad.deviceLabel || ad.deviceType}
                    </span>
                    <AdStatusBadge status={ad.status} />
                    {ad.mediaCount > 1 && (
                      <span className="text-xs text-gray-400">
                        {ad.mediaCount} rasm
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {ad.formattedText || ad.originalText}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ad.sourceChannelName} &middot;{" "}
                    {new Date(ad.createdAt).toLocaleString("uz")}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("E'lonni o'chirishni tasdiqlaysizmi?")) {
                      deleteMutation.mutate(ad._id);
                    }
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {result && result.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={result.page}
            totalPages={result.totalPages}
            hasNextPage={result.hasNextPage}
            hasPrevPage={result.hasPrevPage}
            onPageChange={(p) => setField("page", p)}
          />
        </div>
      )}
    </div>
  );
};

export default AdvertisementsPage;
