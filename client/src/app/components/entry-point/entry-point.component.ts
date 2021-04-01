import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InteractionFormDrawingService } from 'src/app/services/interaction-form-drawing/interaction-form-drawing.service';
import { HotkeysService, Unlisten } from '../../services/hotkeys/hotkeys.service';
import { ModalWindowService } from '../../services/modal-window/modal-window.service';

@Component({
  selector: 'app-entry-point',
  templateUrl: './entry-point.component.html',
  styleUrls: ['./entry-point.component.scss']
})

export class EntryPointComponent implements OnInit, OnDestroy {

  private unlistenEntry: Unlisten;

  constructor(private modal: ModalWindowService,
              private hotkeys: HotkeysService,
              private router: Router,
              private interactionService: InteractionFormDrawingService) {}

  ngOnInit(): void {
    this.unlistenEntry = this.hotkeys.listen(
      {
        'control.o': ( event: KeyboardEvent): void => { this.callOpenConfirmationModal(); event.preventDefault(); },
        'control.g': ( event: KeyboardEvent): void => { this.callShowGallery(); event.preventDefault(); },
      },
      {
        priority: 100,
      }
    );
  }

  ngOnDestroy(): void {
    this.unlistenEntry();
  }

  callOpenConfirmationModal(): void {
    if (!this.modal.isOpen) {
      this.modal.openConfirmationModal();
    }
  }

  callShowGallery(): void {
    if (!this.modal.isOpen) {
      this.showGallery();
    }
  }

  newDraw(): void {
    this.modal.openNewDrawModal();
  }

  openGuide(): void {
    this.modal.openGuideModal();
  }

  showGallery(): void {
    this.modal.openGallery();
  }

  haveOldDraw(): boolean {
    return this.interactionService.canLoadAutoSavedDrawing();
  }

  goToDrawingWorkPlace(): void {
    this.interactionService.loadAutoSavedDrawing();
    this.router.navigateByUrl('/dessin');
  }

}
