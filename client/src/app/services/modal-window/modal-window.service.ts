import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationPopupComponent } from '../../components/confirmation-popup/confirmation-popup.component';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { ExportFormComponent } from '../../components/export-form/export-form.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { GuideViewComponent } from '../../components/guide-view/guide-view.component';
import { NewDrawFormComponent } from '../../components/new-draw-form/new-draw-form.component';
import { SaveDrawingFormComponent } from '../../components/save-drawing-form/save-drawing-form.component';
import { SELECT_FILE_TYPE } from '../enum/file-type';
import { SELECT_FILTER_TYPE } from '../enum/filters';

@Injectable({
  providedIn: 'root'
})

export class ModalWindowService {

  isOpen: boolean;

  constructor(public dialog: MatDialog) {
    this.isOpen = false;
  }

  openGuideModal(): void {
    this.isOpen = true;
    const modalWidth = '800px';
    const modalHeight = '600px';
    this.dialog.open(GuideViewComponent, {
        width: modalWidth,
        height: modalHeight,
    });
  }

  openNewDrawModal(): void {
    this.isOpen = true;
    const modalWidth = '400px';
    const modalHeight = '350px';
    this.dialog.open(NewDrawFormComponent, { width: modalWidth,
      height: modalHeight, }).afterClosed().subscribe(() => { this.isOpen = false; });
  }

  openConfirmationModal(): void {
    this.isOpen = true;
    const modalWidth = '400px';
    const modalHeight = '200px';
    this.dialog.open(ConfirmationPopupComponent, {
        width: modalWidth,
        height: modalHeight,
        data: {modalService: this},
      }).afterClosed().subscribe(() => { this.isOpen = false; });
  }

 openSaveDrawingForm(drawingArea: DrawingAreaComponent, dataURI: string): void {
    this.isOpen = true;
    const descriptionStack = drawingArea.getDescriptionStack(true);
    const modalWidth = '650px';
    const modalHeight = '500px';
    this.dialog.open(SaveDrawingFormComponent, {
        width: modalWidth,
        height: modalHeight,
        data: {shapes: descriptionStack,
               backgroundColor: drawingArea.backgroundColor,
               width: drawingArea.screenWidth,
               height: drawingArea.screenHeight,
               imageSource: dataURI},
    }).afterClosed().subscribe(() => { this.isOpen = false; });
  }

  openExportForm(canvas: HTMLCanvasElement, svgNodes: string,  backgroundColor: string,
                 height: number, width: number, drawingFilter: SELECT_FILTER_TYPE,
                 dataURI: string[], fileType: SELECT_FILE_TYPE): void {
    this.isOpen = true;
    const modalWidth = '600px';
    const modalHeight = '720px';
    this.dialog.open(ExportFormComponent, {
    width: modalWidth,
    height: modalHeight,
    data: {canvas,
           svgNodes,
           backgroundColor,
           height, width,
           drawingFilter,
           imageSources: dataURI,
           fileType},
    }).afterClosed().subscribe(() => { this.isOpen = false; });
  }

  openGallery(): void {
    this.isOpen = true;
    const modalWidth = '500px';
    const modalHeight = '500px';
    this.dialog.open(GalleryComponent, { width: modalWidth, height: modalHeight, data: {modal: this}
     }).afterClosed().subscribe(() => { this.isOpen = false; });
  }

}
