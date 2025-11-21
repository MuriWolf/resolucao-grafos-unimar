import { graph1 } from "./graph-examples";
import { Graph } from "./lista-adjacencia";

function dfs(graph: Graph, statingVertex: string): string[] {
  let verticesQueue: string[] = []; // push e pop
  let verticesVisited: string[] = [];

  if (graph.getNeighbors(statingVertex).length === 0) return []

  verticesQueue.push(statingVertex);
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

const vertices2 = dfs(graph1 , "V1");
console.log(vertices2);
