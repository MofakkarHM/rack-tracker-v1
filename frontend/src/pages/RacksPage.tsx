import { useState } from "react";
import { useRacks, useDeleteRack } from "../hooks/useRacks";
import RackCard from "../components/racks/RackCard";
import RackFormModal from "../components/racks/RackFormModal";
import Button from "../components/ui/Button";
import type { Rack } from "../types/rack";

export default function RacksPage({
  onSelectRack,
}: {
  onSelectRack: (rack: Rack) => void;
}) {
  const { data: racks, isLoading, isError } = useRacks();
  const deleteRack = useDeleteRack();

  const [showModal, setShowModal] = useState(false);
  const [editRack, setEditRack] = useState<Rack | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Rack | null>(null);

  function handleEdit(rack: Rack) {
    setEditRack(rack);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditRack(null);
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    await deleteRack.mutateAsync(confirmDelete.id);
    setConfirmDelete(null);
  }

  if (isLoading) {
    return <p className="text-gray-400 text-sm">Loading racks...</p>;
  }

  if (isError) {
    return <p className="text-red-400 text-sm">Failed to load racks.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">Racks</h2>
          <p className="text-sm text-gray-400">
            {racks?.length ?? 0} rack{racks?.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Add Rack</Button>
      </div>

      {/* Empty state */}
      {racks?.length === 0 && (
        <div className="border border-dashed border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">No racks yet.</p>
          <p className="text-gray-500 text-xs mt-1">
            Add your first rack to get started.
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {racks?.map((rack) => (
          <RackCard
            key={rack.id}
            rack={rack}
            onEdit={handleEdit}
            onDelete={setConfirmDelete}
            onClick={onSelectRack}
          />
        ))}
      </div>

      {/* Create / Edit modal */}
      {showModal && (
        <RackFormModal onClose={handleCloseModal} editRack={editRack} />
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="relative z-10 bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm mx-4 w-full">
            <h3 className="font-semibold text-gray-100 mb-2">Delete Rack</h3>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-gray-200 font-medium">
                {confirmDelete.name}
              </span>
              ? Equipment in this rack will become unassigned.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                isLoading={deleteRack.isPending}
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
