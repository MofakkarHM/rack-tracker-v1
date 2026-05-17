import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import {
  useCreateEquipment,
  useUpdateEquipment,
} from "../../hooks/useEquipment";
import { useRacks } from "../../hooks/useRacks";
import type { Equipment, EquipmentType } from "../../types/equipment";

interface Props {
  onClose: () => void;
  editEquipment?: Equipment | null;
  defaultRackId?: number | null;
}

const EQUIPMENT_TYPES: EquipmentType[] = [
  "server",
  "switch",
  "firewall",
  "storage",
  "patch",
  "other",
];

interface FormState {
  name: string;
  type: EquipmentType;
  make: string;
  tag: string;
  rack_id: string;
  slot_number: string;
}

interface FormErrors {
  name?: string;
  make?: string;
  tag?: string;
  slot_number?: string;
  rack_slot?: string;
}

export default function EquipmentFormModal({
  onClose,
  editEquipment,
  defaultRackId,
}: Props) {
  const isEdit = !!editEquipment;
  const createEquipment = useCreateEquipment();
  const updateEquipment = useUpdateEquipment();
  const { data: racks } = useRacks();

  const [form, setForm] = useState<FormState>({
    name: editEquipment?.name || "",
    type: editEquipment?.type || "server",
    make: editEquipment?.make || "",
    tag: editEquipment?.tag || "",
    rack_id:
      editEquipment?.rack_id?.toString() || defaultRackId?.toString() || "",
    slot_number: editEquipment?.slot_number?.toString() || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (editEquipment) {
      setForm({
        name: editEquipment.name,
        type: editEquipment.type,
        make: editEquipment.make,
        tag: editEquipment.tag,
        rack_id: editEquipment.rack_id?.toString() || "",
        slot_number: editEquipment.slot_number?.toString() || "",
      });
    }
  }, [editEquipment]);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.make.trim()) newErrors.make = "Make is required";
    if (!form.tag.trim()) newErrors.tag = "Tag is required";

    const hasRack = form.rack_id !== "";
    const hasSlot = form.slot_number !== "";
    if (hasRack !== hasSlot) {
      newErrors.rack_slot = "Both rack and slot must be set together";
    }
    if (hasSlot) {
      const slot = Number(form.slot_number);
      if (isNaN(slot) || slot < 1)
        newErrors.slot_number = "Slot must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setServerError("");

    const payload = {
      name: form.name.trim(),
      type: form.type,
      make: form.make.trim(),
      tag: form.tag.trim(),
      rack_id: form.rack_id ? Number(form.rack_id) : null,
      slot_number: form.slot_number ? Number(form.slot_number) : null,
    };

    try {
      if (isEdit && editEquipment) {
        await updateEquipment.mutateAsync({
          id: editEquipment.id,
          data: payload,
        });
      } else {
        await createEquipment.mutateAsync(payload);
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setServerError(error?.response?.data?.message || "Something went wrong");
    }
  }

  const isLoading = createEquipment.isPending || updateEquipment.isPending;

  return (
    <Modal
      title={isEdit ? "Edit Equipment" : "Add Equipment"}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        {serverError && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
            {serverError}
          </p>
        )}

        <Input
          label="Name"
          placeholder="e.g. Web Server 01"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />

        {/* Type select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">Type</label>
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm 
              text-gray-100 focus:outline-none focus:border-blue-500"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as EquipmentType })
            }
          >
            {EQUIPMENT_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Make"
          placeholder="e.g. Dell"
          value={form.make}
          onChange={(e) => setForm({ ...form, make: e.target.value })}
          error={errors.make}
        />

        <Input
          label="Asset Tag"
          placeholder="e.g. TAG-013"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
          error={errors.tag}
        />

        {/* Rack select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">
            Rack (optional)
          </label>
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm 
              text-gray-100 focus:outline-none focus:border-blue-500"
            value={form.rack_id}
            onChange={(e) =>
              setForm({ ...form, rack_id: e.target.value, slot_number: "" })
            }
          >
            <option value="">— Unassigned —</option>
            {racks?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {form.rack_id && (
          <Input
            label="Slot Number"
            type="number"
            placeholder="e.g. 3"
            value={form.slot_number}
            onChange={(e) => setForm({ ...form, slot_number: e.target.value })}
            error={errors.slot_number}
          />
        )}

        {errors.rack_slot && (
          <p className="text-xs text-red-400">{errors.rack_slot}</p>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            {isEdit ? "Save Changes" : "Add Equipment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
