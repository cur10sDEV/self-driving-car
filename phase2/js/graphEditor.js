class GraphEditor {
  constructor(viewport, graph) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.graph = graph;

    this.ctx = this.canvas.getContext("2d");

    this.selected = null; // selected point
    this.hovered = null; // hovered point
    this.dragging = false; // if is dragging or not
    this.mouse = null; // current mouse position

    this.#addEventListeners();
  }

  #addEventListeners() {
    // Note: binding this to event handlers because their `this` refers to the canvas
    this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));

    // disable context menu on right click
    this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
    // remove dragging upon release of the mouse button
    this.canvas.addEventListener("mouseup", () => (this.dragging = false));
  }

  #handleMouseMove(evt) {
    this.mouse = this.viewport.getMouse(evt, true); // get mouse point based on viewport's zoom and drag
    this.hovered = getNearestPoint(
      this.mouse,
      this.graph.points,
      10 * this.viewport.zoom
    );
    // gets dragged along with mouse pointer
    if (this.dragging == true) {
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }

  #handleMouseDown(evt) {
    if (evt.button == 2) {
      // remove selection upon right click
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        // deletes hovered point if there's no selected point
        this.#removePoint(this.hovered);
      }
    }

    // if it is a left click
    if (evt.button == 0) {
      // this.mouse = this.viewport.getMouse(evt);
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
  }

  #select(point) {
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    // the point will be selected
    this.selected = point;
  }

  #removePoint(point) {
    this.graph.removePoint(point);
    this.hovered = null;
    if (this.selected == point) {
      this.selected = null;
    }
  }

  // deletes graph and resets the graph editor
  dispose() {
    this.graph.dispose();
    this.selected = null;
    this.hovered = null;
  }

  display() {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      // select if hovering over a point or else follow mouse movement and draw segment
      const intent = this.hovered ? this.hovered : this.mouse;
      new Segment(this.selected, intent).draw(ctx, { dash: [3, 3] }); // dash[0] - dash line size, dash[1] - gap size
      this.selected.draw(this.ctx, { outline: true });
    }
  }
}
