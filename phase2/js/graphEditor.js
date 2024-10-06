class GraphEditor {
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.graph = graph;

    this.ctx = this.canvas.getContext("2d");

    this.selected = null; // selected point
    this.hovered = null; // hovered point
    this.dragging = false; // if is dragging or not
    this.mouse = null; // current mouse position

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousedown", (evt) => {
      // if it is a right click delete the hovered point
      if (evt.button === 2) {
        if (this.hovered) {
          this.#removePoint(this.hovered);
        } else {
          // remove selection upon right click if not hovering over any point
          this.selected = null;
        }
      }

      // if it is a left click
      if (evt.button === 0) {
        this.mouse = new Point(evt.offsetX, evt.offsetY);
        // check if new point is on top of another point
        if (this.hovered) {
          // if a point is already selected then create a segment between it and the hovered point
          this.#select(this.hovered);
          // now is draggable
          this.dragging = true;
          return;
        }

        // new point will be added to position of mouse pointer
        this.graph.addPoint(this.mouse);
        // if a point is already selected then create a segment between it and the new point
        this.#select(this.mouse);
        this.hovered = this.mouse;
      }
    });

    this.canvas.addEventListener("mousemove", (evt) => {
      this.mouse = new Point(evt.offsetX, evt.offsetY);
      this.hovered = getNearestPoint(this.mouse, this.graph.points, 18);
      // gets dragged along with mouse pointer
      if (this.dragging === true) {
        this.selected.x = this.mouse.x;
        this.selected.y = this.mouse.y;
      }
    });

    // disable context menu on right click
    this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
    // remove dragging upon release of the mouse button
    this.canvas.addEventListener("mouseup", (evt) => (this.dragging = false));
  }

  #select(point) {
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    // the point will be selected
    this.selected = point;
  }

  #removePoint(point) {
    graph.removePoint(point);
    this.hovered = null;
    if (this.selected === point) {
      this.selected = null;
    }
  }

  display() {
    this.graph.draw(this.ctx);
    if (this.selected) {
      this.selected.draw(this.ctx, { outline: true });
    }
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
  }
}
