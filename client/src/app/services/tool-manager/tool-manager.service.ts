import { EventEmitter, Injectable, Output } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { ColorService } from '../color-service/color.service';
import { KEY_CODE } from '../enum/key-code';
import { SELECT_PATTERN } from '../enum/select-pattern';
import { SELECT_TOOLS } from '../enum/select-tool';
import { ImageTransformationService } from '../image-transformation/image-transformation.service';
import { Coordinate } from '../interfaces/coordinate';
import { RotationService } from '../rotation/rotation.service';
import { SelectMovementService } from '../select-movement/select-movement.service';
import { DropperToolService } from '../tools/dropper-tool.service';
import { EllipseTool } from '../tools/ellipse-tool.service';
import { EraserToolService } from '../tools/eraser-tool.service';
import { FillToolService } from '../tools/fill-tool.service';
import { LineTool } from '../tools/line-tool.service';
import { PencilTool } from '../tools/pencil-tool.service';
import { PixelFillToolService } from '../tools/pixel-fill-tool.service';
import { PolygonTool } from '../tools/polygon-tool.service';
import { RectangleTool } from '../tools/rectangle-tool.service';
import { SelectionToolService } from '../tools/selection-tool.service';
import { SprayTool } from '../tools/spray-tool.service';
import { Tool } from '../tools/tool.service';

const INIT_POLYGON = 3;
const INIT_LINE_WIDTH = 3;

@Injectable({
    providedIn: 'root'
})

export class ToolManagerService {

    @Output() activeTool: EventEmitter<number> = new EventEmitter();
    toolOnUse: Tool;
    rectangleTool: RectangleTool;
    lineTool: LineTool;
    pencilTool: PencilTool;
    ellipseTool: EllipseTool;
    polygoneTool: PolygonTool;
    sprayTool: SprayTool;
    mouseIsOut: boolean;
    lineWidth: number;
    brushPattern: string;
    selectionTool: SelectionToolService;
    eraserTool: EraserToolService;
    drawingArea: DrawingAreaComponent;
    dropper: DropperToolService;
    filler: FillToolService;
    bucket: PixelFillToolService;

    constructor(imageTransformation: ImageTransformationService, colorService: ColorService,
                private selectMovement: SelectMovementService, private rotate: RotationService) {
        this.rectangleTool = new RectangleTool();
        this.lineTool = new LineTool();
        this.pencilTool = new PencilTool();
        this.ellipseTool = new EllipseTool();
        this.polygoneTool = new PolygonTool(INIT_POLYGON);
        this.sprayTool = new SprayTool();
        this.selectionTool = new SelectionToolService(this.selectMovement, this.rotate);
        this.eraserTool = new EraserToolService();
        this.dropper = new DropperToolService(imageTransformation, colorService);
        this.filler = new FillToolService();
        this.bucket = new PixelFillToolService(imageTransformation);
        this.lineWidth = INIT_LINE_WIDTH;
        this.toolOnUse = new Tool();
    }

    newPolyMatrix(): void {
        this.toolOnUse = new PolygonTool(ShapeDescription.nbSide);
    }

    onMouseEvent(event: MouseEvent, drawingArea: DrawingAreaComponent): boolean {

        let mouseX = Math.min(drawingArea.screenWidth - ShapeDescription.lineWidth / 2, event.offsetX);
        let mouseY = Math.min(drawingArea.screenHeight - ShapeDescription.lineWidth / 2, event.offsetY);

        this.mouseIsOut = false;
        if (drawingArea.screenWidth < event.offsetX) { this.mouseIsOut = true; }
        if (drawingArea.screenHeight < event.offsetY) { this.mouseIsOut = true; }

        if (this.toolOnUse instanceof PencilTool && ShapeDescription.texture !== 0) {
            mouseX = Math.min(drawingArea.screenWidth - ShapeDescription.lineWidth, event.offsetX);
            mouseY = Math.min(drawingArea.screenHeight - ShapeDescription.lineWidth, event.offsetY);
        }
        const coordinate: Coordinate = {x: mouseX, y: mouseY};
        this.selectMouse(event, coordinate, drawingArea);
        return false;
    }

    selectMouse(event: MouseEvent, coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
        switch (event.type) {
            case 'mousemove':
                this.toolOnUse.onMouseMove(coordinate, drawingArea, this.mouseIsOut);
                break;
            case 'mousedown':
                if (!this.mouseIsOut) {
                    if (event.button === 2) {
                        this.toolOnUse.onRightClick(coordinate, drawingArea);
                    }
                    this.toolOnUse.onMouseDown(coordinate, drawingArea);
                }
                break;
            case 'mouseup':
                if (!this.mouseIsOut) {
                this.toolOnUse.onMouseUp(coordinate, drawingArea);
                }
                break;
            case 'click':
                if (!this.mouseIsOut) {
                    this.toolOnUse.onMouseClick(coordinate, drawingArea);
                }
                break;
            case 'dblclick':
                if (!this.mouseIsOut) {
                    this.toolOnUse.onMouseDoubleClick(coordinate, drawingArea);
                }
                break;
            case 'mouseleave':
                this.toolOnUse.onMouseOut(drawingArea);
                break;
        }
    }

    selectTool(currentTool: SELECT_TOOLS): void {

        this.toolOnUse.finish(this.drawingArea);

        switch (currentTool) {
            case SELECT_TOOLS.RECTANGLE:
                this.toolOnUse = this.rectangleTool;
                break;
            case SELECT_TOOLS.LINE:
                this.toolOnUse = this.lineTool;
                break;
            case SELECT_TOOLS.PENCIL:
                this.toolOnUse = this.pencilTool;
                break;

            case SELECT_TOOLS.BRUSH:
                this.toolOnUse = this.pencilTool;
                break;

            case SELECT_TOOLS.POLYGONE:
                this.toolOnUse = this.polygoneTool;
                break;

            case SELECT_TOOLS.SPRAY:
                this.toolOnUse = this.sprayTool;
                break;

            case SELECT_TOOLS.ELLIPSE:
                this.toolOnUse = this.ellipseTool;
                break;
            case SELECT_TOOLS.FILL:
                this.toolOnUse = this.filler;
                break;

            case SELECT_TOOLS.ERASE:
                this.toolOnUse = this.eraserTool;
                ShapeDescription.erase = true;
                break;

            case SELECT_TOOLS.SELECTION:
                this.toolOnUse = this.selectionTool;
                break;
            case SELECT_TOOLS.DROPPER:
                this.toolOnUse = this.dropper;
                break;
            case SELECT_TOOLS.BUCKET:
                this.toolOnUse = this.bucket;
                break;
            default: this.toolOnUse = new Tool();
        }

        this.toolOnUse.start(this.drawingArea);

    }

    selectPattern(pattern: SELECT_PATTERN): void {

        switch (pattern) {
            case SELECT_PATTERN.PENCIL_PATTERN: this.brushPattern = 'pencilPattern';
                                                break;

            case SELECT_PATTERN.PATTERN1: this.brushPattern = 'pattern1';
                                          break;

            case SELECT_PATTERN.PATTERN2: this.brushPattern = 'pattern2';
                                          break;

            case SELECT_PATTERN.PATTERN3: this.brushPattern = 'pattern3';
                                          break;

            case SELECT_PATTERN.PATTERN4: this.brushPattern = 'pattern4';
                                          break;

            case SELECT_PATTERN.PATTERN5: this.brushPattern = 'pattern5';
                                          break;
        }

    }

    onKeyUpEvent(event: KeyboardEvent, drawingArea: DrawingAreaComponent): void {
        if (event.key === KEY_CODE.ESCAPE) {
          this.toolOnUse.onEscapeKey(drawingArea);
        }

        if (event.key === KEY_CODE.SHIFT) {
          this.toolOnUse.isShiftDown = false;
          this.toolOnUse.updateCoordinates(drawingArea);
        }

        if ((event.key === KEY_CODE.ARROW_UP) || (event.key === KEY_CODE.ARROW_DOWN)
        || (event.key === KEY_CODE.ARROW_LEFT) || (event.key === KEY_CODE.ARROW_RIGHT)) {
            this.toolOnUse.onKeyUp(event, drawingArea);
        }
        if (!event.altKey) {
            this.toolOnUse.isAltDown = false;
        }
    }

    onKeyDownEvent(event: KeyboardEvent, drawingArea: DrawingAreaComponent): void {

        if (event.key === KEY_CODE.BACKSPACE) {
          this.toolOnUse.onBackspaceKey(drawingArea);
        }
        if ((event.ctrlKey) && (event.key === KEY_CODE.A)) {
            this.toolOnUse.onControlAKey(drawingArea);
        }
        if (event.altKey) {
            event.preventDefault();
            this.toolOnUse.isAltDown = true;
        }
        if ((event.key === 'ArrowUp') || (event.key === 'ArrowDown') || (event.key === 'ArrowRight') || (event.key === 'ArrowLeft')) {
            event.preventDefault(); // prevents keys to affect scrollbar
            this.toolOnUse.onKeyPress(event, drawingArea);
        }

        if (event.key === KEY_CODE.SHIFT) {
            if (!this.toolOnUse.isShiftDown) {
                this.toolOnUse.isShiftDown = true;
                this.toolOnUse.updateCoordinates(drawingArea);
            }
        }
    }

    onWheelScroll(event: WheelEvent, drawingArea: DrawingAreaComponent): void {
        this.toolOnUse.onWheelScroll(event, drawingArea);
        this.toolOnUse.setupSelectionCoords({x: 0, y: 0}, drawingArea);
    }

    changeTool(option: number): void {
        this.activeTool.emit(option);
    }

    getEmittedTool(): EventEmitter<number> {
        return this.activeTool;
    }

}
