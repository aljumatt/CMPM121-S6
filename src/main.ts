// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const SPORES_PER_SECOND = 1;
const COMPOST_BIN_COST = 10;
const COMPOST_BIN_RATE_BONUS = 1;

let spores = 0;
let compostBins = 0;

function sporesPerSecond(): number {
  return SPORES_PER_SECOND + compostBins * COMPOST_BIN_RATE_BONUS;
}

const heading = document.createElement("h1");
heading.textContent = "D1 project";

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 96;
image.height = 96;

const sporeCount = document.createElement("p");
sporeCount.id = "spore-count";

const sporeRate = document.createElement("p");
sporeRate.id = "spore-rate";

const clickButton = document.createElement("button");
clickButton.id = "main-action";
clickButton.type = "button";
clickButton.textContent = "Click me";

const compostButton = document.createElement("button");
compostButton.id = "buy-compost-bin";
compostButton.type = "button";
compostButton.textContent = `Buy compost bin (${COMPOST_BIN_COST} spores)`;

function render(): void {
  sporeCount.textContent = `Spores: ${Math.floor(spores)}`;
  sporeRate.textContent = `Spores per second: ${sporesPerSecond()}`;
  compostButton.disabled = spores < COMPOST_BIN_COST;
}

clickButton.addEventListener("click", () => {
  spores += 1;
  render();
});

compostButton.addEventListener("click", () => {
  if (spores < COMPOST_BIN_COST) {
    return;
  }
  spores -= COMPOST_BIN_COST;
  compostBins += 1;
  render();
});

let lastTime = performance.now();

function tick(now: number): void {
  const elapsedSeconds = (now - lastTime) / 1000;
  lastTime = now;
  spores += elapsedSeconds * sporesPerSecond();
  render();
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

render();
app.append(heading, image, sporeCount, sporeRate, clickButton, compostButton);
