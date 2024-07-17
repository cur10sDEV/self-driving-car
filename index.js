const canvas = document.getElementById("myCanvas");
canvas.width = 300;

const ctx = canvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 500, 30, 50);

animate();

function animate() {
  car.update();
  // setting height here will make sure the canvas remains full size even upon window change
  canvas.height = window.innerHeight;
  road.draw(ctx);
  car.draw(ctx);
  // updates the scene based on refresh rate of the screen
  requestAnimationFrame(animate);
}
