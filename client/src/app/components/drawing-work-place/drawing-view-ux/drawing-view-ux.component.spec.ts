import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { ColorService } from 'src/app/services/color-service/color.service';
import SpyObj = jasmine.SpyObj;
import { GridService } from 'src/app/services/grid-service/grid.service';
import { ModalWindowService } from 'src/app/services/modal-window/modal-window.service';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';
import { DrawingViewUxComponent } from './drawing-view-ux.component';

describe('DrawingViewUxComponent', () => {
  let component: DrawingViewUxComponent;
  let fixture: ComponentFixture<DrawingViewUxComponent>;
  let drawingArea: DrawingAreaComponent;
  let modalServiceSpy: SpyObj<ModalWindowService>;

  beforeEach(() => {
    modalServiceSpy = jasmine.createSpyObj('ModalWindowService', ['openGuideModal', 'openGallery', 'openSaveDrawingForm',
    'openNewDrawModal', 'openConfirmationModal']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingViewUxComponent],
      providers: [{provide: ModalWindowService, useValue: modalServiceSpy}, DrawingAreaComponent, GridService],
      imports: [MatDialogModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    drawingArea = TestBed.get(DrawingAreaComponent);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingViewUxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.drawingArea = drawingArea;
    expect(component).toBeTruthy();
  });

  it('ngGenerate should call the colorService reset and switch', () => {
    component.colorService = TestBed.get(ColorService);
    const resetSpy = spyOn (component.colorService, 'reset').and.returnValue();
    const switchSpy = spyOn (component.colorService, 'switchColor').and.returnValue();
    component.ngOnInit();
    expect(resetSpy).toHaveBeenCalled();
    expect(switchSpy).toHaveBeenCalled();
  });

  it('undo should call the drawingArea undo', () => {
    component.drawingArea = TestBed.get(DrawingAreaComponent);
    const drawingAreaSpy = spyOn (component.drawingArea, 'undo').and.returnValue();
    component.undo();
    expect(drawingAreaSpy).toHaveBeenCalled();
  });

  it('redo should call the drawingArea redo', () => {
    component.drawingArea = TestBed.get(DrawingAreaComponent);
    const drawingAreaSpy = spyOn (component.drawingArea, 'redo').and.returnValue();
    component.redo();
    expect(drawingAreaSpy).toHaveBeenCalled();
  });

});
