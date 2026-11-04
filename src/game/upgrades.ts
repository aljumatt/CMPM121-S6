export type UpgradeEffect =
  | { kind: "rate"; bonusPerSecond: number }
  | { kind: "tap"; bonusPerTap: number };

export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costGrowth: number;
  effect: UpgradeEffect;
}

export const UPGRADES: UpgradeDef[] = [
  {
    id: "compost-bin",
    name: "compost bin",
    description: "Rotted leaves feed the mycelium below.",
    baseCost: 10,
    costGrowth: 1.15,
    effect: { kind: "rate", bonusPerSecond: 1 },
  },
  {
    id: "spore-sieve",
    name: "spore sieve",
    description: "Shakes loose extra spores with every tap.",
    baseCost: 15,
    costGrowth: 1.15,
    effect: { kind: "tap", bonusPerTap: 1 },
  },
  {
    id: "dew-collector",
    name: "dew collector",
    description: "Condenses morning mist into a steady drip.",
    baseCost: 30,
    costGrowth: 1.15,
    effect: { kind: "rate", bonusPerSecond: 3 },
  },
  {
    id: "fog-bellows",
    name: "fog bellows",
    description:
      "Puffs damp fog between the fronds; nothing drinks like a cloud.",
    baseCost: 60,
    costGrowth: 1.15,
    effect: { kind: "rate", bonusPerSecond: 6 },
  },
];
