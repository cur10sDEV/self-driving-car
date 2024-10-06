class GraphEditor {
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.graph = graph;

    this.ctx = this.canvas.getContext("2d");

    this.selected = null;
    this.hovered = null;

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousedown", (evt) => {
      // if it is a right click delete the hovered point
      if (evt.button === 2) {
        if (this.hovered) {
          this.graph.removePoint(this.hovered);
        }
      }

      // if it is a left click
      if (evt.button === 0) {
        const newPoint = new Point(evt.offsetX, evt.offsetY);
        // check if new point is on top of another point
        if (this.hovered) {
          // existing point will be selected
          this.selected = this.hovered;
          return;
        }

        // new point will be added to position of mouse pointer
        this.graph.addPoint(newPoint);
        // the new point will automatically be selected
        this.selected = newPoint;
      }
    });

    this.canvas.addEventListener("mousemove", (evt) => {
      const newPoint = new Point(evt.offsetX, evt.offsetY);
      this.hovered = getNearestPoint(newPoint, this.graph.points, 18);
    });

    // disable context menu on right click
    this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
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
