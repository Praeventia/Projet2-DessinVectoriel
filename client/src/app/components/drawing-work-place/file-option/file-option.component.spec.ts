import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { Router } from '@angular/router';
import { GridService } from 'src/app/services/grid-service/grid.service';
import { ModalWindowService } from 'src/app/services/modal-window/modal-window.service';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';
import SpyObj = jasmine.SpyObj;
import { FileOptionComponent } from './file-option.component';

// To have acces to private method
// tslint:disable: no-string-literal
describe('FileOptionComponent', () => {
  let component: FileOptionComponent;
  let fixture: ComponentFixture<FileOptionComponent>;
  let modalServiceSpy: SpyObj<ModalWindowService>;
  let drawingArea: DrawingAreaComponent;
  let routerSpy: SpyObj<Router>;

  beforeEach(() => {
    modalServiceSpy = jasmine.createSpyObj('ModalWindowService', ['openGuideModal', 'openGallery', 'openSaveDrawingForm',
    'openNewDrawModal', 'openConfirmationModal']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileOptionComponent],
      providers: [{provide: Router, useValue: routerSpy}, {provide: ModalWindowService, useValue: modalServiceSpy},
                  DrawingAreaComponent, GridService],
      imports: [MatDialogModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    drawingArea = TestBed.get(DrawingAreaComponent);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.drawingArea = drawingArea;
    expect(component).toBeTruthy();
  });

  it('#openHelp() should call the openGuideModal() method', () => {
    component.openHelp();
    expect(modalServiceSpy.openGuideModal).toHaveBeenCalled();
  });

  it('openGallery should open the gallery modal', () => {
    component['modal'].isOpen = false;
    component.openGallery();
    expect(modalServiceSpy.openGallery).toHaveBeenCalled();
  });

  it('openSaveForm should open the save form', async () => {
    component['modal'].isOpen = false;
    component.drawingArea = TestBed.get(DrawingAreaComponent);
    const drawingAreaSpy = spyOn (component.drawingArea, 'getSvgNodesString');
    const imageSpy = spyOn (component['imageTransformation'], 'preview').and.callThrough();
    const canvas = document.createElement('canvas');
    (drawingArea.canvas as unknown as HTMLCanvasElement) = canvas;
    component.openSaveForm();
    expect(drawingAreaSpy).toHaveBeenCalled();
    await expect(imageSpy).toHaveBeenCalled();
  });

  it('openExportForm should open the export form', async () => {
    component['modal'].isOpen = false;
    const imageSpy = spyOn (component['imageTransformation'], 'preview').and.callThrough();
    component.drawingArea = TestBed.get(DrawingAreaComponent);
    const drawingAreaSpy = spyOn (component.drawingArea, 'getSvgNodesString');

    component.openExportForm();

    expect(drawingAreaSpy).toHaveBeenCalled();

    await expect(imageSpy).toHaveBeenCalled();
  });

  it('openGallery should open the drawing form modal', () => {
    component['modal'].isOpen = false;
    component.openNewDrawingForm();
    expect(modalServiceSpy.openNewDrawModal).toHaveBeenCalled();
  });

  it('openConfirmationModal should open the confirmation modal', () => {
    component.drawingArea = TestBed.get(DrawingAreaComponent);
    component.drawingArea.newShapeLvl = 1;
    component['modal'].isOpen = false;
    component.openConfirmationModal();
    expect(modalServiceSpy.openConfirmationModal).toHaveBeenCalled();
    component['drawingArea'].newShapeLvl = 0;
    component.openConfirmationModal();
    expect(modalServiceSpy.openNewDrawModal).toHaveBeenCalled();
  });
});
