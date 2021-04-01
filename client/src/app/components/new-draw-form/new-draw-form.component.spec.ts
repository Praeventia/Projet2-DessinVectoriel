import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import SpyObj = jasmine.SpyObj;
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ColorService } from '../../services/color-service/color.service';
import { InteractionFormDrawingService } from '../../services/interaction-form-drawing/interaction-form-drawing.service';
import { NewDrawFormComponent } from './new-draw-form.component';

// Numbers to test edge cases
// tslint:disable: no-magic-numbers
describe('NewDrawFormComponent', () => {
  // tslint:disable: prefer-const
  let component: NewDrawFormComponent;
  let fixture: ComponentFixture<NewDrawFormComponent>;
  let matDialogRef: MatDialogRef<NewDrawFormComponent>;
  let matDialog: MatDialog;
  let routerSpy: SpyObj<Router>;
  let colorSpy: SpyObj<ColorService>;
  let injecterToken = MAT_DIALOG_DATA;
  let interactionService: InteractionFormDrawingService;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    colorSpy = jasmine.createSpyObj('ColorService',
    ['pickPrimary', 'pickSecondary', 'reset', 'getColor', 'getRGBA', 'switchColor', 'switchOldColor', 'getPrimaryColor', 'setColor']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDrawFormComponent ],
      imports: [FormsModule],
      providers: [{provide: MatDialog, useValue: matDialog}, {provide: MatDialogRef, useValue: matDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: injecterToken}, {provide: Router, useValue: routerSpy},
        {provide: ColorService, useValue: colorSpy}, InteractionFormDrawingService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit() should set the value', () => {
    component.ngOnInit();
    expect(component.screenHeight).toBeDefined();
    expect(component.screenWidth).toBeDefined();
  });

  it('getScreenSize() should set the value to the window', () => {
    const screenHeight = window.innerHeight - 10 ;
    const screenWidth = window.innerWidth - 10 - 300;
    component.getScreenSize();
    expect(component.screenHeight).toBe(screenHeight);
    expect(component.screenWidth).toBe(screenWidth);
  });

  it('changeDrawingSize() should change the bool to true if the user enters an input', () => {
    expect(component.toggleChange).toBe(false);
    component.changeDrawingSize();
    expect(component.toggleChange).toBe(true);
    expect(component.toggleCreate).toBe(true);

    component.screenHeight = 0;
    component.screenWidth = 0;
    component.changeDrawingSize();
    expect(component.toggleCreate).toBe(true);
  });

  it('goToDrawingWorkPlace() should call the loadNewDrawing method of the interaction service', () => {
    interactionService = TestBed.get(InteractionFormDrawingService);
    const loadNewDrawingSpy = spyOn(interactionService, 'loadNewDrawing');
    component.goToDrawingWorkPlace();
    expect(loadNewDrawingSpy).toHaveBeenCalled();
  });

  it('goToDrawingWorkPlace() shoudl call the navigateByUrl() method and change toggleChange to false', () => {
    component.goToDrawingWorkPlace();
    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
    expect(component.toggleChange).toBe(false);
  });

  it('newColor() should call colorService.pickPrimary()', () => {
    component.newColor();
    expect(colorSpy.pickPrimary).toHaveBeenCalled();
  });

  it('verifyInput should verify the input', () => {
    component.verifyInput(true, '10');
    expect(component.screenHeight).toBe(10);
    component.verifyInput(false, '10');
    expect(component.screenWidth).toBe(10);
    component.verifyInput(false, 'a');
    expect(component.screenWidth).toBe(0);
  });

});
