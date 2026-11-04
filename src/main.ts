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

const message = document.createElement("p");
message.textContent = "Your project starts here.";

const clickButton = document.createElement("button");
clickButton.id = "main-action";
clickButton.type = "button";
clickButton.textContent = "Click me";

const sporeCount = document.createElement("p");
sporeCount.id = "spore-count";

const SPORES_PER_SECOND = 1;

let spores = 0;

function renderSpores(): void {
  sporeCount.textContent = `Spores: ${spores}`;
}

clickButton.addEventListener("click", () => {
  spores += 1;
  renderSpores();
});

setInterval(() => {
  spores += SPORES_PER_SECOND;
  renderSpores();
}, 1000);

renderSpores();
app.append(heading, image, sporeCount, clickButton);
