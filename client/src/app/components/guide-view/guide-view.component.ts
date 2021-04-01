import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import SampleJson from './guide.json';

interface Page {
  title: string;
  text: string;
}

@Component({
  selector: 'app-guide-view',
  templateUrl: './guide-view.component.html',
  styleUrls: ['./guide-view.component.scss']
})
export class GuideViewComponent implements OnInit {

  private showTools: boolean;
  private showEntryPoint: boolean;
  private actualPage: number;
  private guideBook: Page[];

  constructor(public dialogRef: MatDialogRef<GuideViewComponent>, // Requierd to show correctly
              // Can't be a specific value since it can have many attributes
              // tslint:disable-next-line: no-any
              @Inject(MAT_DIALOG_DATA) public data: any) {

                 this.showTools = true;
                 this.showEntryPoint = true;
                 this.actualPage = 1;
                 this.guideBook = SampleJson;

              }

  ngOnInit(): void {
    this.guideBook[0] = this.guideBook[this.actualPage];
  }

  setGuidePage(page: number): void {
    this.actualPage = page;
    this.guideBook[0] = this.guideBook[this.actualPage];
    this.showEntryPoint = true;
    this.showTools = true;
  }

  toggleTools(): void {
    this.showTools = !this.showTools;
  }

  toggleEntryPoint(): void {
    this.showEntryPoint = !this.showEntryPoint;
  }

  nextPage(right: boolean): void {
    if (right && this.actualPage < this.guideBook.length) { this.actualPage++; }
    if (!right && this.actualPage > 1) { this.actualPage--; }
    this.setGuidePage(this.actualPage);
  }

}
