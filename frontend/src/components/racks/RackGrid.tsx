import type { Rack } from "../../types/rack";
import type { Equipment } from "../../types/equipment";
import Badge from "../ui/Badge";

interface Props {
  rack: Rack;
  equipment: Equipment[];
  onSlotClick: (slotNumber: number, equipment: Equipment | null) => void;
}

const TYPE_COLORS: Record<string, string> = {
  server: "bg-blue-900/60 border-blue-700 text-blue-200",
  switch: "bg-green-900/60 border-green-700 text-green-200",
  firewall: "bg-red-900/60 border-red-700 text-red-200",
  storage: "bg-purple-900/60 border-purple-700 text-purple-200",
  patch: "bg-yellow-900/60 border-yellow-700 text-yellow-200",
  other: "bg-gray-800 border-gray-600 text-gray-300",
};

export default function RackGrid({ rack, equipment, onSlotClick }: Props) {
  const slotMap = new Map<number, Equipment>();
  equipment.forEach((e) => {
    if (e.slot_number != null) slotMap.set(e.slot_number, e);
  });

  const occupiedCount = slotMap.size;
  const freeCount = rack.total_slots - occupiedCount;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Rack header */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-100">{rack.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{rack.location}</p>
        </div>
        <div className="flex gap-2">
          <Badge label={`${occupiedCount} used`} variant="blue" />
          <Badge
            label={`${freeCount} free`}
            variant={freeCount === 0 ? "red" : "green"}
          />
        </div>
      </div>

      {/* Slot grid */}
      <div className="p-4 flex flex-col gap-1">
        {Array.from({ length: rack.total_slots }, (_, i) => i + 1).map(
          (slot) => {
            const item = slotMap.get(slot);
            return (
              <div
                key={slot}
                onClick={() => onSlotClick(slot, item || null)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer
                transition-all text-sm
                ${
                  item
                    ? `${TYPE_COLORS[item.type] || TYPE_COLORS.other} hover:brightness-110`
                    : "bg-gray-800/40 border-gray-700/50 text-gray-600 hover:bg-gray-800 hover:text-gray-400"
                }`}
              >
                {/* Slot number */}
                <span className="w-6 text-xs font-mono opacity-60 shrink-0">
                  {slot}
                </span>

                {/* Content */}
                {item ? (
                  <>
                    <span className="font-medium truncate flex-1">
                      {item.name}
                    </span>
                    <span className="text-xs opacity-70 shrink-0 capitalize">
                      {item.type}
                    </span>
                    <span className="text-xs font-mono opacity-50 shrink-0">
                      {item.tag}
                    </span>
                  </>
                ) : (
                  <span className="text-xs italic">
                    Empty — click to assign
                  </span>
                )}
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
