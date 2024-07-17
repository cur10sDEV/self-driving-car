const canvas = document.getElementById("myCanvas");
canvas.width = 300;

const ctx = canvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

animate();

function animate() {
  car.update();
  // setting height here will make sure the canvas remains full size even upon window change
  canvas.height = window.innerHeight;

  ctx.save();
  // moving the road so to give the illusion as if a drone is filming from top
  ctx.translate(0, -car.y + canvas.height * 0.7); // placing the car at safe distance to see the traffic ahead

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  // updates the scene based on refresh rate of the screen
  requestAnimationFrame(animate);
}
