class ViewPort {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // zoom level
    this.zoom = 1;

    this.#addEventListeners();
  }

  // after zoom in-and-out we need to get the point based on zoom
  // otherwise it will be fixed to the initial size and won't be able to use the whole canvas
  getMouse(evt) {
    return new Point(evt.offsetX * this.zoom, evt.offsetY * this.zoom);
  }

  #addEventListeners() {
    this.canvas.addEventListener(
      "mousewheel",
      this.#handleMouseWheel.bind(this)
    );
  }

  // handle zoom
  #handleMouseWheel(evt) {
    const direction = Math.sign(evt.deltaY);
    // change zoom by this amount
    const step = 0.1;
    this.zoom += direction * step;
    // keep zoom between some min and max value
    this.zoom = Math.max(1, Math.min(5, this.zoom));
  }
}
