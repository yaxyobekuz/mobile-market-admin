import { toast } from "sonner";
import { Save } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import { useAppQuery, useAppMutation } from "@/shared/lib/query/query-hooks";
import { botConfigAPI, botConfigKeys } from "../api/bot-config.api";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import InputGroup from "@/shared/components/ui/input/InputGroup";

const BotSettingsPage = () => {
  const { data, isLoading } = useAppQuery({
    queryKey: botConfigKeys.detail("main"),
    queryFn: () => botConfigAPI.get(),
  });

  if (isLoading) {
    return (
      <div className="p-5">
        <p className="text-gray-400">Yuklanmoqda...</p>
      </div>
    );
  }

  return <BotSettingsForm config={data?.data} />;
};

const BotSettingsForm = ({ config }) => {
  const {
    sendDelayMs,
    floodWaitMultiplier,
    maxRetries,
    dailyMessageLimit,
    albumWaitMs,
    workingHoursEnabled,
    startHour,
    endHour,
    openaiTemperature,
    systemPrompt,
    maxPhotosPerMessage,
    downloadTimeoutMs,
    maxFileSizeMb,
    minAdLength,
    maxOpenAIChars,
    excludeKeywordsText,
    perDeviceLimitsText,
    setField,
  } = useObjectState({
    sendDelayMs: config?.sendDelayMs ?? 3000,
    floodWaitMultiplier: config?.floodWaitMultiplier ?? 1.5,
    maxRetries: config?.maxRetries ?? 3,
    dailyMessageLimit: config?.dailyMessageLimit ?? 100,
    albumWaitMs: config?.albumWaitMs ?? 1500,
    workingHoursEnabled: config?.workingHours?.enabled ?? false,
    startHour: config?.workingHours?.startHour ?? 6,
    endHour: config?.workingHours?.endHour ?? 23,
    openaiTemperature: config?.openai?.temperature ?? 0.3,
    systemPrompt: config?.openai?.systemPrompt ?? "",
    maxPhotosPerMessage: config?.media?.maxPhotosPerMessage ?? 10,
    downloadTimeoutMs: config?.media?.downloadTimeoutMs ?? 30000,
    maxFileSizeMb: config?.media?.maxFileSizeMb ?? 50,
    minAdLength: config?.text?.minAdLength ?? 15,
    maxOpenAIChars: config?.text?.maxOpenAIChars ?? 2000,
    excludeKeywordsText: config?.excludeKeywords?.join("\n") ?? "",
    perDeviceLimitsText: config?.perDeviceDailyLimits
      ? Object.entries(
          typeof config.perDeviceDailyLimits === "object"
            ? config.perDeviceDailyLimits
            : {}
        )
          .map(([k, v]) => `${k}:${v}`)
          .join("\n")
      : "",
  });

  const updateMutation = useAppMutation({
    mutationFn: (data) => botConfigAPI.update(data),
    invalidateKeys: [botConfigKeys.lists()],
    onSuccess: () => toast.success("Sozlamalar saqlandi"),
    onError: (err) => toast.error(err.response?.data?.message || "Xato yuz berdi"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const excludeKeywords = excludeKeywordsText
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean);

    const perDeviceDailyLimits = {};
    perDeviceLimitsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((line) => {
        const [key, val] = line.split(":");
        if (key && val) {
          perDeviceDailyLimits[key.trim()] = parseInt(val.trim()) || 0;
        }
      });

    updateMutation.mutate({
      sendDelayMs: parseInt(sendDelayMs) || 3000,
      floodWaitMultiplier: parseFloat(floodWaitMultiplier) || 1.5,
      maxRetries: parseInt(maxRetries) || 3,
      dailyMessageLimit: parseInt(dailyMessageLimit) || 100,
      albumWaitMs: parseInt(albumWaitMs) || 1500,
      perDeviceDailyLimits,
      workingHours: {
        enabled: workingHoursEnabled,
        startHour: parseInt(startHour) || 6,
        endHour: parseInt(endHour) || 23,
      },
      openai: {
        temperature: parseFloat(openaiTemperature) || 0.3,
        systemPrompt,
      },
      media: {
        maxPhotosPerMessage: parseInt(maxPhotosPerMessage) || 10,
        downloadTimeoutMs: parseInt(downloadTimeoutMs) || 30000,
        maxFileSizeMb: parseInt(maxFileSizeMb) || 50,
      },
      text: {
        minAdLength: parseInt(minAdLength) || 15,
        maxOpenAIChars: parseInt(maxOpenAIChars) || 2000,
      },
      excludeKeywords,
    });
  };

  return (
    <InputGroup as="form" onSubmit={handleSubmit} className="space-y-4 p-4 xs:p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Bot sozlamalari</h1>
        <Button disabled={updateMutation.isPending} size="sm">
          <Save size={16} />
          {updateMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>

      {/* Rate Limiting */}
      <Card title="Tezlikni cheklash">
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Yuborish kechikishi (ms)"
            type="number"
            value={sendDelayMs}
            onChange={(e) => setField("sendDelayMs", e.target.value)}
          />
          <InputField
            label="Flood wait koeffitsienti"
            type="number"
            step="0.1"
            value={floodWaitMultiplier}
            onChange={(e) => setField("floodWaitMultiplier", e.target.value)}
          />
          <InputField
            label="Maksimum urinishlar"
            type="number"
            value={maxRetries}
            onChange={(e) => setField("maxRetries", e.target.value)}
          />
        </div>
      </Card>

      {/* Daily Limits */}
      <Card title="Kunlik limitlar">
        <div className="mt-3 space-y-4">
          <InputField
            label="Kunlik xabar limiti"
            type="number"
            value={dailyMessageLimit}
            onChange={(e) => setField("dailyMessageLimit", e.target.value)}
          />
          <InputField
            type="textarea"
            label="Qurilma limitlari (har qatorda: tur:limit)"
            value={perDeviceLimitsText}
            onChange={(e) => setField("perDeviceLimitsText", e.target.value)}
            rows={6}
            placeholder={"iphone:30\nsamsung:25\nxiaomi:20"}
          />
        </div>
      </Card>

      {/* Working Hours */}
      <Card title="Ish vaqti">
        <div className="mt-3 space-y-4">
          <InputField
            type="checkbox"
            label="Ish vaqtini yoqish"
            checked={workingHoursEnabled}
            onChange={(e) => setField("workingHoursEnabled", e.target.checked)}
          />
          {workingHoursEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Boshlanish soati"
                type="number"
                min={0}
                max={23}
                value={startHour}
                onChange={(e) => setField("startHour", e.target.value)}
              />
              <InputField
                label="Tugash soati"
                type="number"
                min={0}
                max={23}
                value={endHour}
                onChange={(e) => setField("endHour", e.target.value)}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Album */}
      <Card title="Albom">
        <div className="mt-3">
          <InputField
            label="Albom kutish vaqti (ms)"
            type="number"
            value={albumWaitMs}
            onChange={(e) => setField("albumWaitMs", e.target.value)}
            description="Guruhli rasmlarni yig'ish uchun kutish vaqti"
          />
        </div>
      </Card>

      {/* OpenAI */}
      <Card title="OpenAI">
        <div className="mt-3 space-y-4">
          <InputField
            label="Temperature"
            type="number"
            step="0.1"
            min={0}
            max={2}
            value={openaiTemperature}
            onChange={(e) => setField("openaiTemperature", e.target.value)}
          />
          <InputField
            type="textarea"
            label="System prompt"
            value={systemPrompt}
            onChange={(e) => setField("systemPrompt", e.target.value)}
            rows={12}
            inputClassName="font-mono min-h-[200px]"
          />
        </div>
      </Card>

      {/* Media */}
      <Card title="Media">
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Maks rasmlar soni"
            type="number"
            value={maxPhotosPerMessage}
            onChange={(e) => setField("maxPhotosPerMessage", e.target.value)}
          />
          <InputField
            label="Yuklab olish kutish (ms)"
            type="number"
            value={downloadTimeoutMs}
            onChange={(e) => setField("downloadTimeoutMs", e.target.value)}
          />
          <InputField
            label="Maks fayl hajmi (MB)"
            type="number"
            value={maxFileSizeMb}
            onChange={(e) => setField("maxFileSizeMb", e.target.value)}
          />
        </div>
      </Card>

      {/* Text Processing */}
      <Card title="Matn qayta ishlash">
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Minimum e'lon uzunligi"
            type="number"
            value={minAdLength}
            onChange={(e) => setField("minAdLength", e.target.value)}
          />
          <InputField
            label="Maks OpenAI belgilar"
            type="number"
            value={maxOpenAIChars}
            onChange={(e) => setField("maxOpenAIChars", e.target.value)}
          />
        </div>
      </Card>

      {/* Exclude Keywords */}
      <Card title="Istisno kalit so'zlar">
        <div className="mt-3">
          <InputField
            type="textarea"
            label="Kalit so'zlar (har bir qatorda bitta)"
            value={excludeKeywordsText}
            onChange={(e) => setField("excludeKeywordsText", e.target.value)}
            rows={8}
            placeholder={"chexol\ncase\nnaushnik\nearbuds"}
            description={`${excludeKeywordsText.split("\n").filter((k) => k.trim()).length} ta istisno kalit so'z. Aksessuar e'lonlarini filtrlash uchun ishlatiladi.`}
          />
        </div>
      </Card>

      {/* Bottom save button */}
      <div className="flex justify-end pt-2">
        <Button disabled={updateMutation.isPending}>
          <Save size={16} />
          {updateMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </InputGroup>
  );
};

export default BotSettingsPage;
