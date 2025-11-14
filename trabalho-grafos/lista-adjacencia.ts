import * as readline from 'node:readline/promises';
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

export class Graph {
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

        if (!this.isDirected && from != to) this.adjacencyList[to].push(from);
    }  

    getNeighbors(vertex: string): string[] {
        if (vertex in this.adjacencyList) return this.adjacencyList[vertex];
        return [];
    }

    showVerticeNeighbors(vertex: string): string[] {
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
        if (path.length == 0) return true;
        if (path.length == 1) return (path[0] in this.adjacencyList);
        
        for (let i=0; i < path.length-1; i++) {
            let edgeExists: boolean = this.isThereEdge(path[i], path[i+1]);
            
            if (!edgeExists) return false;
        }

        return true;
    }
}

async function createGraph(): Promise<Graph> {
    let isDirected: string | boolean = await r1.question("> Selecione se o grafo será direcionado (1-sim, 2-não): ");
    isDirected = isDirected == '1' ? true : false;

    return new Graph(isDirected);
}

function showMenu(): void {
    console.log(`
|-----------------MENU-----------------|
|  1. Mostrar grafo                    |
|  2. Insertir vertice                 |  
|  3. Inserir aresta                   |
|  4. Remover vertice                  |
|  5. Remover aresta                   |
|  6. Verificar se existe aresta       |
|  7. Mostrar vizinhos de aresta       |
|  8. Mostrar graus dos vertices       |
|  9. Verificar se caminho é válido    |
|  0. Sair                             |
|--------------------------------------|`);
}

async function main(): Promise<void> {
    var isProgramRunning: boolean = true;

    try {
        let graph: Graph = await createGraph();

        while (isProgramRunning) {
            let vertexSelectedByUser: string;
            let vertexFromSelectedByUser: string;
            let vertexToSelectedByUser: string;
            let pathSelectedByUser: string | string[];

            showMenu();
            const optionSelectedByUser = await r1.question("> Informe a ação desejada: ");
             
            switch (optionSelectedByUser) {
                case '1':
                    graph.showGraph();
                    break;
                case '2':
                    vertexSelectedByUser = await r1.question("> Informe o vertice a inserir: ");
                    graph.insertVertex(vertexSelectedByUser);
                    break;
                 case '3':
                    vertexFromSelectedByUser = await r1.question("> Informe o vertice origem: ");
                    vertexToSelectedByUser = await r1.question("> Informe o vertice destino: ");
                    graph.insertEdge(vertexFromSelectedByUser, vertexToSelectedByUser);
                    break;
                 case '4':
                    vertexSelectedByUser = await r1.question("> Informe o vertice a remover: ");
                    graph.removeVertex(vertexSelectedByUser);
                    break;
                 case '5':
                    vertexFromSelectedByUser = await r1.question("> Informe o vertice origem: ");
                    vertexToSelectedByUser = await r1.question("> Informe o vertice destino: ");
                    graph.removeEdge(vertexFromSelectedByUser, vertexToSelectedByUser);
                    break;
                 case '6':
                    vertexFromSelectedByUser = await r1.question("> Informe o vertice origem: ");
                    vertexToSelectedByUser = await r1.question("> Informe o vertice destino: ");
                    console.log(graph.isThereEdge(vertexFromSelectedByUser, vertexToSelectedByUser));
                    break;
                 case '7':
                    vertexSelectedByUser = await r1.question("> Informe o vertice: ");
                    graph.showVerticeNeighbors(vertexSelectedByUser);
                    break;
                case '8':
                    graph.showVerticesDegree();
                    break;
                case '9':
                    pathSelectedByUser = await r1.question("> Informe o caminho no seguinte formato (V1,V2,V3...Vn): ");
                    pathSelectedByUser = pathSelectedByUser.replace(" ", "").split(",");

                    if (pathSelectedByUser?.length) console.log(graph.isPathValid(pathSelectedByUser));
                    break;
                case '0':
                    console.log("Au revoir...");
                    
                    isProgramRunning = false;
                    break;
                default:
                    console.log("Ação não definida");
                    break;
            }
        }    
    } catch (error) {
        console.error(error);
    }
}

main();

