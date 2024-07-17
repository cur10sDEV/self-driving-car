class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - this.width / 2;
    this.right = x + this.width / 2;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 0; i <= this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      // add dashes to middle lines
      if (i > 0 && i < this.laneCount) {
        // lane dash lines width of Kpx and then Kpx gap (some value K)
        ctx.setLineDash([40, 40]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
  }

  // upon changing the lane count to any even number(in this case) car is off-center
  // i.e., on top of the dashed lane line
  getLaneCenter(laneIndex) {
    // get lane width for every lane (all equal)
    const laneWidth = this.width / this.laneCount;
    const center =
      this.left +
      laneWidth / 2 +
      laneWidth * Math.min(laneIndex, this.laneCount - 1);

    return center;
  }
}
