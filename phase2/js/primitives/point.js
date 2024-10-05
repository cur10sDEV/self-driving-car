class Point {
  // x and y coordinates for every point on the map
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx, size = 18, color = "black") {
    const rad = size / 2; // calculating radius for circular points
    ctx.beginPath();
    ctx.fillStyle = color;
    // draw a circle at x and y
    ctx.arc(this.x, this.y, rad, 0, Math.PI * 2); // 2pi = 360 deg i.e. full circle
    ctx.fill();
  }

  equals(point) {
    return this.x === point.x && this.y === point.y;
  }
}
