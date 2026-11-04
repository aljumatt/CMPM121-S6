// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const SPORES_PER_SECOND = 1;
const COMPOST_BIN_COST = 10;
const COMPOST_BIN_RATE_BONUS = 1;
const SPORE_SIEVE_COST = 15;
const SPORE_SIEVE_TAP_BONUS = 1;
const DEW_COLLECTOR_COST = 30;
const DEW_COLLECTOR_RATE_BONUS = 3;

let spores = 0;
let compostBins = 0;
let sporeSieves = 0;
let dewCollectors = 0;

function sporesPerSecond(): number {
  return SPORES_PER_SECOND +
    compostBins * COMPOST_BIN_RATE_BONUS +
    dewCollectors * DEW_COLLECTOR_RATE_BONUS;
}

function sporesPerTap(): number {
  return 1 + sporeSieves * SPORE_SIEVE_TAP_BONUS;
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

const tapRate = document.createElement("p");
tapRate.id = "spore-tap-rate";

const clickButton = document.createElement("button");
clickButton.id = "main-action";
clickButton.type = "button";
clickButton.textContent = "Click me";

const shop = document.createElement("div");
shop.id = "shop";

const compostButton = document.createElement("button");
compostButton.id = "buy-compost-bin";
compostButton.type = "button";
compostButton.textContent = `Buy compost bin (${COMPOST_BIN_COST} spores)`;

const compostOwned = document.createElement("p");
compostOwned.id = "owned-compost-bin";

const sieveButton = document.createElement("button");
sieveButton.id = "buy-spore-sieve";
sieveButton.type = "button";
sieveButton.textContent = `Buy spore sieve (${SPORE_SIEVE_COST} spores)`;

const sieveOwned = document.createElement("p");
sieveOwned.id = "owned-spore-sieve";

const dewButton = document.createElement("button");
dewButton.id = "buy-dew-collector";
dewButton.type = "button";
dewButton.textContent = `Buy dew collector (${DEW_COLLECTOR_COST} spores)`;

const dewOwned = document.createElement("p");
dewOwned.id = "owned-dew-collector";

function render(): void {
  sporeCount.textContent = `Spores: ${Math.floor(spores)}`;
  sporeRate.textContent = `Spores per second: ${sporesPerSecond()}`;
  tapRate.textContent = `Spores per tap: ${sporesPerTap()}`;
  compostButton.disabled = spores < COMPOST_BIN_COST;
  sieveButton.disabled = spores < SPORE_SIEVE_COST;
  dewButton.disabled = spores < DEW_COLLECTOR_COST;
  compostOwned.textContent =
    `Owned: ${compostBins} · +${COMPOST_BIN_RATE_BONUS}/s each`;
  sieveOwned.textContent =
    `Owned: ${sporeSieves} · +${SPORE_SIEVE_TAP_BONUS}/tap each`;
  dewOwned.textContent =
    `Owned: ${dewCollectors} · +${DEW_COLLECTOR_RATE_BONUS}/s each`;
}

clickButton.addEventListener("click", () => {
  spores += sporesPerTap();
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

sieveButton.addEventListener("click", () => {
  if (spores < SPORE_SIEVE_COST) {
    return;
  }
  spores -= SPORE_SIEVE_COST;
  sporeSieves += 1;
  render();
});

dewButton.addEventListener("click", () => {
  if (spores < DEW_COLLECTOR_COST) {
    return;
  }
  spores -= DEW_COLLECTOR_COST;
  dewCollectors += 1;
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
shop.append(
  compostButton,
  compostOwned,
  sieveButton,
  sieveOwned,
  dewButton,
  dewOwned,
);
app.append(heading, image, sporeCount, sporeRate, tapRate, clickButton, shop);
