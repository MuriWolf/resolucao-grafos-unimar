import { graph1, graph2 } from "./graph-examples";
import Graph from "./lista-adjacencia";

interface QueueItem {
    vertex: string,
    parent: string | undefined
}

function dfs(graph: Graph, startingVertex: string): string[] {
  let verticesQueue: string[] = []; // push e pop
  let verticesVisited: string[] = [];

  if (graph.getNeighbors(startingVertex).length === 0) return []

  verticesQueue.push(startingVertex);
  while (verticesQueue.length > 0) {
    const vertexVisited = verticesQueue.pop();

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

function searchCycle(graph: Graph, startingVertex: string): string {
  let verticesQueue: QueueItem[] = []; // push e pop
  let verticesVisited: string[] = [];

  if (graph.getNeighbors(startingVertex).length === 0) return "Nenhum ciclo foi encontrado.";

  verticesQueue.push({ vertex: startingVertex, parent: undefined });
  while (verticesQueue.length > 0) {
    const vertexVisited: QueueItem | undefined = verticesQueue.pop();

    if (vertexVisited?.vertex) {
      verticesVisited.push(vertexVisited.vertex);

      let neighbors = graph.getNeighbors(vertexVisited.vertex);

      for (const neighbor of neighbors) {
        if (
          !verticesQueue.some(v => v.vertex == neighbor) &&
          !verticesVisited.includes(neighbor)
        ) {
          verticesQueue.push({ vertex: neighbor, parent: vertexVisited.vertex });
        } else if (neighbor != vertexVisited.parent) {
          return "Ciclo foi detectado.";
        }
      }
    }
  }

  return "Nenhum ciclo encontrado.";
}

// dfs(graph1 , "V1");
// console.log(vertices);

const graphHasCycle = searchCycle(graph1, "V4"); // yeah, is does :D
console.log(graphHasCycle);

const graphHasCycle2 = searchCycle(graph2, "V1"); // sorry, but, nope :(
console.log(graphHasCycle2);

