import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import SpyObj = jasmine.SpyObj;
import { Router } from '@angular/router';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { InteractionFormDrawingService } from 'src/app/services/interaction-form-drawing/interaction-form-drawing.service';
import { ModalWindowService } from '../../services/modal-window/modal-window.service';
import { EntryPointComponent } from './entry-point.component';

// To test the function
// tslint:disable: prefer-const
describe('EntryPointComponent', () => {

  let component: EntryPointComponent;
  let fixture: ComponentFixture<EntryPointComponent>;
  let modalServiceSpy: SpyObj<ModalWindowService>;
  let routerSpy: SpyObj<Router>;
  let interactionService: InteractionFormDrawingService;
  let matDialog: MatDialog;

  beforeEach(() => {
    modalServiceSpy = jasmine.createSpyObj('ModalWindowService', ['openNewDrawModal', 'openGuideModal',
    'openConfirmationModal', 'openGallery']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryPointComponent ],
      providers: [{provide: ModalWindowService, useValue: modalServiceSpy},
                  {provide: Router, useValue: routerSpy}, {provide: MatDialog , useValue: matDialog},
                  HotkeysService, InteractionFormDrawingService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#newDraw() should call the openNewDrawModal() method', () => {
    component.newDraw();
    expect(modalServiceSpy.openNewDrawModal).toHaveBeenCalled();
  });

  it('#openGuide() should call the openGuideModal() method', () => {
    component.openGuide();
    expect(modalServiceSpy.openGuideModal).toHaveBeenCalled();
  });

  it('#showGallery() should call the openGallery() method', () => {
    component.showGallery();
    expect(modalServiceSpy.openGallery).toHaveBeenCalled();
  });

  it('#goToDrawingWorkPlace() should call the loadAutoSavedDrawing() method of the interaction service', () => {
    interactionService = TestBed.get(InteractionFormDrawingService);
    const loadAutoSavedDrawingSpy = spyOn(interactionService, 'loadAutoSavedDrawing');
    component.goToDrawingWorkPlace();
    expect(loadAutoSavedDrawingSpy).toHaveBeenCalled();
  });

  it('#goToDrawingWorkPlace() should call the navigateByUrl() method', () => {
    component.goToDrawingWorkPlace();
    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
  });

  it('#callShowGallery() should call showGallery()', () => {
    const spy = spyOn(component, 'showGallery');
    component.callShowGallery();
    expect(spy).toHaveBeenCalled();
  });

  it('#callOpenConfirmationModal() should call openConfirmationModal()', () => {
    component.callOpenConfirmationModal();
    expect(modalServiceSpy.openConfirmationModal).toHaveBeenCalled();
  });

  it('#haveOldDraw() should call the canLoadAutoSavedDrawing() method of the interaction service', () => {
    interactionService = TestBed.get(InteractionFormDrawingService);
    const canLoadAutoSavedDrawingSpy = spyOn(interactionService, 'canLoadAutoSavedDrawing');
    component.haveOldDraw();
    expect(canLoadAutoSavedDrawingSpy).toHaveBeenCalled();
  });

});
