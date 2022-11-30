import * as PIXI from "pixi.js";
import { generateGabor } from "./gabor";
import { generateNoiseFrames } from "./noise";
import { getBlendFilter } from "@pixi/picture";

export const init = (
  app: PIXI.Application,
  container: HTMLElement,
  size: number
) => {
  // Append the app to DOM. Maybe this should be delayed until everything is
  // rendered.
  // FIXME: I don't know why this error fires.
  // @ts-ignore
  container.appendChild(app.view);

  const gabor = generateGabor(
    {
      size: size,
      density: 7,
      offset: 0,
      blur: 80,
    },
    app.renderer
  );

  const noiseFrames = generateNoiseFrames({
    size: size,
    numberOfFrames: 100,
    renderer: app.renderer,
  });

  gabor.alpha = 0.2;
  gabor.rotation = Math.PI / 4;

  const noiseContainer = new PIXI.Container();
  let noiseIndex = 0;
  noiseContainer.addChild(noiseFrames[noiseIndex]);
  app.stage.addChild(noiseContainer);

  app.stage.addChild(gabor);

  let elapsed = 0;

  app.ticker.add((dt: number) => {
    elapsed += dt;

    if (elapsed > 4) {
      noiseContainer.removeChildren();
      let newIndex: number;
      do {
        newIndex = Math.floor(Math.random() * 10);
      } while (newIndex == noiseIndex);
      noiseIndex = newIndex;
      noiseContainer.addChild(noiseFrames[noiseIndex]);

      elapsed = 0;
    }
  });
};

/* const setup = () => {
  
}

const update = (delta: number) => {
  
}

const cleanup = () => {
  
} */
