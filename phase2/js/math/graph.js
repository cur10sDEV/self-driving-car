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

  containsPoint(point) {
    return this.points.find((p) => p.equals(point));
  }

  addPoint(newPoint) {
    this.points.push(newPoint);
  }

  // draw a new point only if there's no point there
  tryAddPoint(point) {
    if (!this.containsPoint(point)) {
      this.addPoint(point);
      return true;
    }
    return false;
  }

  containsSegment(segment) {
    return this.segments.find((s) => s.equals(segment));
  }

  addSegment(newSegment) {
    this.segments.push(newSegment);
  }

  tryAddSegment(segment) {
    // do not add segment if there's already a segment between the points
    // or if the points are the same (same point trying to connect to itself)
    if (!this.containsSegment(segment) && !segment.p1.equals(segment.p2)) {
      this.addSegment(segment);
      return true;
    }

    return false;
  }

  removeSegment(segment) {
    this.segments.splice(this.segments.indexOf(segment), 1);
  }

  removePoint(point) {
    const segmentsWithPoint = this.getSegmentsWithPoint(point);
    for (const seg of segmentsWithPoint) {
      this.removeSegment(seg);
    }
    this.points.splice(this.points.indexOf(point), 1);
  }

  getSegmentsWithPoint(point) {
    let segs = [];

    this.segments.forEach((seg) => {
      if (seg.includes(point)) {
        segs.push(seg);
      }
    });

    return segs;
  }

  dispose() {
    this.points.length = 0;
    this.segments.length = 0;
  }
}
