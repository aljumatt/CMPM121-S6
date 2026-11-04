// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import mushroomUrl from "./assets/mushroom.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const SPORES_PER_SECOND = 1;
const COMPOST_BIN_COST = 10;
const COMPOST_BIN_RATE_BONUS = 1;
const SPORE_SIEVE_COST = 15;
const SPORE_SIEVE_TAP_BONUS = 1;
const DEW_COLLECTOR_COST = 30;
const DEW_COLLECTOR_RATE_BONUS = 3;
const COST_GROWTH = 1.15;

let spores = 0;
let compostBins = 0;
let sporeSieves = 0;
let dewCollectors = 0;

function costOf(baseCost: number, growth: number, owned: number): number {
  return Math.ceil(baseCost * growth ** owned);
}

function sporesPerSecond(): number {
  return SPORES_PER_SECOND +
    compostBins * COMPOST_BIN_RATE_BONUS +
    dewCollectors * DEW_COLLECTOR_RATE_BONUS;
}

function sporesPerTap(): number {
  return 1 + sporeSieves * SPORE_SIEVE_TAP_BONUS;
}

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

const compostItem = document.createElement("div");
compostItem.className = "shop-item";
const compostButton = document.createElement("button");
compostButton.id = "buy-compost-bin";
compostButton.type = "button";
const compostOwned = document.createElement("p");
compostOwned.className = "owned";
compostOwned.id = "owned-compost-bin";
const compostDescription = document.createElement("p");
compostDescription.className = "description";
compostDescription.textContent = "Rotted leaves feed the mycelium below.";
compostItem.append(compostButton, compostOwned, compostDescription);

const sieveItem = document.createElement("div");
sieveItem.className = "shop-item";
const sieveButton = document.createElement("button");
sieveButton.id = "buy-spore-sieve";
sieveButton.type = "button";
const sieveOwned = document.createElement("p");
sieveOwned.className = "owned";
sieveOwned.id = "owned-spore-sieve";
const sieveDescription = document.createElement("p");
sieveDescription.className = "description";
sieveDescription.textContent = "Shakes loose extra spores with every tap.";
sieveItem.append(sieveButton, sieveOwned, sieveDescription);

const dewItem = document.createElement("div");
dewItem.className = "shop-item";
const dewButton = document.createElement("button");
dewButton.id = "buy-dew-collector";
dewButton.type = "button";
const dewOwned = document.createElement("p");
dewOwned.className = "owned";
dewOwned.id = "owned-dew-collector";
const dewDescription = document.createElement("p");
dewDescription.className = "description";
dewDescription.textContent = "Condenses morning mist into a steady drip.";
dewItem.append(dewButton, dewOwned, dewDescription);

function render(): void {
  const compostCost = costOf(COMPOST_BIN_COST, COST_GROWTH, compostBins);
  const sieveCost = costOf(SPORE_SIEVE_COST, COST_GROWTH, sporeSieves);
  const dewCost = costOf(DEW_COLLECTOR_COST, COST_GROWTH, dewCollectors);

  sporeCount.textContent = `Spores: ${Math.floor(spores)}`;
  sporeRate.textContent = `Spores per second: ${sporesPerSecond()}`;
  tapRate.textContent = `Spores per tap: ${sporesPerTap()}`;

  compostButton.textContent = `Buy compost bin (${compostCost} spores)`;
  compostButton.disabled = spores < compostCost;
  sieveButton.textContent = `Buy spore sieve (${sieveCost} spores)`;
  sieveButton.disabled = spores < sieveCost;
  dewButton.textContent = `Buy dew collector (${dewCost} spores)`;
  dewButton.disabled = spores < dewCost;

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
  const cost = costOf(COMPOST_BIN_COST, COST_GROWTH, compostBins);
  if (spores < cost) {
    return;
  }
  spores -= cost;
  compostBins += 1;
  render();
});

sieveButton.addEventListener("click", () => {
  const cost = costOf(SPORE_SIEVE_COST, COST_GROWTH, sporeSieves);
  if (spores < cost) {
    return;
  }
  spores -= cost;
  sporeSieves += 1;
  render();
});

dewButton.addEventListener("click", () => {
  const cost = costOf(DEW_COLLECTOR_COST, COST_GROWTH, dewCollectors);
  if (spores < cost) {
    return;
  }
  spores -= cost;
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
shop.append(compostItem, sieveItem, dewItem);
app.append(heading, tagline, clickButton, sporeCount, sporeRate, tapRate, shop);
