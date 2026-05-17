CREATE TABLE IF NOT EXISTS racks (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  location    VARCHAR(100) NOT NULL,
  total_slots INTEGER NOT NULL CHECK (total_slots > 0 AND total_slots <= 42),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipment (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  type        VARCHAR(50)  NOT NULL,
  make        VARCHAR(50)  NOT NULL,
  tag         VARCHAR(50)  NOT NULL UNIQUE,
  rack_id     INTEGER REFERENCES racks(id) ON DELETE SET NULL,
  slot_number INTEGER CHECK (slot_number > 0),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Seed racks
INSERT INTO racks (name, location, total_slots) VALUES
  ('Rack-A1', 'Data Center 1 - Row A', 42),
  ('Rack-A2', 'Data Center 1 - Row A', 42),
  ('Rack-B1', 'Data Center 1 - Row B', 24),
  ('Rack-C1', 'Data Center 2 - Row C', 12);
ON CONFLICT (name) DO NOTHING;

-- Seed equipment
INSERT INTO equipment (name, type, make, tag, rack_id, slot_number) VALUES
  ('Core Switch Alpha',  'switch',  'Cisco',  'TAG-001', 1, 1),
  ('Core Switch Beta',   'switch',  'Cisco',  'TAG-002', 1, 2),
  ('Web Server 01',      'server',  'Dell',   'TAG-003', 1, 3),
  ('Web Server 02',      'server',  'Dell',   'TAG-004', 1, 4),
  ('DB Server Primary',  'server',  'HP',     'TAG-005', 2, 1),
  ('DB Server Replica',  'server',  'HP',     'TAG-006', 2, 2),
  ('Firewall Unit',      'firewall','Fortinet','TAG-007', 2, 3),
  ('Storage Array 01',   'storage', 'NetApp', 'TAG-008', 3, 1),
  ('Patch Panel 01',     'patch',   'Leviton','TAG-009', 3, 2),
  ('Access Switch 01',   'switch',  'Juniper','TAG-010', 4, 1),
  ('Unassigned Server',  'server',  'Dell',   'TAG-011', NULL, NULL),
  ('Spare Switch',       'switch',  'Cisco',  'TAG-012', NULL, NULL);
ON CONFLICT (tag) DO NOTHING;