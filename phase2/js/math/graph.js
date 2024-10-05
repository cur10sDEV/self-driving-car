// here points are vertices and segments are edges
// basically it shows the points of intersections of different roads (edges)
class Graph {
  constructor(points = [], segments = []) {
    this.points = points;
    this.segments = segments;
  }

  draw(ctx) {
    // draw segments on top of canvas
    for (const seg of this.segments) {
      seg.draw(ctx);
    }

    // draw points on top of canvas and on top of segments also (visual aid)
    for (const point of this.points) {
      point.draw(ctx);
    }
  }

  addPoint(newPoint) {
    this.points.push(newPoint);
  }
}
