import type { Rack } from "../../types/rack";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

interface Props {
  rack: Rack;
  onEdit: (rack: Rack) => void;
  onDelete: (rack: Rack) => void;
  onClick: (rack: Rack) => void;
}

export default function RackCard({ rack, onEdit, onDelete, onClick }: Props) {
  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 
        hover:border-gray-600 transition-colors cursor-pointer group"
      onClick={() => onClick(rack)}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">
            {rack.name}
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">{rack.location}</p>
        </div>
        <Badge label={`${rack.total_slots}U`} variant="blue" />
      </div>

      <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          className="flex-1 text-xs py-1.5"
          onClick={() => onEdit(rack)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          className="flex-1 text-xs py-1.5"
          onClick={() => onDelete(rack)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
