import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmationPopupComponent>, // Required to show correctly
              // Can't be a specific value since it can have many attributes
              // tslint:disable-next-line: no-any
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  confirm(): void {
    this.data.modalService.openNewDrawModal();
  }
}
