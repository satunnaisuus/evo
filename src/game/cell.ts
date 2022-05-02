import CellContext from "./cell-context";
import CellVisitor from "./cell-visitor";

export abstract class Cell {
    abstract visit(visitor: CellVisitor): void;

    update(context: CellContext): void {
        
    }

    isStatic(): boolean {
        return true;
    }

    isEmpty(): boolean {
        return false;
    }
}