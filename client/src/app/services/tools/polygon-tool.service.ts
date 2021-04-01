import { Injectable } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { Coordinate } from '../interfaces/coordinate';
import { Tool } from './tool.service';

const ORIGIN = 0;
const CENTER = 1;
const TEMP = 2;

const LEFT = -1;
const RIGHT = 1;

const TRIANGLE = 3;
const SQUARE = 4;
const HEXAGON = 6;
const DODECAGON = 10;

@Injectable({
    providedIn: 'root'
})

export class PolygonTool extends Tool {

    nbSide: number;
    matrix: Coordinate[];

    shapeWidth: number;
    shapeHeight: number;

    temporary: Coordinate[];

    ajustY: number;

    constructor(nbSide: number) {

        super();

        this.coordinates = [];
        this.matrix = [];
        this.temporary = [];

        this.nbSide = ShapeDescription.nbSide;

        this.temporary[CENTER] = {x: 0, y: 0};
        this.coordinates[0] = {x: 0, y: 0};

        this.setMatrix();

    }

    onMouseDown(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

        if (!this.isDrawing) {

            this.isDrawing = true;
            this.temporary[ORIGIN] = coordinate;

            drawingArea.getShape().shapeType = SELECT_SHAPE_TYPE.POLYGON;
            drawingArea.getShape().update();

        }

    }

    onMouseMove(coordinate: Coordinate, drawingArea: DrawingAreaComponent, mouseIsOut: boolean): void {

        if (this.isDrawing) {

            this.temporary[TEMP] = coordinate;
            this.updateCoordinates(drawingArea);

        }

    }

    onMouseUp(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

        this.setupSelectionCoords(coordinate, drawingArea);
        drawingArea.saveShape();
        this.isDrawing = false;

    }

    updateCoordinates(drawingArea: DrawingAreaComponent): void {

        const deltaX = Math.abs(this.temporary[TEMP].x - this.temporary[ORIGIN].x);
        const deltaY = Math.abs(this.temporary[TEMP].y - this.temporary[ORIGIN].y);
        const xDirection = this.temporary[ORIGIN].x > this.temporary[TEMP].x ? LEFT : RIGHT ;
        const yDirection = this.temporary[ORIGIN].y > this.temporary[TEMP].y ? LEFT : RIGHT ;

        this.temporary[CENTER].x = this.temporary[ORIGIN].x + deltaX / 2;
        this.temporary[CENTER].y = this.temporary[ORIGIN].y + deltaY / 2;

        const proportion = deltaX / this.shapeWidth < deltaY / this.shapeHeight ?
            deltaX / this.shapeWidth :
            deltaY / this.shapeHeight;

        for (let i = 0; i < this.nbSide; i++) {

            drawingArea.getShape().coordinates[i] = {
                x: (this.matrix[i].x + xDirection * this.shapeWidth / 2) * proportion + this.temporary[ORIGIN].x,
                y: (this.matrix[i].y + yDirection * this.shapeHeight / 2 + this.ajustY / 2) * proportion + this.temporary[ORIGIN].y
            };

        }

    }

    setupSelectionCoords(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
        const angle = (Math.PI * (this.nbSide - 2)) / (2 * this.nbSide);
        const borderTop = drawingArea.getShape().lineWidth / (Math.sin(angle));
        const lineWidth = drawingArea.getShape().lineWidth;
        let minX = drawingArea.getShape().coordinates[0].x;
        let maxX = minX;
        let minY = drawingArea.getShape().coordinates[0].y;
        let maxY = minY;

        for (let i = 1; i < this.nbSide; i++) {
            const newX = drawingArea.getShape().coordinates[i].x;
            const newY = drawingArea.getShape().coordinates[i].y;
            if (newX < minX) { minX = newX;
            } else if (newX > maxX) { maxX = newX; }
            if (newY < minY) { minY = newY;
            } else if (newY > maxY) { maxY = newY; }
        }
        minY -= borderTop / 2;
        if (this.nbSide % SQUARE === 0) { minX -= borderTop / 2; maxX += borderTop / 2; }
        if (this.nbSide === HEXAGON || this.nbSide === DODECAGON) { minX -= lineWidth / 2; maxX += lineWidth / 2; }
        if (this.nbSide % 2 === 1) {
            maxY += lineWidth / 2;
            if (this.nbSide === TRIANGLE) {
                minX -= lineWidth / ( 2 * Math.tan(angle));
                maxX += lineWidth / ( 2 * Math.tan(angle));
            } else {
                minX -= lineWidth / ( 2 * Math.sin(angle));
                maxX += lineWidth / ( 2 * Math.sin(angle));
            }
        } else { maxY += borderTop / 2;  }

        drawingArea.getShape().originCoords = [{x: minX, y: minY}, {x: maxX, y: maxY}];
        drawingArea.getShape().firstOriginCoords = [{x: minX, y: minY}, {x: maxX, y: maxY}];
    }

    setMatrix(): void {

        this.nbSide = ShapeDescription.nbSide;

        const deltaAngle = Math.PI * 2 / this.nbSide;
        let angle = - Math.PI / 2;

        const min: Coordinate = {x: 0, y: 0};
        const max: Coordinate = {x: 0, y: 0};

        for (let i = 0; i < this.nbSide; i++) {

            const x = Math.cos(angle);
            min.x = Math.min(min.x, x);
            max.x = Math.max(max.x, x);

            const y = Math.sin(angle);
            min.y = Math.min(min.y, y);
            max.y = Math.max(max.y, y);

            this.matrix.push({x, y});

            angle += deltaAngle;
        }

        this.matrix.push(this.matrix[0]);

        this.shapeWidth = max.x - min.x;
        this.shapeHeight = max.y - min.y;

        this.ajustY = this.nbSide % 2 === 1 ? 2 - this.shapeHeight : 0;

    }

}
