class Envelope {
  constructor(skeleton, width, roundness = 1) {
    this.skeleton = skeleton;
    this.poly = this.#generatePolygon(width, roundness);
  }

  #generatePolygon(width, roundness) {
    const { p1, p2 } = this.skeleton;

    const radius = width / 2; // centered around segment
    const alpha = angle(subtract(p1, p2));
    // we need angles with offset 90*
    const alpha_cw = alpha + Math.PI / 2; // clockwise
    const alpha_ccw = alpha - Math.PI / 2; // counter clockwise
    // offsets - these points will be used to create polygon
    // i.e., envelope surrounding the points with rounded corners
    const points = [];
    const step = Math.PI / Math.max(1, roundness);
    // so that i reaches the end without exceeding it before the final point - floating point numbers problem
    const eps = step / 2;
    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p1, i, radius));
    }
    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p2, Math.PI + i, radius));
    }

    // create a new polygon with these points
    return new Polygon(points);
  }

  draw(ctx, options) {
    this.poly.draw(ctx, options);
  }
}
