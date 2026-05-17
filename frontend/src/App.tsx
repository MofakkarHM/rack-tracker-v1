import { useState } from "react";
import RacksPage from "./pages/RacksPage";
import type { Rack } from "./types/rack";

type View = "racks" | "equipment";

export default function App() {
  const [view, setView] = useState<View>("racks");
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navbar */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-6">
        <h1 className="text-xl font-bold tracking-tight text-white">
          ⚙ Rack Tracker
        </h1>
        <nav className="flex gap-1">
          {(["racks", "equipment"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => {
                setView(v);
                setSelectedRack(null);
              }}
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
      </header>

      {/* Main */}
      <main className="p-6 max-w-7xl mx-auto">
        {view === "racks" && (
          <RacksPage
            onSelectRack={(rack) => {
              setSelectedRack(rack);
              setView("equipment");
            }}
          />
        )}
        {view === "equipment" && (
          <div>
            <p className="text-gray-400 text-sm">
              Equipment view — coming next.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
