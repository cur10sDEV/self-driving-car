class Envelope {
  constructor(skeleton, width) {
    this.skeleton = skeleton;
    this.poly = this.#generatePolygon(width);
  }

  #generatePolygon(width) {
    const { p1, p2 } = this.skeleton;

    const radius = width / 2; // centered around segment
    const alpha = angle(difference(p1, p2));
    // we need angles with offset 90*
    const alpha_cw = alpha + Math.PI / 2; // clockwise
    const alpha_ccw = alpha - Math.PI / 2; // counter clockwise
    // offsets - these points will be used to create polygon i.e., envelope surrounding the points
    const p1_ccw = translate(p1, alpha_ccw, radius);
    const p2_ccw = translate(p2, alpha_ccw, radius);
    const p2_cw = translate(p2, alpha_cw, radius);
    const p1_cw = translate(p1, alpha_cw, radius);

    // create a new polygon with these points
    return new Polygon([p1_ccw, p2_ccw, p2_cw, p1_cw]);
  }

  draw(ctx) {
    this.poly.draw(ctx);
  }
}
