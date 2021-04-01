import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GuideViewComponent } from './guide-view.component';

// Specific value for the tests
// tslint:disable: prefer-const
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
describe('GuideViewComponent', () => {
  let component: GuideViewComponent;
  let fixture: ComponentFixture<GuideViewComponent>;
  let matDialogRef: MatDialogRef <GuideViewComponent>;
  const injectToken = MAT_DIALOG_DATA;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideViewComponent ],
      providers: [{provide: MatDialogRef, useValue: matDialogRef},
                {provide: MAT_DIALOG_DATA, useValue: injectToken}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#toggleTools() should tooggle #showTools', () => {
    expect(component['showTools']).toBe(true, 'no click');
    component.toggleTools();
    expect(component['showTools']).toBe(false, 'click one');
    component.toggleTools();
    expect(component['showTools']).toBe(true, 'click two');
  });

  it('#toggleEntryPoint() should tooggle #showEntryPoint', () => {
    expect(component['showEntryPoint']).toBe(true, 'no click');
    component.toggleEntryPoint();
    expect(component['showEntryPoint']).toBe(false, 'click one');
    component.toggleEntryPoint();
    expect(component['showEntryPoint']).toBe(true, 'click two');
  });

  it('#nextPage(bool) should increment or decrease the #actualPage', () => {
    expect(component['actualPage']).toBe(1, 'no click');
    component.nextPage(true);
    expect(component['actualPage']).toBe(2, 'click one');
    component.nextPage(false);
    expect(component['actualPage']).toBe(1, 'click one');
  });

  it('#setGuidePage() should change the #actualPage ', () => {
    component.setGuidePage(5);
    expect(component['actualPage']).toBe(5, 'input 5');
    component.setGuidePage(10);
    expect(component['actualPage']).toBe(10, 'input 10');
  });

});
