class ViewPort {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // zoom level
    this.zoom = 1;

    // pan and drag
    this.offset = new Point(0, 0);
    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active: false,
    };

    this.#addEventListeners();
  }

  // after zoom in-and-out we need to get the point based on zoom
  // otherwise it will be fixed to the initial size and won't be able to use the whole canvas
  getMouse(evt) {
    return new Point(evt.offsetX * this.zoom, evt.offsetY * this.zoom);
  }

  // add the dragged offset to the current offset
  getOffset() {
    return add(this.offset, this.drag.offset);
  }

  #addEventListeners() {
    // zoom
    this.canvas.addEventListener(
      "mousewheel",
      this.#handleMouseWheel.bind(this)
    );
    // pan and drag
    this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.#handleMouseUp.bind(this));
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

  // pan and drag
  #handleMouseDown(evt) {
    // middle button
    if (evt.button === 1) {
      this.drag.start = this.getMouse(evt);
      this.drag.active = true;
    }
  }

  #handleMouseMove(evt) {
    // if middle button is pressed already
    if (this.drag.active) {
      this.drag.end = this.getMouse(evt);
      this.drag.offset = difference(this.drag.end, this.drag.start);
    }
  }

  #handleMouseUp(evt) {
    // if already dragging
    if (this.drag.active) {
      this.offset = add(this.offset, this.drag.offset);

      // reset drag info
      this.drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0),
        active: false,
      };
    }
  }
}
