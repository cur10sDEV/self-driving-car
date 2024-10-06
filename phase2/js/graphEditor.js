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
    });

    this.canvas.addEventListener("mousemove", (evt) => {
      const newPoint = new Point(evt.offsetX, evt.offsetY);
      this.hovered = getNearestPoint(newPoint, this.graph.points, 18);
    });
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
