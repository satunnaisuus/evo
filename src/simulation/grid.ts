import { assertGreaterOrEqualThan, assertGreaterThan, assertLessThan } from "../common/asserts";
import { AbstractCell } from "./cell/abstract-cell";
import { CellFactory } from "./cell/cell-factory";
import { CellType } from "./types/cells";
import { GridLoopType } from "./types/grid-loop-type";

export class Grid {
    private cells: AbstractCell[][] = [];

    private cellIdMap: {[key: number]: AbstractCell} = {};

    private minerals: number[][] = [];

    private light: number[][] = [];

    constructor(
        private width: number,
        private height: number,
        private loop: GridLoopType,
        private cellFactory: CellFactory
    ) {
        assertGreaterThan(width, 0);
        assertGreaterThan(height, 0);

        for (let x = 0; x < width; x++) {
            this.cells[x] = [];
            this.minerals[x] = [];
            this.light[x] = [];

            for (let y = 0; y < height; y++) {
                this.cells[x][y] = cellFactory.createEmpty();
                this.minerals[x][y] = 100;
                this.light[x][y] = 100;
            }
        }
    }

    getLightLevel(x: number, y: number): number {
        return this.light[x][y];
    }

    getMineralsLevel(x: number, y: number): number {
        return this.minerals[x][y];
    }

    setLightLevel(x: number, y: number, level: number): void {
        this.light[x][y] = level;
    }

    setMineralsLevel(x: number, y: number, level: number): void {
        this.minerals[x][y] = level;
    }

    insert(x: number, y: number, cell: AbstractCell): void {
        assertLessThan(x, this.width);
        assertLessThan(y, this.height);
        assertGreaterOrEqualThan(x, 0);
        assertGreaterOrEqualThan(y, 0);

        this.cells[x][y] = cell;

        if (cell.getId()) {
            this.cellIdMap[cell.getId()] = cell;
        }
    }

    delete(x: number, y: number): void {
        const cell = this.cells[x][y];
        this.cells[x][y] = this.cellFactory.createEmpty();
        delete this.cellIdMap[cell.getId()]
    }

    getCell(x: number, y: number): AbstractCell {
        return this.cells[x][y];
    }

    find(id: number): AbstractCell {
        return this.cellIdMap[id];
    }

    getLoopMode(): GridLoopType {
        return this.loop;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    toArray(): AbstractCell[][] {
        return this.cells.map(l => l.slice());
    }

    serialize(): CellType[][] {
        return this.toArray().map((l) => l.map(c => c.serialize()));
    }
}