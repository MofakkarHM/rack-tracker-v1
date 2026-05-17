export const queryKeys = {
  racks: {
    all: ["racks"] as const,
    detail: (id: number) => ["racks", id] as const,
  },
  equipment: {
    all: ["equipment"] as const,
    detail: (id: number) => ["equipment", id] as const,
    byRack: (rackId: number) => ["equipment", "rack", rackId] as const,
  },
};
