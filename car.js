class Car {
  // x and y coordinates as to where to place the car initially
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // to mimic the real world cars
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 4;
    this.maxRevSpeed = -2;
    this.friction = 0.05;
    this.angle = 0.0;
    this.damaged = false;

    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  // updates the car position and sensors upon change
  update(roadBorders) {
    // only move car if it is not damaged
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders);
    }
    // sensors will still work even after the damage
    this.sensor.update(roadBorders);
  }

  #assessDamage(roadBorders) {
    // check if any of the points of the car is intersected with any of the road borders
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    return false;
  }

  // getting corners of the polygon and using this will draw the polygon on the canvas
  #createPolygon() {
    const points = [];
    // divided by 2 because hypotenuse is from one corner to another but we want from car's center to corner
    const rad = Math.hypot(this.width, this.height) / 2;
    // tan(p/b) gives me the angle and no need to divide as the angle remains same
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  #move() {
    // up
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    // down
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    // only change speed if it's not already max speed
    if (this.speed >= this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed <= this.maxRevSpeed) {
      this.speed = this.maxRevSpeed;
    }

    // implement friction if car is moving (forward/reverse)
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    // if speed is very slow just stop the car
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    // left and right controls should be flipped when going in opposite directions (forward and reverse)
    // also car should not rotate (left and right) if it is at rest
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      // left
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }

      // right
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    // car should move in the direction where its front is pointing
    // -ve sign because going forward i.e., up on the canvas means y decrements and same for other three directions
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  // draw the car on the canvas
  draw(ctx) {
    if (this.damaged) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "black";
    }

    // draw the polygon across every polygon point
    ctx.beginPath();
    // move to first point
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    // loop through remaining points and draw
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    // now car can draw its own sensors
    this.sensor.draw(ctx);
  }
}
