// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

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

const SPORES_PER_SECOND = 1;

let spores = 0;

function render(): void {
  sporeCount.textContent = `Spores: ${Math.floor(spores)}`;
  sporeRate.textContent = `Spores per second: ${SPORES_PER_SECOND}`;
}

clickButton.addEventListener("click", () => {
  spores += 1;
  render();
});

let lastTime = performance.now();

function tick(now: number): void {
  const elapsedSeconds = (now - lastTime) / 1000;
  lastTime = now;
  spores += elapsedSeconds * SPORES_PER_SECOND;
  render();
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

render();
app.append(heading, image, sporeCount, sporeRate, clickButton);
