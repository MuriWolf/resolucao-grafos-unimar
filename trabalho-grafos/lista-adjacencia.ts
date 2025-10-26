import * as readline from 'node:readline';
import { stdin, stdout } from 'node:process'

const r1 = readline.createInterface({ input: stdin, output: stdout });

interface AdjacencyList {
    [key: string]: string[];
}

interface VerticesDegree {
    [key: string]: {
        in: number,
        out: number ,
        total: number 
    }
}

class Graph {
    adjacencyList: AdjacencyList;
    isDirected: boolean;

    constructor(isDirected: boolean) {
        this.adjacencyList = {};
        this.isDirected = isDirected;
    }

    insertVertex(vertex: string): void {
        if (!(vertex in this.adjacencyList)) this.adjacencyList[vertex] = [];
    }

    insertEdge(from: string, to: string): void {
        if (!(from in this.adjacencyList)) this.insertVertex(from);
        if (!(to in this.adjacencyList)) this.insertVertex(to);

        this.adjacencyList[from].push(to);

        if (!this.isDirected) this.adjacencyList[to].push(from);
    }  

    getNeighbors(vertex: string): string[] {
        if (vertex in this.adjacencyList) return this.adjacencyList[vertex];
        return [];
    }

    showNeighbors(vertex: string): string[] {
        let neighbors: string[] = this.getNeighbors(vertex);

        console.log(`Neighbors of vertex (${vertex}): ${neighbors.join(", ")}`);
        return neighbors;
    }

    showGraph(): void {
        console.log("Vertex and edges");
        for (const [vertex, edges] of Object.entries(this.adjacencyList)) {
            console.log(`(${vertex}): ${edges.join(", ")}`);
        }
    }

    removeEdge(from: string, to: string): void {
        if (!(from in this.adjacencyList) || !(to in this.adjacencyList)) return;

        this.adjacencyList[from] = this.adjacencyList[from].filter(e => e != to);

        if (!this.isDirected) this.adjacencyList[to] = this.adjacencyList[to].filter(e => e != from);
    }

    removeVertex(vertexToRemove: string): void {
        if (!(vertexToRemove in this.adjacencyList)) return;

        delete this.adjacencyList[vertexToRemove];

        for (const [vertex, _] of Object.entries(this.adjacencyList)) {
            this.adjacencyList[vertex] = this.adjacencyList[vertex].filter(e => e != vertexToRemove);
        }
    }

    isThereEdge(from: string, to: string): boolean {
        if (!(from in this.adjacencyList)) return false;

        return this.adjacencyList[from].includes(to);
    }

    getVerticesDegree(): VerticesDegree {
        let verticesDegree: VerticesDegree = {}; 

        for (const [vertex, _] of Object.entries(this.adjacencyList)) {
            verticesDegree[vertex] = { in: 0, out: 0, total: 0 };
            verticesDegree[vertex].out = this.adjacencyList[vertex].length;

            for (const [innerVertex, _] of Object.entries(this.adjacencyList)) {
                if (innerVertex === vertex) continue;

                let vertexAsNeighborCount = this.adjacencyList[innerVertex].filter(v => v === vertex).length;
                verticesDegree[vertex].in += vertexAsNeighborCount;
            } 

            verticesDegree[vertex].total = verticesDegree[vertex].in + verticesDegree[vertex].out;
        }

        return verticesDegree;
    }

    showVerticesDegree(): void {
       let degrees: VerticesDegree = this.getVerticesDegree();

       for (const [vertex, degree] of Object.entries(degrees)) {
            console.log(`vertex (${vertex}), in: ${degree.in}, out: ${degree.out}, total: ${degree.total}`);
        }
    }

    isPathValid(path: string[]): boolean {
        if (path.length <= 1) return true;
        
        for (let i=0; i < path.length-1; i++) {
            let edgeExists: boolean = this.isThereEdge(path[i], path[i+1]);
            
            if (!edgeExists) return false;
        }

        return true;
    }
}

async function main(): Promise<void> {
    let graph = new Graph(true);

    await r1.question("What ", (answer) => {
        console.log("your anwser: " + answer);
    })

    graph.insertVertex("A");
    graph.insertVertex("B");
    graph.insertVertex("C");

    graph.insertEdge("A", "B");
    graph.insertEdge("A", "C");

    graph.insertEdge("C", "B");

    graph.showNeighbors("A");

    graph.showGraph();

    graph.showVerticesDegree();

    console.log(graph.isPathValid(["A", "C", "B"]));
}

main();

