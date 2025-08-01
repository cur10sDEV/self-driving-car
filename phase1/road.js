class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    // defining borders for collision detection
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    // adding dash lines to lanes
    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      // lane dash lines width of Kpx and then Kpx gap (some value K)
      ctx.setLineDash([40, 40]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // draw borders
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
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
