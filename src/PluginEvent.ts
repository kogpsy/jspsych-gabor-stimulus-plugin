/**
 * PluginEvent
 *
 * Create arbitrary events which can be subscribed.
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: GPL-3.0
 *
 */
class PluginEvent {
  // Declare class variables
  private callbacks: { (): void }[] = [];

  // Empty constructor
  constructor() {}

  /**
   * Subscribes a callback function to the event
   *
   * @param callback The function that should be called, when the event is
   * triggered
   */
  public subscribe(callback: { (): void }) {
    this.callbacks.push(callback);
  }

  /**
   * Triggers the event. This will call all callback functions.
   */
  public trigger() {
    this.callbacks.forEach((callback) => {
      callback();
    });
  }

  /**
   * Clears the callback array
   */
  public clear() {
    this.callbacks = [];
  }
}

export default PluginEvent;
