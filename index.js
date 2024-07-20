const canvas = document.getElementById("myCanvas");
canvas.width = 300;

const ctx = canvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9, 6);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, true);

// add traffic - multiple cars
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, false, 3)];

// add random traffic
// for (let i = 0; i < 1000; i++) {
//   traffic.push(
//     new Car(
//       road.getLaneCenter(Math.floor(Math.random() * 1000000) % road.laneCount),
//       -100 - i * 100,
//       30,
//       50,
//       false,
//       3
//     )
//   );
// }

animate();

function animate() {
  // update traffic
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic); // passing the traffic so that car can interact with the traffic
  // setting height here will make sure the canvas remains full size even upon window change
  canvas.height = window.innerHeight;

  ctx.save();
  // moving the road so to give the illusion as if a drone is filming from top
  ctx.translate(0, -car.y + canvas.height * 0.7); // placing the car at safe distance to see the traffic ahead

  road.draw(ctx);
  // draw traffic
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx, "red");
  }
  car.draw(ctx, "blue");

  ctx.restore();
  // updates the scene based on refresh rate of the screen
  requestAnimationFrame(animate);
}
