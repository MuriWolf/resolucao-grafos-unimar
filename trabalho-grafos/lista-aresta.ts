import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process'

const r1 = readline.createInterface({ input: stdin, output: stdout });

type Edge = [string, string];

type EdgeList = Edge[];


interface VerticesDegree {
    [key: string]: {
        in: number,
        out: number ,
        total: number 
    }
}

class Graph {
    vertices: Set<string> = new Set();
    edgeList: EdgeList;
    isDirected: boolean;

    constructor(isDirected: boolean) {
        this.edgeList = [];
        this.isDirected = isDirected;
    }

    insertVertex(vertex: string): void {
        this.vertices.add(vertex);
    }

    insertEdge(from: string, to: string): void {
        this.insertVertex(from);
        this.insertVertex(to);
        this.edgeList.push([from, to]);

        if (!this.isDirected && from != to) {
            this.edgeList.push([to, from]);
        }
    }  

    getNeighbors(vertex: string): string[] {
        let neighbors: string[] = [];

        for (const [from, to] of this.edgeList) {
            if (from === vertex && to !== vertex) {
                neighbors.push(to);
            }
        }

        return neighbors;
    }

   

    showVerticeNeighbors(vertex: string): string[] {
        let neighbors: string[] = this.getNeighbors(vertex);

        console.log(`Neighbors of vertex (${vertex}): ${neighbors.join(", ")}`);
        return neighbors;
    }

    showGraph(): void {
        console.log("Vertex and edges");
        for (const [from, to] of this.edgeList) {
            console.log(`(${from}) -> (${to})`);
        }
    }


    removeEdge(from: string, to: string): void {
        this.edgeList = this.edgeList.filter(([vFrom, vTo]) => !(vFrom === from && vTo === to));

        if (!this.isDirected) {
            this.edgeList = this.edgeList.filter(([vFrom, vTo]) => !(vFrom === to && vTo === from));
        }
    }

    removeVertex(vertexToRemove: string): void {
        this.edgeList = this.edgeList.filter(([from, to]) => from !== vertexToRemove && to !== vertexToRemove);
        
    }

    isThereEdge(from: string, to: string): boolean {
        for (const [vFrom, vTo] of this.edgeList) {
            if (vFrom === from && vTo === to) return true;
        }

        return false;
    }

    getVerticesDegree(): VerticesDegree {
        let verticesDegree: VerticesDegree = {}; 

        for (const [from, to] of this.edgeList) {
            if (!(from in verticesDegree)) {
                verticesDegree[from] = { in: 0, out: 0, total: 0 };
            }
            if (!(to in verticesDegree)) {
                verticesDegree[to] = { in: 0, out: 0, total: 0 };
            }
            verticesDegree[from].out += 1;
            verticesDegree[to].in += 1;
            verticesDegree[from].total += 1;
            verticesDegree[to].total += 1;
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
        if (path.length == 1) {
            for (const [from, to] of this.edgeList) {
                if (from === path[0] || to === path[0]) return true;
            }
            return false;
        }
        for (let i = 0; i < path.length - 1; i++) {
            let edgeExists: boolean = false;
            for (const [from, to] of this.edgeList) {
                if (from === path[i] && to === path[i + 1]) {
                    edgeExists = true;
                    break;
                }
            }
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

export default Graph;