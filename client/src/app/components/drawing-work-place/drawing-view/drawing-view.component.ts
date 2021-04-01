import { Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import { faClone, faCog, faCopy, faCut, faFileDownload, faFileExport, faHandRock, faInfoCircle, faPaintRoller,
        faPaste, faPencilRuler, faRedo, faShapes, faTrash, faUndo, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { SELECT_DRAWING_TYPE } from 'src/app/services/enum/drawing-type';
import { SELECT_FILE_TYPE } from 'src/app/services/enum/file-type';
import { SELECT_FILTER_TYPE } from 'src/app/services/enum/filters';
import { SELECT_NAVBAR } from 'src/app/services/enum/select-nav-bar';
import { ImageTransformationService } from 'src/app/services/image-transformation/image-transformation.service';
import { InteractionFormDrawingService } from 'src/app/services/interaction-form-drawing/interaction-form-drawing.service';
import { SelectMovementService } from 'src/app/services/select-movement/select-movement.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import { ColorService } from '../../../services/color-service/color.service';
import { SELECT_TOOLS } from '../../../services/enum/select-tool';
import { ModalWindowService } from '../../../services/modal-window/modal-window.service';
import { ToolManagerService } from '../../../services/tool-manager/tool-manager.service';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';

@Component({
  selector: 'app-drawing-view',
  templateUrl: './drawing-view.component.html',
  styleUrls: ['./drawing-view.component.scss']
})

export class DrawingViewComponent implements OnInit {

  @ViewChild('drawingArea', {static: false}) drawingArea: DrawingAreaComponent;

  protected pushActive: boolean;
  protected undoIsEmpty: boolean;
  protected redoIsEmpty: boolean;
  protected shapeStackIsEmpty: boolean;

  constructor( private modal: ModalWindowService,
               private color: ColorService,
               private toolManager: ToolManagerService,
               private imageTransformation: ImageTransformationService,
               private undoRedoService: UndoRedoService,
               private renderer: Renderer2,
               private clipboard: ClipboardService,
               private selectionMovement: SelectMovementService,
               private interactionService: InteractionFormDrawingService
              ) {
                 this.pushActive = false;
                 this.undoIsEmpty = true;
                 this.redoIsEmpty = true;
                 this.shapeStackIsEmpty = true;
  }

  protected faPaintRoller: IconDefinition = faPaintRoller;
  protected faPencilRuler: IconDefinition = faPencilRuler;
  protected faHandRock: IconDefinition = faHandRock;
  protected faUndo: IconDefinition = faUndo;
  protected faRedo: IconDefinition = faRedo;
  protected faInfoCircle: IconDefinition = faInfoCircle;
  protected faCog: IconDefinition = faCog;
  protected faShapes: IconDefinition = faShapes;
  protected faCopy: IconDefinition = faCopy;
  protected faFileSave: IconDefinition = faFileExport;
  protected faFileDownload: IconDefinition = faFileDownload;
  protected faCut: IconDefinition = faCut;
  protected faPaste: IconDefinition = faPaste;
  protected faClone: IconDefinition = faClone;
  protected faTrash: IconDefinition = faTrash;

  protected activeNavBar: SELECT_NAVBAR;
  protected activeIcon: IconDefinition = faPencilRuler;
  protected activeShape: IconDefinition = faShapes;

  ngOnInit(): void {
    this.undoRedoService.getEmittedValuePastIsEmpty().subscribe((item: boolean) => this.undoIsEmpty = item );
    this.undoRedoService.getEmittedValueFutureIsEmpty().subscribe((item: boolean) => this.redoIsEmpty = item);
    this.selectionMovement.getEmittedValueShapeStackEmpty().subscribe((item: boolean) => this.shapeStackIsEmpty = item );
  }

  openConfirmationModal(): void {
    if (this.drawingArea.newShapeLvl === 0) {
      this.modal.openNewDrawModal();
    } else if (!this.modal.isOpen)  {
      this.modal.openConfirmationModal();
     }
  }

  openNewDrawingForm(): void {
    if (!this.modal.isOpen) {
      this.modal.openNewDrawModal();
    }
  }

  openNavTools(): void {
    this.activeNavBar = SELECT_NAVBAR.NAV_TOOLS;
    this.pushActive = true;
  }

  selector(): void {
    this.activeNavBar = SELECT_NAVBAR.NAV_SELECTOR;
    this.toolManager.selectTool(SELECT_TOOLS.SELECTION);
    ShapeDescription.drawType = SELECT_DRAWING_TYPE.SELECTION;
    this.pushActive = false;
    this.toolManager.changeTool(SELECT_TOOLS.SELECTION);
  }

  shape(): void {
    this.activeNavBar = SELECT_NAVBAR.NAV_SHAPES;
    this.pushActive = true;
  }

  text(): void {
    this.activeNavBar = SELECT_NAVBAR.NAV_TEXT;
    this.pushActive = false;
  }

  undo(): void {
    this.drawingArea.undo(this.toolManager.selectionTool);
  }

  redo(): void {
    this.drawingArea.redo(this.toolManager.selectionTool);
  }

  openOption(): void {
    this.activeNavBar = SELECT_NAVBAR.NAV_OPTIONS;
    this.pushActive = true;
  }

  setBackgroundcolor(): void {
    this.interactionService.sendBackgroundColor(this.color.getPrimaryColor());
  }

  openHelp(): void {
    this.modal.openGuideModal();
  }

  async openSaveForm(drawingArea: DrawingAreaComponent, drawingFilter: SELECT_FILTER_TYPE): Promise<void> {
    if (!this.modal.isOpen) {
      // dataURI is modified by the preview method
      // tslint:disable-next-line: prefer-const
      let dataURI = '';
      let promise: string;
      const svgNodes = this.drawingArea.getSvgNodesString();
      const canvas = this.renderer.createElement('canvas');
      promise =  await this.imageTransformation.preview(canvas, svgNodes,
        this.drawingArea.backgroundColor, this.drawingArea.screenHeight, this.drawingArea.screenWidth,
        SELECT_FILTER_TYPE.NONE, dataURI, SELECT_FILE_TYPE.PNG);
      this.modal.openSaveDrawingForm(drawingArea, promise);
    }
  }

  openGallery(): void {
    if (!this.modal.isOpen) {
      this.modal.openGallery();
    }
  }

  async openExportForm(): Promise<void> {
    if (!this.modal.isOpen) {
      // dataURI is modified by the preview method
      // tslint:disable-next-line: prefer-const
      let dataURI = '';
      const imageSource = [];
      const svgNodes = this.drawingArea.getSvgNodesString();
      const canvas = this.renderer.createElement('canvas');
      const [pSVG, pPNG, pJPG] = await Promise.all([
        await this.imageTransformation.preview(canvas, svgNodes,
          this.drawingArea.backgroundColor, this.drawingArea.screenHeight, this.drawingArea.screenWidth,
          SELECT_FILTER_TYPE.NONE, dataURI, SELECT_FILE_TYPE.SVG),
        await this.imageTransformation.preview(canvas, svgNodes,
          this.drawingArea.backgroundColor, this.drawingArea.screenHeight, this.drawingArea.screenWidth,
          SELECT_FILTER_TYPE.NONE, dataURI, SELECT_FILE_TYPE.PNG),
        await this.imageTransformation.preview(canvas, svgNodes,
          this.drawingArea.backgroundColor, this.drawingArea.screenHeight, this.drawingArea.screenWidth,
          SELECT_FILTER_TYPE.NONE, dataURI, SELECT_FILE_TYPE.JPG)
      ]);
      imageSource[0] = pSVG;
      imageSource[1] = pPNG;
      imageSource[2] = pJPG;
      this.modal.openExportForm(this.drawingArea.canvas.nativeElement.childNodes[0], svgNodes,
        this.drawingArea.backgroundColor, this.drawingArea.screenHeight, this.drawingArea.screenWidth,
        SELECT_FILTER_TYPE.NONE, imageSource, SELECT_FILE_TYPE.PNG);
    }
  }

  copy(): void {
    if (!this.shapeStackIsEmpty) {
      this.clipboard.copy( this.drawingArea);
    }
  }

  cut(): void {
    if (!this.shapeStackIsEmpty) {
      this.clipboard.cut(this.drawingArea);
    }
  }

  delete(): void {
    if (!this.shapeStackIsEmpty) {
      this.clipboard.delete(this.drawingArea);
    }
  }

  paste(): void {
    this.clipboard.paste(this.drawingArea, this.toolManager.selectionTool);
  }

  duplicate(): void {
    this.clipboard.duplicate(this.drawingArea, this.toolManager.selectionTool);
  }

}
