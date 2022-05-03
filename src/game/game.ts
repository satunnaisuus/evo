import CellContext from "./cell-context";
import CellFactory from "./cell-factory";
import Grid from "./grid";
import { Size } from "./size";

export default class Game {
    private step = 0;

    private grid: Grid;

    constructor(size: Size, private cellFactory: CellFactory) {
        this.grid = new Grid(size, cellFactory);
    }

    generatePlants(): void {
        const countEmpty = this.grid.countEmpty();

        if (countEmpty === 0) {
            return;
        }

        const chance = this.grid.countEmpty() / this.grid.getSize().getCellCount() / 100;

        for (const {x, y, cell} of this.grid) {
            if (cell.isEmpty() && Math.random() < chance) {
                this.grid.insert(x, y, this.cellFactory.createPlant());
            }
        }
    }

    update(): void {
        this.generatePlants();

        for (const {x, y, cell} of this.grid) {
            if (! cell.isStatic()) {
                cell.update(
                    new CellContext(this.grid, x, y, this.cellFactory)
                );
            }
        }

        this.step++;
    }

    getGrid(): Grid {
        return this.grid;
    }

    getStep(): number {
        return this.step;
    }
}