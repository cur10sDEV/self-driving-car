class World {
  constructor(graph, roadWidth = 125, roadRoundness = 10) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;

    this.envelopes = [];
    this.roadBorders = [];

    this.generate();
  }

  generate() {
    // envelopes for segments(roads)
    this.envelopes.length = 0;
    for (const seg of this.graph.segments) {
      this.envelopes.push(
        new Envelope(seg, this.roadWidth, this.roadRoundness)
      );
    }

    // finding union between segments
    this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
  }

  draw(ctx) {
    // draw roads
    for (const env of this.envelopes) {
      env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
    }
    // draw segments as dashed lines on the road
    for (const seg of this.graph.segments) {
      seg.draw(ctx, { color: "white", width: 4, dash: [20, 20] });
    }
    // draw road borders
    for (const seg of this.roadBorders) {
      seg.draw(ctx, { color: "white", width: 4 });
    }
  }
}
