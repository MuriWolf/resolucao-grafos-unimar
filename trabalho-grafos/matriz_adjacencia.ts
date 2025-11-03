import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process'

const r1 = readline.createInterface({ input: stdin, output: stdout });

interface AdjacencyList {
    [key: string]: string[];
}

type AdjacencyMatrix = number[][];

type VerticesList = string[];

interface VerticesDegree {
    [key: string]: {
        in: number,
        out: number ,
        total: number 
    }
}

class Graph {
    adjacencyList: AdjacencyList;
    adjacencyMatrix: AdjacencyMatrix;
    verticeList: VerticesList;
    isDirected: boolean;

    constructor(isDirected: boolean) {
        this.adjacencyList = {};
        this.verticeList = []; /**Lista de Vertices - String */
        this.adjacencyMatrix = []; /**Matriz de adjacencia - number */
        this.isDirected = isDirected;
    }

    
    insertVertex(vertex: string): void {
        if (this.verticeList.includes(vertex)) return;

        this.verticeList.push(vertex);

        const size = this.verticeList.length;   

        for(let i = 0; i < this.adjacencyMatrix.length; i++) {
            this.adjacencyMatrix[i].push(0);
        }

        
        const newRow = new Array(size).fill(0);
        this.adjacencyMatrix.push(newRow);
    }

    insertEdge(from: string, to: string): void {
        this.insertVertex(from);
        this.insertVertex(to);

        const i = this.verticeList.indexOf(from);
        const j = this.verticeList.indexOf(to);

        this.adjacencyMatrix[i][j] = 1;

        if (!this.isDirected && from != to) this.adjacencyMatrix[j][i] = 1;
    }  

    getNeighbors(vertex: string): string[] {
        if (! (this.verticeList.includes(vertex))) return [];

        const neighbors: string[] = [];
        const index = this.verticeList.indexOf(vertex);

        for (let j = 0; j < this.adjacencyMatrix[index].length; j++) {
            if (this.adjacencyMatrix[index][j] === 1) {
                neighbors.push(this.verticeList[j]);
            }
        }

        return neighbors;
    }

    getAdjacencyMatrix(): number[][] {
    const vertices = Object.keys(this.adjacencyList);
    const n = vertices.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

      for (let i = 0; i < n; i++) {
          for (const to of this.adjacencyList[vertices[i]]) {
             const j = vertices.indexOf(to);
             if (j !== -1) matrix[i][j] = 1;
          }
       }

       return matrix;
    }

    showVerticeNeighbors(vertex: string): string[] {
        let neighbors: string[] = this.getNeighbors(vertex);

        console.log(`Neighbors of vertex (${vertex}): ${neighbors.join(", ")}`);
        return neighbors;
    }

    showGraph(): void {
        
        //Cabeçalho
        let header = "  " + this.verticeList.join("  ");
        console.log(header);

        //Linhas da matriz
        for (let i = 0; i < this.adjacencyMatrix.length; i++) {
            let row = this.verticeList[i] + " ";
            row += this.adjacencyMatrix[i].join("  ");
            console.log(row);
        }
    }

    showAdjacencyMatrix(): void {
    const vertices = Object.keys(this.adjacencyList);
    const matrix = this.getAdjacencyMatrix();

    console.log("\nMatriz de Adjacência:");
    console.log("   " + vertices.join(" "));
       for (let i = 0; i < vertices.length; i++) {
         console.log(`${vertices[i]} [${matrix[i].join(" ")}]`);
       }
    }

    removeEdge(from: string, to: string): void {
        if (! (this.verticeList.includes(from)) || ! (this.verticeList.includes(to))) return;

        const i = this.verticeList.indexOf(from);
        const j = this.verticeList.indexOf(to);

        this.adjacencyMatrix[i][j] = 0;

        if (!this.isDirected) this.adjacencyMatrix[j][i] = 0;

    }

    removeVertex(vertexToRemove: string): void {
        if (! (this.verticeList.includes(vertexToRemove))) return;

        const indexToRemove = this.verticeList.indexOf(vertexToRemove);
        this.verticeList.splice(indexToRemove, 1);

        this.adjacencyMatrix.splice(indexToRemove, 1);
    }

    isThereEdge(from: string, to: string): boolean {
        if (!(this.verticeList.includes(from) || this.verticeList.includes(to))) return false;

        const i = this.verticeList.indexOf(from);
        const j = this.verticeList.indexOf(to);

        return this.adjacencyMatrix[i][j] === 1;
    }

    getVerticesDegree(): VerticesDegree {
        let verticesDegree: VerticesDegree = {};

        for (const vertex of this.verticeList) {
            if (!verticesDegree[vertex]) {
                verticesDegree[vertex] = { in: 0, out: 0, total: 0 };
            }
            const neighbors = this.getNeighbors(vertex);
            verticesDegree[vertex].out = neighbors.length;
            verticesDegree[vertex].total = neighbors.length;

            for (const neighbor of neighbors) {
                if (!verticesDegree[neighbor]) {
                    verticesDegree[neighbor] = { in: 0, out: 0, total: 0 };
                }
                verticesDegree[neighbor].in += 1;
                verticesDegree[neighbor].total += 1;
            }
        }

        for (const vertex in verticesDegree) {
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
        if (path.length < 2) return false;

        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];
            if (!this.isThereEdge(from, to)) {
                console.log(`Invalid path: no edge from ${from} to ${to}`);
                return false;
            }
        }
        console.log("Valid path");
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







/* Função para obter matriz de adjacencia 

getAdjacencyMatrix(): number[][] {
    const vertices = Object.keys(this.adjacencyList);
    const n = vertices.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

      for (let i = 0; i < n; i++) {
          for (const to of this.adjacencyList[vertices[i]]) {
             const j = vertices.indexOf(to);
             if (j !== -1) matrix[i][j] = 1;
          }
       }

       return matrix;
    }
*/
