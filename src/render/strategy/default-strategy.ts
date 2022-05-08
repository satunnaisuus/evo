import CellVisitor from "../../game/cell-visitor";
import { Direction } from "../../game/direction";
import { EmptyCell } from "../../game/empty-cell";
import { MeatCell } from "../../game/meat-cell";
import { OrganismCell } from "../../game/organism-cell";
import { PlantCell } from "../../game/plant-cell";
import { WallCell } from "../../game/wall";
import StategyInterface from "../strategy-interface";

type Styles = {
    CELL_WALL_COLOR?: string,
    CELL_ORGANISM_COLOR?: string,
    CELL_ORGANISM_EYE_COLOR?: string,
    CELL_EMPTY_COLOR?: string,
    CELL_PLANT_COLOR?: string,
    CELL_MEAT_COLOR?: string,
}

export default class DefaultStrategy implements StategyInterface {
    constructor(
        protected context: CanvasRenderingContext2D,
        protected styles?: Styles
    ) {
        this.styles = Object.assign({
            CELL_WALL_COLOR: '#5f5f5f',
            CELL_ORGANISM_COLOR: '#0B5FA5',
            CELL_ORGANISM_EYE_COLOR: '#66A1D2',
            CELL_EMPTY_COLOR: '#000000',
            CELL_PLANT_COLOR: '#399200',
            CELL_MEAT_COLOR: '#FE7276',
        }, styles);
    }

    createVisitor(x: number, y: number, cellSize: number): CellVisitor {
        return {
            visitEmpty: (cell: EmptyCell) => {
                this.context.fillStyle = this.styles.CELL_EMPTY_COLOR;
                this.context.fillRect(x, y, cellSize, cellSize);
            },
            visitWall: (cell: WallCell) => {
                this.context.fillStyle = this.styles.CELL_WALL_COLOR;
                this.context.fillRect(x, y, cellSize, cellSize);
            },
            visitPlant: (cell: PlantCell) => {
                this.context.fillStyle = this.styles.CELL_PLANT_COLOR;
                this.context.fillRect(x, y, cellSize, cellSize);
            },
            visitMeat: (cell: MeatCell) => {
                this.context.fillStyle = this.styles.CELL_MEAT_COLOR;
                this.context.fillRect(x, y, cellSize, cellSize);
            },
            visitOrganism: (cell: OrganismCell) => {
                this.context.fillStyle = this.styles.CELL_ORGANISM_COLOR;
                this.context.fillRect(x, y, cellSize, cellSize);

                const eyeSize = cellSize / 3;

                let eyeOffset;

                switch (cell.getDirection()) {
                    case Direction.NORTH_WEST:
                        eyeOffset = [0, 0];
                        break;
                    case Direction.NORTH:
                        eyeOffset = [eyeSize, 0];
                        break;
                    case Direction.NORTH_EAST:
                        eyeOffset = [eyeSize * 2, 0];
                        break;
                    case Direction.SOUTH_WEST:
                        eyeOffset = [0, eyeSize * 2];
                        break;
                    case Direction.SOUTH:
                        eyeOffset = [eyeSize, eyeSize * 2];
                        break;
                    case Direction.SOUTH_EAST:
                        eyeOffset = [eyeSize * 2, eyeSize * 2];
                        break;
                    case Direction.WEST:
                        eyeOffset = [0, eyeSize];
                        break;
                    case Direction.EAST:
                        eyeOffset = [eyeSize * 2, eyeSize];
                        break;
                }

                this.context.fillStyle = this.styles.CELL_ORGANISM_EYE_COLOR;
                this.context.fillRect(x + eyeOffset[0], y + eyeOffset[1], eyeSize, eyeSize);
            }
        };
    }
}