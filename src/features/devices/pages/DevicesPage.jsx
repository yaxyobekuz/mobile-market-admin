import { toast } from "sonner";
import { Smartphone, Pencil, Trash2, Plus } from "lucide-react";
import { useAppQuery, useAppMutation } from "@/shared/lib/query/query-hooks";
import { devicesAPI, devicesKeys } from "../api/devices.api";
import useModal from "@/shared/hooks/useModal";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import List from "@/shared/components/ui/List";
import ModalWrapper from "@/shared/components/ui/ModalWrapper";
import DeviceForm from "../components/DeviceForm";

const MODAL_NAME = "deviceForm";

const DevicesPage = () => {
  const { openModal } = useModal(MODAL_NAME);

  const { data, isLoading } = useAppQuery({
    queryKey: devicesKeys.lists(),
    queryFn: () => devicesAPI.getAll(),
  });

  const toggleMutation = useAppMutation({
    mutationFn: ({ id, isActive }) => devicesAPI.update(id, { isActive }),
    invalidateKeys: [devicesKeys.lists()],
    onSuccess: () => toast.success("Qurilma turi holati o'zgartirildi"),
  });

  const deleteMutation = useAppMutation({
    mutationFn: (id) => devicesAPI.delete(id),
    invalidateKeys: [devicesKeys.lists()],
    onSuccess: () => toast.success("Qurilma turi o'chirildi"),
  });

  const devices = data?.data || [];

  const handleOpenForm = (device = null) => {
    openModal(MODAL_NAME, { device });
  };

  const items = devices.map((d) => ({
    key: d._id,
    title: d.label,
    description: `${d.keywords?.length || 0} ta kalit so'z · tartib: ${d.order}`,
    icon: Smartphone,
    gradientFrom: d.isActive ? "from-emerald-400" : "from-gray-300",
    gradientTo: d.isActive ? "to-emerald-600" : "to-gray-400",
    trailing: (
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant={d.isActive ? "outline" : "ghost"}
          onClick={(e) => {
            e.stopPropagation();
            toggleMutation.mutate({ id: d._id, isActive: !d.isActive });
          }}
        >
          {d.isActive ? "Faol" : "Nofaol"}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenForm(d);
          }}
        >
          <Pencil size={15} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`"${d.label}" qurilma turini o'chirishni tasdiqlaysizmi?`)) {
              deleteMutation.mutate(d._id);
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
        <h1 className="text-xl font-bold">Qurilma turlari</h1>
        <Button onClick={() => handleOpenForm()} size="sm">
          <Plus size={16} className="mr-1.5" />
          Tur qo'shish
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <p className="text-gray-400 text-sm py-8 text-center">Yuklanmoqda...</p>
        ) : devices.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">Qurilma turlari yo'q</p>
        ) : (
          <List items={items} />
        )}
      </Card>

      <ModalWrapper name={MODAL_NAME} title="Qurilma turi">
        <DeviceForm />
      </ModalWrapper>
    </div>
  );
};

export default DevicesPage;
