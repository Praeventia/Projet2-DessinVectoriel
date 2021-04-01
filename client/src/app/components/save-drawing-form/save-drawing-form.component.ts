import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA/*, MatDialogRef*/ } from '@angular/material';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ServerService } from 'src/app/services/server/server.service';
import { Drawing } from '../../../../../common/communication/drawing';

@Component({
  selector: 'app-save-drawing-form',
  templateUrl: './save-drawing-form.component.html',
  styleUrls: ['./save-drawing-form.component.scss']
})

export class SaveDrawingFormComponent implements OnInit {

  @ViewChild('message', {static: false}) message: ElementRef;

  protected currentName: string;
  protected currentTag: string;
  protected tagsArray: string[];
  protected imageSource: string;
  protected isSaving: boolean;
  protected messageToDisplay: string;
  private readonly DELAY: number = 3000;

  faPlus: IconDefinition = faPlus;

  // Can't be a specific value since it can have many attributes
  // tslint:disable-next-line: no-any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public serverService: ServerService) {}

  ngOnInit(): void {
    this.currentName = '';
    this.currentTag = '';
    this.tagsArray = [];
    this.imageSource = this.data.imageSource;
    this.isSaving = false;
    this.messageToDisplay = '';
  }

  sendDrawing(): void {
    this.messageToDisplay = '';
    if (this.currentName.match(/^\s*$/) !== null) {
      this.messageToDisplay = 'Vous ne pouvez pas introduire de nom vide ou qui contient uniquement des espaces.';
    } else {
      this.isSaving = true;
      const drawing: Drawing = {
        id: '',
        name: this.currentName,
        tags: this.tagsArray,
        backgroundColor: this.data.backgroundColor,
        width: this.data.width,
        height: this.data.height,
        shapes: JSON.stringify(this.data.shapes),
        drawingURI: this.imageSource
      };
      this.serverService.saveDrawing(drawing).subscribe((next) => {
        if (next === undefined) {
          this.messageToDisplay = 'Erreur lors de la sauvegarde du dessin sur le serveur. Veuillez vérifier votre connexion au serveur.';
        } else {
          this.messageToDisplay = JSON.stringify(next);
          setTimeout(() => this.messageToDisplay = '', this.DELAY);
        }
        this.isSaving = false;
      }, (error) => {
        this.messageToDisplay = error.message;
        this.isSaving = false;
      });
    }
  }

  addTag(): void {
    this.messageToDisplay = '';
    let isInTagsArray = false;
    if (this.currentTag.match(/^\s*$/) === null) {
      for (const tag of this.tagsArray) {
        if (this.currentTag === tag) {
          isInTagsArray = true;
        }
      }
      if (!isInTagsArray) {
        this.tagsArray.push(this.currentTag);
        this.currentTag = '';
      } else {
        this.messageToDisplay = 'Cette étiquette existe déjà dans la liste.';
      }
    } else {
      this.messageToDisplay = 'Vous ne pouvez pas introduire d\'étiquette vide ou qui contient uniquement des espaces.';
    }
  }

  deleteTag(tag: string): void {
    for (let i = 0; i < this.tagsArray.length; i++) {
      if (tag === this.tagsArray[i]) {
        this.tagsArray.splice(i, 1);
      }
    }
  }

}
