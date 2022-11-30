import * as PIXI from "pixi.js";

type NoiseConfig = {
  size: number;
  numberOfFrames: number;
  renderer: PIXI.IRenderer<PIXI.ICanvas>;
};

export const generateNoiseFrames = ({
  size,
  numberOfFrames,
  renderer,
}: NoiseConfig) => {
  let frames: PIXI.Sprite[] = [];
  for (let frame = 0; frame < numberOfFrames; frame++) {
    /* let graphic = new PIXI.Graphics();
    for (let x = 0; x < size; x += noisePixelSize) {
      for (let y = 0; y < size; y += noisePixelSize) {
        const brightness = Math.random();
        graphic.beginFill(
          PIXI.utils.rgb2hex([brightness, brightness, brightness])
        );
        graphic.drawRect(x, y, noisePixelSize, noisePixelSize);
        graphic.endFill();
      }
    }
    // FIXME: Weird TS error here, according to API ref everything's correct
    // @ts-ignore
    const texture = renderer.generateTexture(graphic) as PIXI.RenderTexture;
    const sprite = new PIXI.Sprite(texture);
    frames.push(sprite); */

    let graphic = new PIXI.Graphics();
    graphic.beginFill(PIXI.utils.rgb2hex([0.5, 0.5, 0.5]));
    graphic.drawRect(0, 0, size, size);
    graphic.endFill();

    // FIXME: Weird TS error here, according to API ref everything's correct
    // @ts-ignore
    const texture = renderer.generateTexture(graphic) as PIXI.RenderTexture;
    const sprite = new PIXI.Sprite(texture);

    sprite.filters = [new PIXI.filters.NoiseFilter(1)];
    frames.push(sprite);
  }
  return frames;
};
