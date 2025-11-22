import Graph from "./lista-adjacencia";

let graph1: Graph = new Graph(false);

graph1.insertVertex("V1");
graph1.insertVertex("V2");
graph1.insertVertex("V3");
graph1.insertVertex("V4");
graph1.insertVertex("V5");
graph1.insertVertex("V6");
graph1.insertVertex("V7");
graph1.insertVertex("V8");

graph1.insertEdge("V1", "V2");
graph1.insertEdge("V1", "V3");
graph1.insertEdge("V1", "V6");
graph1.insertEdge("V2", "V3");
graph1.insertEdge("V2", "V6");
graph1.insertEdge("V2", "V4");
graph1.insertEdge("V2", "V7");
graph1.insertEdge("V4", "V5");
graph1.insertEdge("V5", "V6");
graph1.insertEdge("V5", "V8");
graph1.insertEdge("V6", "V7");
graph1.insertEdge("V7", "V8");


// Doesn't have cycles 
let graph2: Graph = new Graph(false);

graph2.insertVertex("V1");
graph2.insertVertex("V2");
graph2.insertVertex("V3");
graph2.insertVertex("V4");
graph2.insertVertex("V5");

graph2.insertEdge("V1", "V2");
graph2.insertEdge("V2", "V3");
graph2.insertEdge("V3", "V4");
graph2.insertEdge("V3", "V5");

export {
  graph1,
  graph2
}
