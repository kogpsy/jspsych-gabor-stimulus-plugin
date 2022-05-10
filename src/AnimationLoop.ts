/**
 * AnimationLoop
 *
 * Create game / run loops running at a specified fps while still using
 * requestAnimationFrame() under the hood.
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: GPL-3.0
 *
 */
class AnimationLoop {
  // Declare class variables

  // Time of one frame
  private frameLength: number;
  // Function that is called each frame
  private updateFunction: () => void;
  // Current requestAnimationFrame() ID used to stop the loop
  private frameId: number;
  // Time of current frame
  private currentTime = performance.now();
  // Time of previous frame
  private previousFrameTime = performance.now();
  // Elapsed time since last frame (used to check if a next frame is due)
  private elapsed = 0;
  // Holds whether the current frame is the first
  private isFirstFrame = true;

  /**
   * Create AnimationLoop instance
   * @param fps FPS at which the loop should run
   * @param updateFunction Function to call each frame
   */
  constructor(fps: number, updateFunction: () => void) {
    this.frameLength = 1000 / fps;
    this.updateFunction = updateFunction;
  }

  /**
   * Internal update function
   *
   * Keeps the requestAnimationFrame() loop running, and checks if the provided
   * update function should be called this frame
   *
   * @param timestamp Timestamp received from requestAnimationFrame()
   */
  private internalUpdate(timestamp: DOMHighResTimeStamp) {
    // Request next animation frame
    this.frameId = requestAnimationFrame((timestamp) => {
      this.internalUpdate(timestamp);
    });

    // Check if update is due (to be able to run at certain fps)
    this.currentTime = timestamp;
    this.elapsed = this.currentTime - this.previousFrameTime;
    // If enough time is elapsed or it's the first frame, trigger update
    if (this.elapsed > this.frameLength || this.isFirstFrame) {
      // If it's the first frame, set isFirstFrame to false
      if (this.isFirstFrame) {
        this.isFirstFrame = false;
      }
      // Update timing related class vars
      this.previousFrameTime =
        this.currentTime - (this.elapsed % this.frameLength);

      // Trigger priveded update function
      this.updateFunction();
    }
  }

  /**
   * Start the loop
   */
  public startLoop() {
    this.frameId = requestAnimationFrame((timestamp) => {
      this.internalUpdate(timestamp);
    });
  }
  /**
   * Stop the loop
   */
  public stopLoop() {
    cancelAnimationFrame(this.frameId);
  }
}

export default AnimationLoop;
