import { type UpgradeDef, UPGRADES } from "./upgrades.ts";

export const BASE_SPORES_PER_SECOND = 1;
export const BASE_SPORES_PER_TAP = 1;

export interface GameState {
  spores: number;
  owned: Record<string, number>;
}

export function createGameState(): GameState {
  return { spores: 0, owned: {} };
}

export function ownedOf(state: GameState, def: UpgradeDef): number {
  return state.owned[def.id] ?? 0;
}

export function costOf(state: GameState, def: UpgradeDef): number {
  return Math.ceil(def.baseCost * def.costGrowth ** ownedOf(state, def));
}

export function sporesPerSecond(state: GameState): number {
  let rate = BASE_SPORES_PER_SECOND;
  for (const def of UPGRADES) {
    if (def.effect.kind === "rate") {
      rate += ownedOf(state, def) * def.effect.bonusPerSecond;
    }
  }
  return rate;
}

export function sporesPerTap(state: GameState): number {
  let tapYield = BASE_SPORES_PER_TAP;
  for (const def of UPGRADES) {
    if (def.effect.kind === "tap") {
      tapYield += ownedOf(state, def) * def.effect.bonusPerTap;
    }
  }
  return tapYield;
}

export function tap(state: GameState): void {
  state.spores += sporesPerTap(state);
}

export function grow(state: GameState, seconds: number): void {
  state.spores += seconds * sporesPerSecond(state);
}

export function buy(state: GameState, def: UpgradeDef): boolean {
  const cost = costOf(state, def);
  if (state.spores < cost) {
    return false;
  }
  state.spores -= cost;
  state.owned[def.id] = ownedOf(state, def) + 1;
  return true;
}
