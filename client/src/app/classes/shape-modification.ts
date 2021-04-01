import { SELECT_SHAPE_TYPE } from '../services/enum/shape-type';
import { ShapeDescription } from './shape-description';
import { ShapeHandler } from './shape-handler';

export class ShapeModification extends ShapeHandler {

    modifications: [ShapeDescription, string, string, ShapeDescription?][];

    constructor() {
        super();
        this.modifications = [];
        this.shapeType = SELECT_SHAPE_TYPE.MODIFICATION;
    }

}
