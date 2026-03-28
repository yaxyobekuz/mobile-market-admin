import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppQuery } from "@/shared/lib/query/query-hooks";
import { adsAPI, adsKeys } from "../api/advertisements.api";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import AdStatusBadge from "../components/AdStatusBadge";

const AdvertisementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useAppQuery({
    queryKey: adsKeys.detail(id),
    queryFn: () => adsAPI.getById(id),
  });

  const ad = data?.data;

  if (isLoading) {
    return (
      <div className="p-5">
        <p className="text-gray-400">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="p-5">
        <p className="text-gray-400">E'lon topilmadi</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 xs:p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/advertisements")}
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-xl font-bold">E'lon tafsilotlari</h1>
      </div>

      {/* Status & Device */}
      <Card>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
            {ad.deviceLabel || ad.deviceType}
          </span>
          <AdStatusBadge status={ad.status} />
          <span className="text-sm text-gray-400">
            Kalit so'z: "{ad.matchedKeyword}"
          </span>
        </div>
      </Card>

      {/* Texts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Asl matn">
          <pre className="mt-3 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {ad.originalText}
          </pre>
        </Card>
        <Card title="Formatlangan matn">
          <pre className="mt-3 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {ad.formattedText || "—"}
          </pre>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Source */}
        <Card title="Manba">
          <div className="mt-3 space-y-2 text-sm">
            <InfoRow label="Kanal" value={ad.sourceChannelName || "—"} />
            <InfoRow label="Kanal ID" value={ad.sourceChannelId} />
            <InfoRow label="Xabar ID" value={ad.sourceMessageId} />
            <InfoRow
              label="Sana"
              value={ad.sourceDate ? new Date(ad.sourceDate).toLocaleString("uz") : "—"}
            />
          </div>
        </Card>

        {/* Media */}
        <Card title="Media">
          <div className="mt-3 space-y-2 text-sm">
            <InfoRow label="Turi" value={ad.mediaType === "album" ? "Albom" : "Rasm"} />
            <InfoRow label="Soni" value={ad.mediaCount} />
            <InfoRow label="Target xabar ID" value={ad.targetMessageId || "—"} />
          </div>
        </Card>

        {/* OpenAI */}
        <Card title="OpenAI">
          <div className="mt-3 space-y-2 text-sm">
            <InfoRow label="Model" value={ad.openaiModel || "—"} />
            <InfoRow label="Prompt tokens" value={ad.openaiTokensUsed?.prompt || 0} />
            <InfoRow label="Completion tokens" value={ad.openaiTokensUsed?.completion || 0} />
            <InfoRow label="Jami tokens" value={ad.openaiTokensUsed?.total || 0} />
          </div>
        </Card>
      </div>

      {/* Timestamps */}
      <Card title="Vaqtlar">
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <InfoRow label="Yaratilgan" value={new Date(ad.createdAt).toLocaleString("uz")} />
          <InfoRow label="Qayta ishlangan" value={ad.processedAt ? new Date(ad.processedAt).toLocaleString("uz") : "—"} />
          <InfoRow label="Yuborilgan" value={ad.sentAt ? new Date(ad.sentAt).toLocaleString("uz") : "—"} />
          {ad.errorMessage && <InfoRow label="Xato" value={ad.errorMessage} />}
        </div>
      </Card>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-gray-400 text-xs">{label}</p>
    <p className="text-gray-700 font-medium">{value}</p>
  </div>
);

export default AdvertisementDetailPage;
