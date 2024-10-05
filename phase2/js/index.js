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
graph.draw(canvasCtx);

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

  const success = graph.tryAddSegment(
    new Segment(graph.points[index1], graph.points[index2])
  );
  console.log(success);

  canvasCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  graph.draw(canvasCtx);
}
