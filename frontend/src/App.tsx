import { useState } from "react";
import RacksPage from "./pages/RacksPage";
import EquipmentPage from "./pages/EquipmentPage";
import type { Rack } from "./types/rack";

type View = "racks" | "equipment";

export default function App() {
  const [view, setView] = useState<View>("racks");
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);

  function handleSelectRack(rack: Rack) {
    setSelectedRack(rack);
    setView("equipment");
  }

  function handleNavClick(v: View) {
    setView(v);
    if (v === "racks") setSelectedRack(null);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-6">
        <h1 className="text-xl font-bold tracking-tight text-white">
          ⚙ Rack Tracker
        </h1>
        <nav className="flex gap-1">
          {(["racks", "equipment"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => handleNavClick(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors
                ${
                  view === v
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
            >
              {v}
            </button>
          ))}
        </nav>
        {selectedRack && view === "equipment" && (
          <span className="text-xs text-gray-500 ml-auto">
            Viewing: <span className="text-blue-400">{selectedRack.name}</span>
          </span>
        )}
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {view === "racks" && <RacksPage onSelectRack={handleSelectRack} />}
        {view === "equipment" && <EquipmentPage selectedRack={selectedRack} />}
      </main>
    </div>
  );
}
