import { toast } from "sonner";
import useObjectState from "@/shared/hooks/useObjectState";
import { useAppMutation } from "@/shared/lib/query/query-hooks";
import { devicesAPI, devicesKeys } from "../api/devices.api";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import InputGroup from "@/shared/components/ui/input/InputGroup";

const DeviceForm = ({ device, close }) => {
  const isEdit = !!device;

  const { type, label, keywordsText, order, setField } = useObjectState({
    type: device?.type || "",
    label: device?.label || "",
    keywordsText: device?.keywords?.join("\n") || "",
    order: device?.order ?? 0,
  });

  const createMutation = useAppMutation({
    mutationFn: (data) => devicesAPI.create(data),
    invalidateKeys: [devicesKeys.lists()],
    onSuccess: () => {
      toast.success("Qurilma turi qo'shildi");
      close();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Xato yuz berdi"),
  });

  const updateMutation = useAppMutation({
    mutationFn: (data) => devicesAPI.update(device._id, data),
    invalidateKeys: [devicesKeys.lists()],
    onSuccess: () => {
      toast.success("Qurilma turi yangilandi");
      close();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Xato yuz berdi"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const keywords = keywordsText
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean);

    if (!type.trim() || !label.trim() || keywords.length === 0) {
      return toast.error("Barcha maydonlarni to'ldiring");
    }

    const data = {
      type: type.trim().toLowerCase(),
      label: label.trim(),
      keywords,
      order: parseInt(order) || 0,
    };

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
        label="Tur (slug)"
        placeholder="iphone"
        value={type}
        disabled={isEdit}
        onChange={(e) => setField("type", e.target.value.trim().toLowerCase())}
      />
      <InputField
        required
        label="Nomi"
        placeholder="iPhone"
        value={label}
        onChange={(e) => setField("label", e.target.value)}
      />
      <InputField
        required
        label="Tartib raqami"
        type="number"
        placeholder="0"
        value={order}
        onChange={(e) => setField("order", e.target.value)}
      />
      <InputField
        type="textarea"
        label="Kalit so'zlar (har bir qatorda bitta)"
        value={keywordsText}
        onChange={(e) => setField("keywordsText", e.target.value)}
        rows={8}
        placeholder={"iphone 16 pro max\niphone 16 pro\niphone\nайфон"}
        description={`${keywordsText.split("\n").filter((k) => k.trim()).length} ta kalit so'z`}
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

export default DeviceForm;
