import { Graph } from "./lista-adjacencia";

interface QueueItem {
    vertex: string,
    path: string[]
}

function bfs(graph: Graph, statingVertex: string): string[] {
  let verticesQueue: string[] = []; // push e shift
  let verticesVisited: string[] = [];

  if (graph.getNeighbors(statingVertex).length === 0) return []

  verticesQueue.push(statingVertex);
  while (verticesQueue.length > 0) {
    const vertexVisited = verticesQueue.shift();

    if (typeof vertexVisited === "string") {
      verticesVisited.push(vertexVisited);

      let neighbors = graph.getNeighbors(vertexVisited);

      neighbors.forEach((neighbor) => {
        if (
          !verticesVisited.includes(neighbor) &&
          !verticesQueue.includes(neighbor)
        ) {
          verticesQueue.push(neighbor);
        }
     });
    }
  }
  
  return verticesVisited;
}

function bfsShortestPath(graph: Graph, statingVertex: string, targetVertex: string): string[] {
  let queue: QueueItem[] = []; // push e shift
  let verticesVisited: string[] = [];

  // Caso não o ponto de início ou final não tenham vizinhos, não há caminho
  if (
    graph.getNeighbors(statingVertex).length === 0 ||
    graph.getNeighbors(targetVertex).length === 0
  ) return [];

  queue.push({ vertex: statingVertex, path: [statingVertex] });

  while (queue.length > 0) {
    const queueItemVisited = queue.shift();

    if (queueItemVisited != undefined) {

    if (targetVertex === queueItemVisited.vertex) return queueItemVisited.path;
      verticesVisited.push(queueItemVisited.vertex);

      let neighbors = graph.getNeighbors(queueItemVisited.vertex);

      neighbors.forEach((neighbor) => {
        if (
          !verticesVisited.includes(neighbor) &&
          !queue.some(i => i.path.includes(neighbor)) 
        ) {
          const newPath: string[] = queueItemVisited.path.concat([neighbor])
          queue.push({ vertex: neighbor, path: newPath });
        }
      });    
    }
  }

  return [];
}

let graph: Graph = new Graph(false);

graph.insertVertex("V1");
graph.insertVertex("V2");
graph.insertVertex("V3");
graph.insertVertex("V4");
graph.insertVertex("V5");
graph.insertVertex("V6");
graph.insertVertex("V7");
graph.insertVertex("V8");

graph.insertEdge("V1", "V2");
graph.insertEdge("V1", "V3");
graph.insertEdge("V1", "V6");

graph.insertEdge("V2", "V3");
graph.insertEdge("V2", "V6");
graph.insertEdge("V2", "V4");
graph.insertEdge("V2", "V7");

graph.insertEdge("V4", "V5");

graph.insertEdge("V5", "V6");
graph.insertEdge("V5", "V8");

graph.insertEdge("V6", "V7");

graph.insertEdge("V7", "V8");

// Resultado esperado: visitados = [v1,v2,v3,v6,v4,v7,v5,v8]

const vertices = bfsShortestPath(graph, "V1", "V8");
console.log(vertices);

const vertices2 = bfs(graph, "V1");
// console.log(vertices2);
