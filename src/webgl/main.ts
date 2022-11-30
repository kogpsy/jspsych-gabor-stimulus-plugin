import "./style.css";
import { init } from "./pixi";
import * as PIXI from "pixi.js";

const GABOR_SIZE = 300;

// Create pixi app (takes ~20ms, so this must be prepared separately)
const pixiApp = new PIXI.Application({
  width: GABOR_SIZE,
  height: GABOR_SIZE,
  backgroundAlpha: 0,
});

const container = document.getElementById("app") as HTMLElement;

const startTime = performance.now();

// Initialize plugin
init(pixiApp, container, GABOR_SIZE);

const elapsed = performance.now() - startTime;

console.log(`Initialization took: ${elapsed}ms`);
