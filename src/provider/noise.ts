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
    let graphic = new PIXI.Graphics();
    graphic.beginFill(PIXI.utils.rgb2hex([0.5, 0.5, 0.5]));
    graphic.drawRect(0, 0, size, size);
    graphic.endFill();

    // FIXME: Pixi bug. Should be fixed in 7.1.0
    // https://github.com/pixijs/pixijs/issues/8947
    // @ts-ignore
    const texture = renderer.generateTexture(graphic) as PIXI.RenderTexture;
    const sprite = new PIXI.Sprite(texture);

    sprite.filters = [new PIXI.filters.NoiseFilter(1, Math.random())];
    frames.push(sprite);
  }
  return frames;
};
