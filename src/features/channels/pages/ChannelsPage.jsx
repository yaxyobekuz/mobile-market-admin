import { toast } from "sonner";
import { Radio, Pencil, Trash2, Plus } from "lucide-react";
import { useAppQuery, useAppMutation } from "@/shared/lib/query/query-hooks";
import { channelsAPI, channelsKeys } from "../api/channels.api";
import useModal from "@/shared/hooks/useModal";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import List from "@/shared/components/ui/List";
import ModalWrapper from "@/shared/components/ui/ModalWrapper";
import ChannelForm from "../components/ChannelForm";

const MODAL_NAME = "channelForm";

const ChannelsPage = () => {
  const { openModal } = useModal(MODAL_NAME);

  const { data, isLoading } = useAppQuery({
    queryKey: channelsKeys.lists(),
    queryFn: () => channelsAPI.getAll(),
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

  const channels = data?.data || [];

  const handleOpenForm = (channel = null) => {
    openModal(MODAL_NAME, { channel });
  };

  const items = channels.map((ch) => ({
    key: ch._id,
    title: ch.label,
    description: `@${ch.username}`,
    icon: Radio,
    gradientFrom: ch.isActive ? "from-emerald-400" : "from-gray-300",
    gradientTo: ch.isActive ? "to-emerald-600" : "to-gray-400",
    trailing: (
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant={ch.isActive ? "outline" : "ghost"}
          onClick={(e) => {
            e.stopPropagation();
            toggleMutation.mutate({ id: ch._id, isActive: !ch.isActive });
          }}
        >
          {ch.isActive ? "Faol" : "Nofaol"}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenForm(ch);
          }}
        >
          <Pencil size={15} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`"${ch.label}" kanalni o'chirishni tasdiqlaysizmi?`)) {
              deleteMutation.mutate(ch._id);
            }
          }}
        >
          <Trash2 size={15} />
        </Button>
      </div>
    ),
  }));

  return (
    <div className="space-y-4 p-4 xs:p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Kanallar</h1>
        <Button onClick={() => handleOpenForm()} size="sm">
          <Plus size={16} className="mr-1.5" />
          Kanal qo'shish
        </Button>
      </div>

      <p className="text-sm text-amber-600 bg-amber-50 rounded-xl p-3">
        Kanal o'zgartirish botni qayta ishga tushirishni talab qiladi
      </p>

      <Card>
        {isLoading ? (
          <p className="text-gray-400 text-sm py-8 text-center">Yuklanmoqda...</p>
        ) : channels.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">Kanallar yo'q</p>
        ) : (
          <List items={items} />
        )}
      </Card>

      <ModalWrapper name={MODAL_NAME} title="Kanal">
        <ChannelForm />
      </ModalWrapper>
    </div>
  );
};

export default ChannelsPage;
