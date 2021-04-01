import { Component, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowAltCircleLeft, faFile, faFileDownload, faFileExport,
         faGripHorizontal, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { SELECT_FILE_TYPE } from 'src/app/services/enum/file-type';
import { SELECT_FILTER_TYPE } from 'src/app/services/enum/filters';
import { ImageTransformationService } from 'src/app/services/image-transformation/image-transformation.service';
import { ModalWindowService } from 'src/app/services/modal-window/modal-window.service';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';

@Component({
  selector: 'app-file-option',
  templateUrl: './file-option.component.html',
  styleUrls: ['../drawing-view-ux/drawing-view-ux.component.scss']
})
export class FileOptionComponent {

  @Input() drawingArea: DrawingAreaComponent;

  protected faFile: IconDefinition = faFile;
  protected faFileExport: IconDefinition = faFileExport;
  protected faFileDownload: IconDefinition = faFileDownload;
  protected faGripHorizontal: IconDefinition = faGripHorizontal;
  protected faArrowAltCircleLeft: IconDefinition = faArrowAltCircleLeft;

  constructor(private router: Router, private imageTransformation: ImageTransformationService,
              private renderer: Renderer2, private modal: ModalWindowService) {
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

  async openSaveForm(): Promise<void> {
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
      this.modal.openSaveDrawingForm(this.drawingArea, promise);
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

  openHelp(): void {
    this.modal.openGuideModal();
  }

  back(): void {
    this.router.navigateByUrl('/acceuil');
  }

}
