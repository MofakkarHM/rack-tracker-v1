import { useState } from "react";
import { useEquipment, useDeleteEquipment } from "../hooks/useEquipment";
import { useRacks } from "../hooks/useRacks";
import RackGrid from "../components/racks/RackGrid";
import EquipmentFormModal from "../components/equipment/EquipmentFormModal";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import type { Equipment } from "../types/equipment";
import type { Rack } from "../types/rack";

interface Props {
  selectedRack?: Rack | null;
}

const TYPE_BADGE: Record<string, "blue" | "green" | "red" | "yellow" | "gray"> =
  {
    server: "blue",
    switch: "green",
    firewall: "red",
    storage: "yellow",
    patch: "gray",
    other: "gray",
  };

export default function EquipmentPage({ selectedRack }: Props) {
  const { data: equipment, isLoading, isError } = useEquipment();
  const { data: racks } = useRacks();
  const deleteEquipment = useDeleteEquipment();

  const [showModal, setShowModal] = useState(false);
  const [editEquipment, setEditEquipment] = useState<Equipment | null>(null);
  const [defaultRackId, setDefaultRackId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Equipment | null>(null);
  const [activeRackId, setActiveRackId] = useState<number | null>(
    selectedRack?.id ?? null,
  );

  function handleSlotClick(
    rackId: number,
    _slot: number,
    item: Equipment | null,
  ) {
    if (item) {
      setEditEquipment(item);
      setDefaultRackId(null);
    } else {
      setEditEquipment(null);
      setDefaultRackId(rackId);
    }
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditEquipment(null);
    setDefaultRackId(null);
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    await deleteEquipment.mutateAsync(confirmDelete.id);
    setConfirmDelete(null);
  }

  if (isLoading)
    return <p className="text-gray-400 text-sm">Loading equipment...</p>;
  if (isError)
    return <p className="text-red-400 text-sm">Failed to load equipment.</p>;

  const unassigned = equipment?.filter((e) => e.rack_id == null) ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">Equipment</h2>
          <p className="text-sm text-gray-400">
            {equipment?.length ?? 0} items total
          </p>
        </div>
        <Button
          onClick={() => {
            setEditEquipment(null);
            setShowModal(true);
          }}
        >
          + Add Equipment
        </Button>
      </div>

      {/* Rack tabs */}
      {racks && racks.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveRackId(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${
                activeRackId === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-gray-200"
              }`}
          >
            All Racks
          </button>
          {racks.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRackId(r.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${
                  activeRackId === r.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-gray-200"
                }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}

      {/* Rack grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {racks
          ?.filter((r) => activeRackId === null || r.id === activeRackId)
          .map((rack) => (
            <RackGrid
              key={rack.id}
              rack={rack}
              equipment={equipment?.filter((e) => e.rack_id === rack.id) ?? []}
              onSlotClick={(slot, item) => handleSlotClick(rack.id, slot, item)}
            />
          ))}
      </div>

      {/* Unassigned equipment table */}
      {unassigned.length > 0 && activeRackId === null && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="font-semibold text-gray-100">
              Unassigned Equipment
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Not placed in any rack
            </p>
          </div>
          <div className="divide-y divide-gray-800">
            {unassigned.map((item) => (
              <div key={item.id} className="px-5 py-3 flex items-center gap-4">
                <Badge
                  label={item.type}
                  variant={TYPE_BADGE[item.type] ?? "gray"}
                />
                <span className="flex-1 text-sm text-gray-200 font-medium">
                  {item.name}
                </span>
                <span className="text-xs text-gray-400">{item.make}</span>
                <span className="text-xs font-mono text-gray-500">
                  {item.tag}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="text-xs py-1 px-3"
                    onClick={() => {
                      setEditEquipment(item);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="text-xs py-1 px-3"
                    onClick={() => setConfirmDelete(item)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {equipment?.length === 0 && (
        <div className="border border-dashed border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">No equipment yet.</p>
          <p className="text-gray-500 text-xs mt-1">
            Add your first item to get started.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <EquipmentFormModal
          onClose={handleCloseModal}
          editEquipment={editEquipment}
          defaultRackId={defaultRackId}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="relative z-10 bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm mx-4 w-full">
            <h3 className="font-semibold text-gray-100 mb-2">
              Delete Equipment
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-gray-200 font-medium">
                {confirmDelete.name}
              </span>
              ?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                isLoading={deleteEquipment.isPending}
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
