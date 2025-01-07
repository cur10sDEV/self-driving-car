class Point {
  // x and y coordinates for every point on the map
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(point) {
    return this.x == point.x && this.y == point.y;
  }

  draw(
    ctx,
    { size = 18, color = "black", outline = false, fill = false } = {}
  ) {
    const rad = size / 2; // calculating radius for circular points
    ctx.beginPath();
    ctx.fillStyle = color;
    // draw a circle at x and y
    ctx.arc(this.x, this.y, rad, 0, Math.PI * 2); // 2pi = 360 deg i.e. full circle
    ctx.fill();

    // draw outline
    if (outline) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.arc(this.x, this.y, rad * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    }

    // draw fill
    if (fill) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, rad * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
    }
  }
}
