class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 200;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];

    this.rays.forEach((ray) => {
      this.readings.push(this.#getReading(ray, roadBorders, traffic));
    });
  }

  #getReading(ray, roadBorders, traffic) {
    let touches = [];
    roadBorders.forEach((border) => {
      const touch = getIntersection(ray[0], ray[1], border[0], border[1]);

      if (touch) {
        touches.push(touch);
      }
    });

    // get intersection for any point between the car and the traffic
    traffic.forEach((car) => {
      const poly = car.polygon;

      for (let i = 0; i < poly.length; i++) {
        const touch = getIntersection(
          ray[0],
          ray[1],
          poly[0],
          poly[(i + 1) % poly.length]
        );

        if (touch) {
          touches.push(touch);
        }
      }
    });

    if (touches.length === 0) return null;
    else {
      // getIntersection also returns the offset value alongwith intersection coordinates - x and y
      // the offset value represents how much far away the point of intersection is from the car's center
      const offsets = touches.map((t) => t.offset);
      const minOffset = Math.min(...offsets); // getting the min offset
      // return the closest intersection
      return touches.find((t) => t.offset === minOffset);
    }
  }

  #castRays() {
    this.rays = [];

    // getting the start and end coordinates for every ray
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      // starts from car
      const start = { x: this.car.x, y: this.car.y };
      // sin component for x, cos component for y and together will give the coordinates as to where the ray stops
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      // by default end of the ray goes full length
      let end = this.rays[i][1];
      // end coordinate where ray will end without intersection
      if (this.readings[i]) {
        end = this.readings[i];
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      // now the (yellow part) ray will end at intersection
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // now continue the ray after end intersection to visualize where the ray without intersection could have gone
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      // now the (yellow part) ray will end at intersection
      ctx.stroke();
    }
  }
}
