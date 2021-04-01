import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ShapeHandler } from 'src/app/classes/shape-handler';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { SELECT_FILTER_TYPE } from 'src/app/services/enum/filters';
import { SELECT_SHAPE_TYPE } from 'src/app/services/enum/shape-type';
import { GridService } from 'src/app/services/grid-service/grid.service';
import { SelectionToolService } from 'src/app/services/tools/selection-tool.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import { ShapeDescription } from '../../../classes/shape-description';
import { ColorService } from '../../../services/color-service/color.service';
import { InteractionFormDrawingService } from '../../../services/interaction-form-drawing/interaction-form-drawing.service';
import { ToolManagerService } from '../../../services/tool-manager/tool-manager.service';

@Component({
  selector: 'app-drawing-area',
  templateUrl: './drawing-area.component.html',
  styleUrls: ['./drawing-area.component.scss']
})

export class DrawingAreaComponent implements OnInit {

  @ViewChild('svgContainer', {static: false}) svgContainer: ElementRef;
  @ViewChild('canvas', {static: false}) canvas: ElementRef;

  screenWidth: number;
  screenHeight: number;
  backgroundColor: string;
  filter: SELECT_FILTER_TYPE = SELECT_FILTER_TYPE.NONE;
  gridToggle: boolean;
  newShapeStack: ShapeHandler[];
  newShapeLvl: number;

  constructor(public interactionService: InteractionFormDrawingService,
              private toolManager: ToolManagerService,
              private colorService: ColorService,
              private gridService: GridService,
              private undoRedoService: UndoRedoService,
              private clipBoard: ClipboardService) {
    this.gridToggle = false;
    this.newShapeStack = [];
    this.newShapeLvl = 0;
    this.newShapeStack[0] = new ShapeDescription();
    this.toolManager.drawingArea = this;
    this.backgroundColor = 'rgba(255,255,255,1)';
    this.filter = SELECT_FILTER_TYPE.NONE;
  }

  ngOnInit(): void {
    this.interactionService.currentWidth.subscribe((width: number) => {
      this.screenWidth = width;
    });
    this.interactionService.currentHeight.subscribe((height: number) => {
      this.screenHeight = height;
    });
    this.interactionService.currentBackgroundColor.subscribe((color: string) => {
      this.backgroundColor = color;
    });
    this.interactionService.currentShapeStack.subscribe((shapeStack: ShapeHandler[]) => {
      this.updateImage(shapeStack);
    });

    this.gridService.getEmittedValueGridToggle().subscribe((item: boolean) => this.gridToggle = item);
  }

  private updateImage(shapeStack: ShapeHandler[]): void {
    this.newShapeLvl = 0;
    this.newShapeStack = [];
    this.newShapeStack[0] = new ShapeDescription();
    for (const shapeHandler of shapeStack) {
      const temporary = shapeHandler as ShapeDescription;
      if ( temporary.shapeType !== SELECT_SHAPE_TYPE.MODIFICATION && temporary.shapeType !== SELECT_SHAPE_TYPE.SELECTION ) {
        this.clipBoard.times = 0;
        this.clipBoard.copyShape( temporary, this.getShape());
        this.saveShape();
      }
    }
    this.undoRedoService.floorLvl = this.newShapeLvl;
    this.undoRedoService.changePastIsEmpty();
    this.interactionService.saveShape(this.newShapeStack);
  }

  saveShape(): void {
    if ((this.newShapeStack[this.newShapeLvl] as ShapeDescription).coordinates.length > 0) {
      this.newShapeLvl++;
      this.newShapeStack[this.newShapeLvl] = new ShapeDescription();
      if (this.undoRedoService.pastIsEmpty) { this.undoRedoService.changePastIsEmpty(); }
      this.undoRedoService.resetFuture();
      this.interactionService.saveShape(this.newShapeStack);
    }
  }

  setModification(mod: ShapeModification): void {
    for (const shape of this.newShapeStack) {
      if (shape instanceof ShapeDescription) {
        shape.modificaton = mod;
      }
    }
  }

  getShape(): ShapeDescription {
    return this.newShapeStack[this.newShapeLvl] as ShapeDescription;
  }

  getDescriptionStack(removeLast: boolean): ShapeDescription[] {
    const description = [];
    for (const handler of this.newShapeStack) {
      if (handler instanceof ShapeDescription) {
        if (handler.fillColor !== 'none' && handler.strokeColor !== 'none') {
          description.push(handler as ShapeDescription);
        }
      }
    }
    if (removeLast) {
      description.pop();
    }
    return description;
  }

  newShape(shape: ShapeModification): void {
    if (shape.modifications.length > 0) {
      this.newShapeStack[this.newShapeLvl] = shape;
      this.newShapeLvl++;
      this.interactionService.saveShape(this.newShapeStack);
    }
    this.newShapeStack[this.newShapeLvl] = new ShapeDescription();
    this.undoRedoService.resetFuture();
  }

  onMouseEvent(event: MouseEvent): void {
    this.toolManager.onMouseEvent(event, this);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUpEvent(event: KeyboardEvent): void {
    this.toolManager.onKeyUpEvent(event, this);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDownEvent(event: KeyboardEvent): void {
    this.toolManager.onKeyDownEvent(event, this);
  }

  @HostListener('wheel', ['$event'])
  onWheelScroll(event: WheelEvent): void {
    this.toolManager.onWheelScroll(event, this);
  }

  getPrimaryColor(primary: boolean): string {
    return this.colorService.getRGBA(primary).slice(0);
  }

  undo(selection: SelectionToolService): void {
    if (this.newShapeLvl > this.undoRedoService.floorLvl ) {
      this.newShapeLvl--;
      this.undoRedoService.undo(this.newShapeStack, this.newShapeLvl, selection, this);
      this.interactionService.saveShape(this.newShapeStack);
    }
  }

  redo(selection: SelectionToolService): void {
    if (!this.undoRedoService.futureIsEmpty) {
      this.newShapeLvl++;
      this.undoRedoService.redo(this.newShapeStack, this.newShapeLvl, selection, this);
      this.interactionService.saveShape(this.newShapeStack);
    }
  }

  getSvgNodesString(): string {
    let svgNodeString = '';
    let svgs: HTMLCollection;
    svgs = this.svgContainer.nativeElement.children;
    const svgNodes: Node[] = [];
    for (let i = 0 ; i < svgs.length - 1 ; i++) {
      const elem: Element = svgs.item(i) as Element;
      elem.childNodes.forEach((node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE	) {
          node.childNodes.forEach((subNode: Node) => {
            svgNodes.push(subNode);
          });
        }
      });
    }
    const serializer = new XMLSerializer();
    svgNodes.forEach((svgNode: Node) => {
      svgNodeString += serializer.serializeToString(svgNode);
    });
    return svgNodeString;
  }
}
