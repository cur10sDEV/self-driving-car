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
const viewport = new ViewPort(myCanvas);
const graphEditor = new GraphEditor(viewport, graph);

animate();

function animate() {
  canvasCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  canvasCtx.save();
  // zoom
  canvasCtx.translate(viewport.center.x, viewport.center.y);
  canvasCtx.scale(1 / viewport.zoom, 1 / viewport.zoom);
  // pan and drag
  const offset = viewport.getOffset();
  canvasCtx.translate(offset.x, offset.y);

  graphEditor.display();
  canvasCtx.restore();
  requestAnimationFrame(animate);
}
