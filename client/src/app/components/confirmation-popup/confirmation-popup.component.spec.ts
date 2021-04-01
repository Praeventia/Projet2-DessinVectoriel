import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { mock } from 'ts-mockito';
import { ModalWindowService } from '../../services/modal-window/modal-window.service';
import { ConfirmationPopupComponent } from './confirmation-popup.component';

// Can't initiate MatDialog, depend on the object
// tslint:disable: prefer-const
describe('ConfirmationPopupComponent', () => {
  let component: ConfirmationPopupComponent;
  let fixture: ComponentFixture<ConfirmationPopupComponent>;
  let matDialogRef: MatDialogRef<ConfirmationPopupComponent>;
  const injectToken = MAT_DIALOG_DATA;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationPopupComponent ],
      providers: [
        {provide: MatDialogRef, useValue: matDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: injectToken}, ConfirmationPopupComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#confirm() should open the new drawing dialog', () => {
    const comp = TestBed.get(ConfirmationPopupComponent);
    comp.data.modalService = new ModalWindowService(mock(MatDialog));

    const spy = spyOn(comp.data.modalService, 'openNewDrawModal');
    component.confirm();
    expect(spy).toHaveBeenCalled();
  });

});
