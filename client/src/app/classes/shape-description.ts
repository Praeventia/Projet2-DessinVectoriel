import { ColorService } from '../services/color-service/color.service';
import { SELECT_DRAWING_TYPE } from '../services/enum/drawing-type';
import { SELECT_SHAPE_TYPE } from '../services/enum/shape-type';
import { Coordinate } from '../services/interfaces/coordinate';
import { ShapeHandler } from './shape-handler';
import { ShapeModification } from './shape-modification';

const FREQUENCY_INIT = 20;

export class ShapeDescription extends ShapeHandler {

    static fillColor: string;
    static lineWidth: number;
    static strokeColor: string;
    static drawType: SELECT_DRAWING_TYPE;
    static dotRadius: number;
    static texture: number;

    static paint: boolean;
    static erase: boolean;
    static eraseUp: boolean;
    static red: boolean;

    static frequency: number;
    static nbSide: number;

    protected colorService: ColorService;

    origin: Coordinate;
    shiftOrigin: Coordinate;
    moveCoords: Coordinate;
    rotateAngle: number;
    shiftRotateAngle: number;
    shapeType: SELECT_SHAPE_TYPE;
    coordinates: Coordinate[];
    originCoords: Coordinate[];
    firstOriginCoords: Coordinate[];

    width: number;
    height: number;

    modificaton: ShapeModification;

    fillColor: string;
    strokeColor: string;
    drawType: SELECT_DRAWING_TYPE;
    dotRadius: number;
    texture: number;

    isRed: boolean;
    shapeClicked: boolean;

    constructor() {
        super();
        ShapeDescription.erase = false;
        ShapeDescription.paint = false;
        ShapeDescription.eraseUp = false;
        ShapeDescription.red = false;
        ShapeDescription.frequency = FREQUENCY_INIT;
        this.coordinates = [];
        this.originCoords = [];
        this.firstOriginCoords = [];
        this.update();
        this.isRed = false;
        this.fillColor = 'rgba(0,0,0,0)';
        this.lineWidth = 0;
        this.strokeColor = 'rgba(0,0,0,0)';
        this.dotRadius = 0;
        this.texture = 0;
        this.modificaton = new ShapeModification();
        this.origin = {x: 0, y: 0};
        this.shiftOrigin = {x: 0, y: 0};
        this.moveCoords = {x: 0, y: 0};
        this.rotateAngle = 0;
        this.shiftRotateAngle = 0;
    }

    update(): void {
        this.lineWidth = ShapeDescription.lineWidth;
        this.drawType = ShapeDescription.drawType;
        this.fillColor = ShapeDescription.fillColor;
        this.strokeColor = ShapeDescription.strokeColor;
        this.dotRadius = ShapeDescription.dotRadius;
        this.texture = ShapeDescription.texture;
    }

    updateFill(): void {
        this.fillColor = ShapeDescription.fillColor;
    }

    updateStroke(): void {
        this.strokeColor = ShapeDescription.strokeColor;
    }

    copy(copy: ShapeDescription): ShapeDescription {
        copy = new ShapeDescription();

        this.origin = copy.origin;
        this.width = copy.width ;
        this.height = copy.height;

        this.coordinates = copy.coordinates;

        this.modificaton = copy.modificaton;

        this.fillColor = copy.fillColor;
        this.strokeColor = copy.strokeColor;
        this.drawType = copy.drawType;
        this.dotRadius = copy.dotRadius;
        this.texture = copy.texture;

        this.isRed = false;

        return copy;
    }

}
