// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import mushroomUrl from "./assets/mushroom.svg?no-inline";
import {
  buy,
  costOf,
  createGameState,
  grow,
  ownedOf,
  sporesPerSecond,
  sporesPerTap,
  tap,
} from "./game/state.ts";
import { type UpgradeDef, UPGRADES } from "./game/upgrades.ts";

const app = document.querySelector<HTMLElement>("#app")!;

const state = createGameState();

const heading = document.createElement("h1");
heading.textContent = "Mushroom Garden";

const tagline = document.createElement("p");
tagline.className = "tagline";
tagline.textContent = "Tap the mushroom. Gather spores. Grow the patch.";

const mushroomImage = document.createElement("img");
mushroomImage.src = mushroomUrl;
mushroomImage.alt = "A plump mushroom, ready to tap";
mushroomImage.width = 180;
mushroomImage.height = 180;

const clickButton = document.createElement("button");
clickButton.id = "main-action";
clickButton.type = "button";
clickButton.setAttribute("aria-label", "Tap the mushroom");
clickButton.append(mushroomImage);

const sporeCount = document.createElement("p");
sporeCount.id = "spore-count";

const sporeRate = document.createElement("p");
sporeRate.id = "spore-rate";

const tapRate = document.createElement("p");
tapRate.id = "spore-tap-rate";

const shop = document.createElement("div");
shop.id = "shop";

interface UpgradeView {
  def: UpgradeDef;
  button: HTMLButtonElement;
  ownedLine: HTMLParagraphElement;
}

function effectSummary(def: UpgradeDef): string {
  switch (def.effect.kind) {
    case "rate":
      return `+${def.effect.bonusPerSecond}/s each`;
    case "tap":
      return `+${def.effect.bonusPerTap}/tap each`;
  }
}

const upgradeViews: UpgradeView[] = UPGRADES.map((def) => {
  const item = document.createElement("div");
  item.className = "shop-item";

  const button = document.createElement("button");
  button.id = `buy-${def.id}`;
  button.type = "button";
  button.addEventListener("click", () => {
    buy(state, def);
    render();
  });

  const ownedLine = document.createElement("p");
  ownedLine.className = "owned";

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = def.description;

  item.append(button, ownedLine, description);
  shop.append(item);
  return { def, button, ownedLine };
});

function render(): void {
  sporeCount.textContent = `Spores: ${Math.floor(state.spores)}`;
  sporeRate.textContent = `Spores per second: ${sporesPerSecond(state)}`;
  tapRate.textContent = `Spores per tap: ${sporesPerTap(state)}`;

  for (const view of upgradeViews) {
    const cost = costOf(state, view.def);
    view.button.textContent = `Buy ${view.def.name} (${cost} spores)`;
    view.button.disabled = state.spores < cost;
    view.ownedLine.textContent = `Owned: ${ownedOf(state, view.def)} · ${
      effectSummary(view.def)
    }`;
  }
}

clickButton.addEventListener("click", () => {
  tap(state);
  render();
});

let lastTime = performance.now();

function tick(now: number): void {
  const elapsedSeconds = (now - lastTime) / 1000;
  lastTime = now;
  grow(state, elapsedSeconds);
  render();
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

render();
app.append(heading, tagline, clickButton, sporeCount, sporeRate, tapRate, shop);
