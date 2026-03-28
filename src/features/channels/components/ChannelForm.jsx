import { toast } from "sonner";
import useObjectState from "@/shared/hooks/useObjectState";
import { useAppMutation } from "@/shared/lib/query/query-hooks";
import { channelsAPI, channelsKeys } from "../api/channels.api";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import InputGroup from "@/shared/components/ui/input/InputGroup";

const ChannelForm = ({ channel, close }) => {
  const isEdit = !!channel;

  const { username, label, setField } = useObjectState({
    username: channel?.username || "",
    label: channel?.label || "",
  });

  const createMutation = useAppMutation({
    mutationFn: (data) => channelsAPI.create(data),
    invalidateKeys: [channelsKeys.lists()],
    onSuccess: () => {
      toast.success("Kanal qo'shildi");
      close();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Xato yuz berdi"),
  });

  const updateMutation = useAppMutation({
    mutationFn: (data) => channelsAPI.update(channel._id, data),
    invalidateKeys: [channelsKeys.lists()],
    onSuccess: () => {
      toast.success("Kanal yangilandi");
      close();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Xato yuz berdi"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { username: username.trim(), label: label.trim() };

    if (!data.username || !data.label) {
      return toast.error("Barcha maydonlarni to'ldiring");
    }

    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <InputGroup as="form" onSubmit={handleSubmit} className="space-y-4">
      <InputField
        required
        label="Kanal username"
        placeholder="kanal_nomi (@ siz)"
        value={username}
        onChange={(e) => setField("username", e.target.value.trim())}
      />
      <InputField
        required
        label="Kanal nomi"
        placeholder="Telefon Bozor UZ"
        value={label}
        onChange={(e) => setField("label", e.target.value)}
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={close} className="flex-1">
          Bekor qilish
        </Button>
        <Button disabled={isPending} className="flex-1">
          {isPending ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
        </Button>
      </div>
    </InputGroup>
  );
};

export default ChannelForm;
