import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useCreateRack, useUpdateRack } from "../../hooks/useRacks";
import type { Rack } from "../../types/rack";

interface Props {
  onClose: () => void;
  editRack?: Rack | null;
}

interface FormState {
  name: string;
  location: string;
  total_slots: string;
}

interface FormErrors {
  name?: string;
  location?: string;
  total_slots?: string;
}

export default function RackFormModal({ onClose, editRack }: Props) {
  const isEdit = !!editRack;
  const createRack = useCreateRack();
  const updateRack = useUpdateRack();

  const [form, setForm] = useState<FormState>({
    name: editRack?.name || "",
    location: editRack?.location || "",
    total_slots: editRack?.total_slots?.toString() || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (editRack) {
      setForm({
        name: editRack.name,
        location: editRack.location,
        total_slots: editRack.total_slots.toString(),
      });
    }
  }, [editRack]);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    const slots = Number(form.total_slots);
    if (!form.total_slots) newErrors.total_slots = "Total slots is required";
    else if (isNaN(slots) || slots < 1 || slots > 42)
      newErrors.total_slots = "Must be between 1 and 42";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setServerError("");

    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      total_slots: Number(form.total_slots),
    };

    try {
      if (isEdit && editRack) {
        await updateRack.mutateAsync({ id: editRack.id, data: payload });
      } else {
        await createRack.mutateAsync(payload);
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setServerError(error?.response?.data?.message || "Something went wrong");
    }
  }

  const isLoading = createRack.isPending || updateRack.isPending;

  return (
    <Modal title={isEdit ? "Edit Rack" : "Add Rack"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {serverError && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
            {serverError}
          </p>
        )}
        <Input
          label="Name"
          placeholder="e.g. Rack-A1"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />
        <Input
          label="Location"
          placeholder="e.g. Data Center 1 - Row A"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          error={errors.location}
        />
        <Input
          label="Total Slots (1–42)"
          type="number"
          placeholder="42"
          value={form.total_slots}
          onChange={(e) => setForm({ ...form, total_slots: e.target.value })}
          error={errors.total_slots}
        />
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            {isEdit ? "Save Changes" : "Add Rack"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
