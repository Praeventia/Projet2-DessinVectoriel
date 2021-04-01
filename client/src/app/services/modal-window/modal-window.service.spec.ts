import { inject, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { AppModule } from '../../app.module';
import { SELECT_FILE_TYPE } from '../enum/file-type';
import { SELECT_FILTER_TYPE } from '../enum/filters';
import { ModalWindowService } from './modal-window.service';

describe('ModalWindowService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ AppModule ],
    providers: [ MatDialog,  ModalWindowService, DrawingAreaComponent, ]
  }));

  it('should exist', inject([MatDialog], (dialog: MatDialog) => {
    expect(dialog).toBeDefined();
  }));

  it('should be created', () => {
    const service: ModalWindowService = TestBed.get(ModalWindowService);
    expect(service).toBeTruthy();
  });

  it('#openGuideModal() should call the dialog.open() method', inject([ModalWindowService], (service: ModalWindowService) => {
    const spy = spyOn(service.dialog, 'open').and.callThrough();
    service.openGuideModal();

    expect(spy).toHaveBeenCalled();
    expect(service.isOpen).toBe(true);
  }));

  it('#openNewDrawModal() should call the dialog.open() method', inject([ModalWindowService], (service: ModalWindowService) => {
    const spy = spyOn(service.dialog, 'open').and.callThrough();
    service.openNewDrawModal();

    expect(spy).toHaveBeenCalled();
    expect(service.isOpen).toBe(true);

  }));

  it('#openConfirmationModal() should call the dialog.open() method', inject([ModalWindowService], (service: ModalWindowService) => {
    const spy = spyOn(service.dialog, 'open').and.callThrough();
    service.openConfirmationModal();

    expect(spy).toHaveBeenCalled();
    expect(service.isOpen).toBe(true);
  }));

  it('#openSaveDrawingForm() should call the dialog.open() method', inject([ModalWindowService], (service: ModalWindowService) => {
    const spy = spyOn(service.dialog, 'open').and.callThrough();
    const drawingArea: DrawingAreaComponent = TestBed.get(DrawingAreaComponent);
    const dataURI = '';
    service.openSaveDrawingForm(drawingArea, dataURI);

    expect(spy).toHaveBeenCalled();
    expect(service.isOpen).toBe(true);
  }));

  it('#openExportForm() should call the dialog.open() method', inject([ModalWindowService], (service: ModalWindowService) => {
    const spy = spyOn(service.dialog, 'open').and.callThrough();
    // const drawingArea: DrawingAreaComponent = TestBed.get(DrawingAreaComponent);
    const dataURI = [''];
    // const filter: SELECT_FILTER_TYPE = SELECT_FILTER_TYPE.NONE;
    // const canvas = document.createElement('canvas');
    const svgNodes = 'abc';
    const heigth = 150;
    const width = 150;
    const canvas = document.createElement('canvas');
    service.openExportForm(canvas, svgNodes, 'rgb(0, 0, 0)', heigth, width,
     SELECT_FILTER_TYPE.NONE, dataURI, SELECT_FILE_TYPE.PNG);

    expect(spy).toHaveBeenCalled();
    expect(service.isOpen).toBe(true);
  }));

  it('#openGallery() should call the dialog.open() method', inject([ModalWindowService], (service: ModalWindowService) => {
    const spy = spyOn(service.dialog, 'open').and.callThrough();
    service.openGallery();

    expect(spy).toHaveBeenCalled();
    expect(service.isOpen).toBe(true);
  }));
});
