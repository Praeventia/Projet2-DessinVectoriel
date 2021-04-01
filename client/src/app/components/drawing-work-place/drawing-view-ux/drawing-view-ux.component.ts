import { Component, OnInit, ViewChild } from '@angular/core';
import {faFile, faHandRock, faInfoCircle, faPaintRoller, faPencilRuler, faRedo,
   faShapes, faUndo, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { ColorService } from 'src/app/services/color-service/color.service';
import { HotkeysService, Unlisten } from 'src/app/services/hotkeys/hotkeys.service';
import { ModalWindowService } from 'src/app/services/modal-window/modal-window.service';
import { ToolManagerService } from 'src/app/services/tool-manager/tool-manager.service';
import { ColorOptionComponent } from '../color-option/color-option.component';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';
import { FileOptionComponent } from '../file-option/file-option.component';
import { PenOptionComponent } from '../pen-option/pen-option.component';
import { SelectionOptionComponent } from '../selection-option/selection-option.component';
import { ToolOptionComponent } from '../tool-option/tool-option.component';

const SELECT = 'selection';
const PEN = 'pen';
const TOOL = 'tool';
const COLOR = 'color';
const FILE = 'file';
const DELAY = 10;

@Component({
  selector: 'app-drawing-view-ux',
  templateUrl: './drawing-view-ux.component.html',
  styleUrls: ['./drawing-view-ux.component.scss']
})
export class DrawingViewUxComponent implements OnInit {

  @ViewChild('drawingArea', {static: false}) drawingArea: DrawingAreaComponent;

  @ViewChild('selection', {static: false}) selection: SelectionOptionComponent;
  @ViewChild('pen', {static: false}) pen: PenOptionComponent;
  @ViewChild('tool', {static: false}) tool: ToolOptionComponent;
  @ViewChild('color', {static: false}) color: ColorOptionComponent;
  @ViewChild('file', {static: false}) file: FileOptionComponent;

  protected visibleOption: string;
  private unlistenView: Unlisten;

  protected undoIsEmpty: boolean;
  protected redoIsEmpty: boolean;
  protected shapeStackIsEmpty: boolean;

  protected faHandRock: IconDefinition = faHandRock;
  protected faPencilRuler: IconDefinition = faPencilRuler;
  protected faShapes: IconDefinition = faShapes;
  protected faPaintRoller: IconDefinition = faPaintRoller;
  protected faFile: IconDefinition = faFile;
  protected faUndo: IconDefinition = faUndo;
  protected faRedo: IconDefinition = faRedo;

  protected faInfoCircle: IconDefinition = faInfoCircle;

  constructor(protected modal: ModalWindowService,
              private hotkeys: HotkeysService,
              protected toolManager: ToolManagerService,
              protected clipboard: ClipboardService,
              public colorService: ColorService) {
    this.undoIsEmpty = true;
    this.redoIsEmpty = true;
    this.visibleOption = PEN;
  }

  // tslint:disable-next-line: typedef
  ngOnInit() {

    this.colorService.reset();
    this.colorService.switchColor();

    this.unlistenView = this.hotkeys.listen({

    'control.o': ( event: KeyboardEvent): void => { this.visibleOption = FILE;
                                                    setTimeout(() => this.file.openConfirmationModal(), DELAY); event.preventDefault(); },
    'control.s': ( event: KeyboardEvent): void => { this.visibleOption = FILE;
                                                    setTimeout(() => this.file.openSaveForm(), DELAY); event.preventDefault(); },
    'control.g': ( event: KeyboardEvent): void => { this.visibleOption = FILE;
                                                    setTimeout(() => this.file.openGallery(), DELAY); event.preventDefault(); },
    'control.e': ( event: KeyboardEvent): void => { this.visibleOption = FILE;
                                                    setTimeout(() => this.file.openExportForm(), DELAY); event.preventDefault(); },

    'control.x': (): void => { this.visibleOption = SELECT; this.selection.cut(); },
    'control.c': ( event: KeyboardEvent): void => { this.visibleOption = SELECT;
                                                    setTimeout(() => this.selection.copy(), DELAY); event.preventDefault(); },
    'control.v': ( event: KeyboardEvent): void => { this.visibleOption = SELECT;
                                                    setTimeout(() => this.selection.paste(), DELAY); event.preventDefault(); },
    'control.d': ( event: KeyboardEvent): void => { this.visibleOption = SELECT;
                                                    setTimeout(() => this.selection.duplicate(), DELAY); event.preventDefault(); },
    'del': ( event: KeyboardEvent): void => { this.visibleOption = SELECT;
                                              setTimeout(() => this.selection.delete(), DELAY); event.preventDefault(); },

    'control.z': ( event: KeyboardEvent): void => { this.undo(); event.preventDefault(); },
    'control.shift.z': ( event: KeyboardEvent): void => {this.redo(); event.preventDefault(); },

    'c': ( event: KeyboardEvent): void => { this.visibleOption = PEN; setTimeout(() => this.pen.pen(), DELAY); event.preventDefault(); },
    'w': ( event: KeyboardEvent): void => { this.visibleOption = PEN; setTimeout(() => this.pen.brush(), DELAY); event.preventDefault(); },
    'a': ( event: KeyboardEvent): void => { this.visibleOption = PEN; setTimeout(() => this.pen.spray(), DELAY); event.preventDefault(); },
    'e': ( event: KeyboardEvent): void => { this.visibleOption = PEN; setTimeout(() => this.pen.eraser(), DELAY); event.preventDefault(); },

    '1': ( event: KeyboardEvent): void => { this.visibleOption = TOOL;
                                            setTimeout(() => this.tool.rectangle(), DELAY); event.preventDefault(); },
    '2': ( event: KeyboardEvent): void => { this.visibleOption = TOOL;
                                            setTimeout(() => this.tool.ellipse(), DELAY); event.preventDefault(); },
    '3': ( event: KeyboardEvent): void => { this.visibleOption = TOOL;
                                            setTimeout(() => this.tool.polygone(), DELAY); event.preventDefault(); },
    'l': ( event: KeyboardEvent): void => { this.visibleOption = TOOL;
                                            setTimeout(() => this.tool.line(), DELAY); event.preventDefault(); },

    'r': ( event: KeyboardEvent): void => { this.visibleOption = COLOR;
                                            setTimeout(() => this.color.fill(), DELAY); event.preventDefault(); },
    'b': ( event: KeyboardEvent): void => { this.visibleOption = COLOR;
                                            setTimeout(() => this.color.bucket(), DELAY); event.preventDefault(); },
    'i': ( event: KeyboardEvent): void => { this.visibleOption = COLOR;
                                            setTimeout(() => this.color.dropper(), DELAY); event.preventDefault(); },

    's': ( event: KeyboardEvent): void => { this.visibleOption = SELECT;
                                            setTimeout(() => this.selection.selection(), DELAY); event.preventDefault(); },

    'g': ( event: KeyboardEvent): void => { this.visibleOption = SELECT;
                                            setTimeout(() => {this.selection.grid(); this.selection.showGrid(); }, DELAY);
                                            event.preventDefault(); },
    '+': ( event: KeyboardEvent): void => { this.visibleOption = SELECT;
                                            setTimeout(() => this.selection.increaseGrid(), DELAY); event.preventDefault(); },
    '-': ( event: KeyboardEvent): void => { this.visibleOption = SELECT;
                                            setTimeout(() => this.selection.decreaseGrid(), DELAY); event.preventDefault(); },

    }, {priority: 0, });
  }

  ngOnDestroy(): void {
    this.unlistenView();
  }

  undo(): void {
    this.drawingArea.undo(this.toolManager.selectionTool);
  }

  redo(): void {
    this.drawingArea.redo(this.toolManager.selectionTool);
  }

}
