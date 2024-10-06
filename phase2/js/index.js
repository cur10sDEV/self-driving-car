myCanvas.height = 800;
myCanvas.width = 800;

const canvasCtx = myCanvas.getContext("2d");

const p1 = new Point(200, 200);
const p2 = new Point(200, 600);
const p3 = new Point(600, 600);
const p4 = new Point(600, 200);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p2, p3);
const s3 = new Segment(p3, p4);
const s4 = new Segment(p4, p1);

const graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);
const graphEditor = new GraphEditor(myCanvas, graph);

animate();

function animate() {
  canvasCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  graphEditor.display();
  requestAnimationFrame(animate);
}

function addRandomPoint() {
  graph.tryAddPoint(
    new Point(
      Math.floor(Math.random() * myCanvas.width),
      Math.floor(Math.random() * myCanvas.height)
    )
  );

  canvasCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  graph.draw(canvasCtx);
}

function addRandomSegment() {
  // picking random points from the graph and adding a segment between them
  const index1 = Math.floor(Math.random() * graph.points.length);
  const index2 = Math.floor(Math.random() * graph.points.length);

  graph.tryAddSegment(new Segment(graph.points[index1], graph.points[index2]));

  canvasCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  graph.draw(canvasCtx);
}

function removeRandomSegment() {
  if (graph.segments.length === 0) {
    console.log("No segments!");
  }

  const index = Math.floor(Math.random() * graph.segments.length);
  graph.removeSegment(graph.segments[index]);

  canvasCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  graph.draw(canvasCtx);
}

function removeRandomPoint() {
  if (graph.points.length === 0) {
    console.log("No points!");
  }

  const index = Math.floor(Math.random() * graph.points.length);
  graph.removePoint(graph.points[index]);

  canvasCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  graph.draw(canvasCtx);
}

function removeAll() {
  graph.dispose();

  canvasCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  graph.draw(canvasCtx);
}
