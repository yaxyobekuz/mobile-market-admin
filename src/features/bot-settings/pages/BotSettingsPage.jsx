import { useState } from "react";
import { toast } from "sonner";
import { Save, Gauge, Clock, Bot, Image, Type, Filter, KeyRound } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import { useAppQuery, useAppMutation } from "@/shared/lib/query/query-hooks";
import { botConfigAPI, botConfigKeys } from "../api/bot-config.api";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import InputGroup from "@/shared/components/ui/input/InputGroup";

const TABS = [
  { id: "credentials", label: "Tokenlar", icon: KeyRound },
  { id: "rate", label: "Tezlik", icon: Gauge },
  { id: "hours", label: "Ish vaqti", icon: Clock },
  { id: "openai", label: "OpenAI", icon: Bot },
  { id: "media", label: "Media", icon: Image },
  { id: "text", label: "Matn", icon: Type },
  { id: "filters", label: "Filterlar", icon: Filter },
];

const BotSettingsPage = () => {
  const { data, isLoading } = useAppQuery({
    queryKey: botConfigKeys.detail("main"),
    queryFn: () => botConfigAPI.get(),
  });

  if (isLoading) {
    return (
      <div className="p-5 flex items-center justify-center min-h-40">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <BotSettingsForm config={data?.data} />;
};

const BotSettingsForm = ({ config }) => {
  const [activeTab, setActiveTab] = useState("credentials");

  const {
    openaiApiKey,
    openaiModel,
    telegramBotToken,
    sendDelayMs,
    floodWaitMultiplier,
    maxRetries,
    dailyMessageLimit,
    albumWaitMs,
    workingHoursEnabled,
    startHour,
    endHour,
    timezone,
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
    timezone: config?.workingHours?.timezone ?? "Asia/Tashkent",
    openaiApiKey: config?.credentials?.openaiApiKey ?? "",
    openaiModel: config?.credentials?.openaiModel ?? "",
    telegramBotToken: config?.credentials?.telegramBotToken ?? "",
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
      credentials: {
        openaiApiKey,
        openaiModel,
        telegramBotToken,
      },
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
        timezone: timezone || "Asia/Tashkent",
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Bot sozlamalari</h1>
        <Button disabled={updateMutation.isPending} size="sm">
          <Save size={16} />
          {updateMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Credentials */}
      {activeTab === "credentials" && (
        <div className="space-y-4">
          <Card title="API kalitlar va tokenlar">
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Bu yerda saqlangan tokenlar bot restart qilmasdan o'zgartiriladi.
              Mavjud qiymatlar xavfsizlik uchun yashirilgan (****xxxx). O'zgartirish uchun yangi qiymat kiriting.
            </p>
            <div className="space-y-4">
              <InputField
                label="OpenAI API Key"
                type="password"
                value={openaiApiKey}
                onChange={(e) => setField("openaiApiKey", e.target.value)}
                placeholder="sk-proj-... (bo'sh qoldirsa o'zgarmaydi)"
                description="OpenAI yoki fine-tuned model uchun API kalit"
              />
              <InputField
                label="OpenAI Model"
                type="text"
                value={openaiModel}
                onChange={(e) => setField("openaiModel", e.target.value)}
                placeholder="ft:gpt-4.1-nano-... yoki gpt-4o-mini"
                description="Foydalaniladigan model nomi"
              />
              <InputField
                label="Telegram Bot Token"
                type="password"
                value={telegramBotToken}
                onChange={(e) => setField("telegramBotToken", e.target.value)}
                placeholder="123456789:AAF... (bo'sh qoldirsa o'zgarmaydi)"
                description="@BotFather dan olingan bot token"
              />
            </div>
          </Card>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            ⚠️ Token o'zgartirilgandan so'ng bot keyingi xabar yuborishdan boshlab yangi tokenni ishlatadi.
            MTProto sessiyasi (.env) hali ham o'zgartirilmaydi.
          </div>
        </div>
      )}

      {/* Tab: Rate Limiting */}
      {activeTab === "rate" && (
        <div className="space-y-4">
          <Card title="Tezlikni cheklash">
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="Yuborish kechikishi (ms)"
                type="number"
                value={sendDelayMs}
                onChange={(e) => setField("sendDelayMs", e.target.value)}
                description="Xabarlar orasidagi kutish vaqti"
              />
              <InputField
                label="Flood wait koeffitsienti"
                type="number"
                step="0.1"
                value={floodWaitMultiplier}
                onChange={(e) => setField("floodWaitMultiplier", e.target.value)}
                description="Telegram flood xatosi multiplikatori"
              />
              <InputField
                label="Maksimum urinishlar"
                type="number"
                value={maxRetries}
                onChange={(e) => setField("maxRetries", e.target.value)}
                description="Yuborishda xato bo'lganda"
              />
            </div>
          </Card>
          <Card title="Kunlik limitlar">
            <div className="mt-3 space-y-4">
              <InputField
                label="Kunlik xabar limiti (jami)"
                type="number"
                value={dailyMessageLimit}
                onChange={(e) => setField("dailyMessageLimit", e.target.value)}
              />
              <InputField
                type="textarea"
                label="Qurilma bo'yicha limitlar (har qatorda: tur:limit)"
                value={perDeviceLimitsText}
                onChange={(e) => setField("perDeviceLimitsText", e.target.value)}
                rows={8}
                placeholder={"iphone:30\nsamsung:25\nxiaomi:20\nother:10"}
                inputClassName="font-mono"
              />
            </div>
          </Card>
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
        </div>
      )}

      {/* Tab: Working Hours */}
      {activeTab === "hours" && (
        <Card title="Ish vaqti">
          <div className="mt-3 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={workingHoursEnabled}
                onChange={(e) => setField("workingHoursEnabled", e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">Ish vaqtini yoqish</span>
            </label>

            {workingHoursEnabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Boshlanish soati (0-23)"
                    type="number"
                    min={0}
                    max={23}
                    value={startHour}
                    onChange={(e) => setField("startHour", e.target.value)}
                  />
                  <InputField
                    label="Tugash soati (0-23)"
                    type="number"
                    min={0}
                    max={23}
                    value={endHour}
                    onChange={(e) => setField("endHour", e.target.value)}
                  />
                </div>

                {/* Visual timeline */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Ish vaqti vizualizatsiyasi</p>
                  <div className="flex h-6 rounded-full overflow-hidden bg-gray-100">
                    {Array.from({ length: 24 }, (_, h) => (
                      <div
                        key={h}
                        className={`flex-1 transition-colors ${
                          h >= parseInt(startHour) && h < parseInt(endHour)
                            ? "bg-emerald-400"
                            : "bg-gray-100"
                        }`}
                        title={`${h}:00`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>24:00</span>
                  </div>
                </div>

                <InputField
                  label="Vaqt mintaqasi (IANA)"
                  type="text"
                  value={timezone}
                  onChange={(e) => setField("timezone", e.target.value)}
                  placeholder="Asia/Tashkent"
                  description="Masalan: Asia/Tashkent, Europe/Berlin, UTC, America/New_York"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Tab: OpenAI */}
      {activeTab === "openai" && (
        <div className="space-y-4">
          <Card title="OpenAI sozlamalari">
            <div className="mt-3">
              <InputField
                label={`Temperature: ${openaiTemperature}`}
                type="range"
                step="0.1"
                min={0}
                max={2}
                value={openaiTemperature}
                onChange={(e) => setField("openaiTemperature", e.target.value)}
                description="0 = aniq/qat'iy, 2 = ijodiy/tasodifiy. Tavsiya: 0.3"
              />
            </div>
          </Card>
          <Card title="System prompt">
            <div className="mt-3">
              <InputField
                type="textarea"
                label="GPT ga berilgan ko'rsatma"
                value={systemPrompt}
                onChange={(e) => setField("systemPrompt", e.target.value)}
                rows={16}
                inputClassName="font-mono text-sm min-h-[300px]"
              />
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Media */}
      {activeTab === "media" && (
        <Card title="Media sozlamalari">
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Maks rasmlar soni"
              type="number"
              value={maxPhotosPerMessage}
              onChange={(e) => setField("maxPhotosPerMessage", e.target.value)}
              description="Bir xabardagi maksimum rasm"
            />
            <InputField
              label="Yuklab olish kutish (ms)"
              type="number"
              value={downloadTimeoutMs}
              onChange={(e) => setField("downloadTimeoutMs", e.target.value)}
              description="MTProto media yuklab olish limiti"
            />
            <InputField
              label="Maks fayl hajmi (MB)"
              type="number"
              value={maxFileSizeMb}
              onChange={(e) => setField("maxFileSizeMb", e.target.value)}
              description="Bot API 50MB limit bor"
            />
          </div>
        </Card>
      )}

      {/* Tab: Text */}
      {activeTab === "text" && (
        <Card title="Matn qayta ishlash">
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Minimum e'lon uzunligi (belgi)"
              type="number"
              value={minAdLength}
              onChange={(e) => setField("minAdLength", e.target.value)}
              description="Emoji va boʻshliqsiz belgilar soni"
            />
            <InputField
              label="OpenAI uchun maks belgilar"
              type="number"
              value={maxOpenAIChars}
              onChange={(e) => setField("maxOpenAIChars", e.target.value)}
              description="Uzoq matnlar qisqartiriladi"
            />
          </div>
        </Card>
      )}

      {/* Tab: Filters */}
      {activeTab === "filters" && (
        <Card title="Istisno kalit so'zlar">
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-3">
              Quyidagi so'zlarni o'z ichiga olgan xabarlar e'lon emas deb hisoblanadi (aksessuar, kabel, ko'k qutb va h.k.)
            </p>
            <InputField
              type="textarea"
              label={`Kalit so'zlar — ${excludeKeywordsText.split("\n").filter((k) => k.trim()).length} ta`}
              value={excludeKeywordsText}
              onChange={(e) => setField("excludeKeywordsText", e.target.value)}
              rows={16}
              placeholder={"chexol\ncase\nnaushnik\nearbuds\nzaryadka"}
              inputClassName="font-mono text-sm"
            />
          </div>
        </Card>
      )}

      {/* Bottom save */}
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
