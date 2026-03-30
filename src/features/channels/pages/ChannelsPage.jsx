import { useState } from "react";
import { toast } from "sonner";
import {
  Radio,
  RefreshCw,
  Target,
  Eye,
  EyeOff,
  Trash2,
  Wifi,
  WifiOff,
  Users,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { useAppQuery, useAppMutation } from "@/shared/lib/query/query-hooks";
import { channelsAPI, channelsKeys } from "../api/channels.api";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";

const ROLE_CONFIG = {
  source: {
    label: "Manba",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  target: {
    label: "Target",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  none: {
    label: "Kuzatilmaydi",
    color: "bg-gray-100 text-gray-500 border-gray-200",
    dot: "bg-gray-400",
  },
};

const TYPE_ICONS = {
  channel: "📢",
  supergroup: "👥",
  group: "💬",
  unknown: "❓",
};

const RoleDropdown = ({ channel, onSetRole, isLoading }) => {
  const [open, setOpen] = useState(false);
  const current = ROLE_CONFIG[channel.role] || ROLE_CONFIG.none;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isLoading}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${current.color} ${isLoading ? "opacity-50" : "hover:opacity-80"}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
        {current.label}
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[140px]">
            {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
              <button
                key={role}
                onClick={() => {
                  onSetRole(channel._id, role);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 transition-colors ${channel.role === role ? "bg-gray-50 font-medium" : ""}`}
              >
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ChannelsPage = () => {
  const { data, isLoading } = useAppQuery({
    queryKey: channelsKeys.lists(),
    queryFn: () => channelsAPI.getAll(),
  });

  const { data: statusData } = useAppQuery({
    queryKey: channelsKeys.detail("bot-status"),
    queryFn: () => channelsAPI.getBotStatus(),
    refetchInterval: 15000,
  });

  const syncMutation = useAppMutation({
    mutationFn: () => channelsAPI.syncFromTelegram(),
    invalidateKeys: [channelsKeys.lists()],
    onSuccess: (res) => {
      const { added, updated, total } = res.data || {};
      toast.success(`Sinxronlandi: ${total} kanal (${added} yangi, ${updated} yangilandi)`);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Bot bilan ulanishda xato. Bot ishga tushganmi?"),
  });

  const roleMutation = useAppMutation({
    mutationFn: ({ id, role }) => channelsAPI.setRole(id, role),
    invalidateKeys: [channelsKeys.lists()],
    onSuccess: () => toast.success("Kanal roli yangilandi"),
    onError: (err) => toast.error(err.response?.data?.message || "Xato yuz berdi"),
  });

  const toggleMutation = useAppMutation({
    mutationFn: ({ id, isActive }) => channelsAPI.update(id, { isActive }),
    invalidateKeys: [channelsKeys.lists()],
    onSuccess: () => toast.success("Kanal holati o'zgartirildi"),
  });

  const deleteMutation = useAppMutation({
    mutationFn: (id) => channelsAPI.delete(id),
    invalidateKeys: [channelsKeys.lists()],
    onSuccess: () => toast.success("Kanal o'chirildi"),
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all | source | target | none

  const channels = data?.data || [];
  const botStatus = statusData?.data;

  const sourceChannels = channels.filter((ch) => ch.role === "source" && ch.isActive);
  const targetChannel = channels.find((ch) => ch.role === "target");

  const ROLE_ORDER = { target: 0, source: 1, none: 2 };

  const filtered = channels
    .filter((ch) => {
      const matchSearch = search.trim()
        ? ch.label.toLowerCase().includes(search.toLowerCase()) ||
          ch.username?.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchRole = roleFilter === "all" || ch.role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      // disabled (isActive=false) har doim oxirida
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      // role bo'yicha: target → source → none
      return (ROLE_ORDER[a.role] ?? 3) - (ROLE_ORDER[b.role] ?? 3);
    });

  return (
    <div className="space-y-4 p-4 xs:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Kanallar</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {sourceChannels.length} manba · {targetChannel ? "1 target" : "Target yo'q"}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
        >
          <RefreshCw size={15} className={`mr-1.5 ${syncMutation.isPending ? "animate-spin" : ""}`} />
          {syncMutation.isPending ? "Sinxronlanmoqda..." : "Telegramdan yangilash"}
        </Button>
      </div>

      {/* Bot Status */}
      <Card className="flex items-center gap-3 py-3">
        <div className={`w-2.5 h-2.5 rounded-full ${botStatus?.connected ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {botStatus?.connected ? (
              <Wifi size={14} className="text-emerald-600" />
            ) : (
              <WifiOff size={14} className="text-red-400" />
            )}
            <span className="text-sm font-medium">
              Bot {botStatus?.connected ? "ulangan" : "o'chiq"}
            </span>
          </div>
          {botStatus?.connected && (
            <p className="text-xs text-gray-500 mt-0.5">
              {botStatus.monitoredChannels} kanal kuzatilmoqda · Navbat: {botStatus.queueSize}
            </p>
          )}
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kanal nomi yoki @username bo'yicha qidirish..."
          className="w-full pl-9 pr-9 py-2.5 text-sm bg-white rounded-xl border border-gray-200 outline-none focus:border-emerald-400 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Role Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key: "all", label: `Hammasi (${channels.length})` },
          { key: "target", label: `Target (${channels.filter(c => c.role === "target").length})`, dot: "bg-blue-500" },
          { key: "source", label: `Manba (${channels.filter(c => c.role === "source").length})`, dot: "bg-emerald-500" },
          { key: "none", label: `Kuzatilmaydi (${channels.filter(c => c.role === "none").length})`, dot: "bg-gray-400" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setRoleFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              roleFilter === f.key
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {f.dot && <span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />}
            {f.label}
          </button>
        ))}
      </div>

      {/* Channels List */}
      <Card>
        {isLoading ? (
          <div className="py-10 text-center">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Yuklanmoqda...</p>
          </div>
        ) : channels.length === 0 ? (
          <div className="py-10 text-center">
            <Radio size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm font-medium">Kanallar yo'q</p>
            <p className="text-gray-400 text-xs mt-1">
              "Telegramdan yangilash" tugmasini bosib kanallarni import qiling
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center">
            <Search size={28} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">"{search}" bo'yicha hech narsa topilmadi</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((ch) => {
              const typeIcon = TYPE_ICONS[ch.type] || "❓";
              return (
                <div
                  key={ch._id}
                  className={`flex items-center gap-3 py-3 px-1 transition-opacity ${!ch.isActive ? "opacity-50" : ""}`}
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${ch.role === "source" ? "bg-emerald-50" : ch.role === "target" ? "bg-blue-50" : "bg-gray-50"}`}>
                    {ch.role === "target" ? (
                      <Target size={16} className="text-blue-500" />
                    ) : (
                      <span>{typeIcon}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ch.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {ch.username && (
                        <span className="text-xs text-gray-400">@{ch.username}</span>
                      )}
                      {ch.participantsCount > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-gray-400">
                          <Users size={10} />
                          {ch.participantsCount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Role dropdown */}
                  <RoleDropdown
                    channel={ch}
                    onSetRole={(id, role) => roleMutation.mutate({ id, role })}
                    isLoading={roleMutation.isPending}
                  />

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleMutation.mutate({ id: ch._id, isActive: !ch.isActive })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                      title={ch.isActive ? "O'chirish" : "Yoqish"}
                    >
                      {ch.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${ch.label}" kanalni o'chirishni tasdiqlaysizmi?`)) {
                          deleteMutation.mutate(ch._id);
                        }
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Help text */}
      <p className="text-xs text-gray-400 px-1">
        💡 Kanallarni avtomatik topish uchun "Telegramdan yangilash" ni bosing.
        Har bir kanalga rol bering: <strong>Manba</strong> (kuzatiladigan), <strong>Target</strong> (e'lonlar yuboriladigan) yoki <strong>Kuzatilmaydi</strong>.
      </p>
    </div>
  );
};

export default ChannelsPage;
