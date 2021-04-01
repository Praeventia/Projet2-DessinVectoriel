import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Drawing } from '../../../../../common/communication/drawing';
import { InteractionFormDrawingService } from '../../services/interaction-form-drawing/interaction-form-drawing.service';
import { ServerService } from '../../services/server/server.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})

export class GalleryComponent implements OnInit {

  @ViewChild('message', {static: false}) message: ElementRef;

  drawingsToDisplay: Drawing[];
  selectedDrawing: Drawing;
  tagList: string[];
  selectedTags: string[];
  validTags: string[];
  faSearch: IconDefinition = faSearch;
  loaded: boolean;
  messageToDisplay: string;
  confirmLoad: boolean;

  private readonly DELAY: number = 3000;
  private readonly SELECT_TAG: string = 'Choisissez un tag!';

  constructor(public serverService: ServerService,
              private router: Router,
              public interactionService: InteractionFormDrawingService) {}

  ngOnInit(): void {
    this.loaded = false;
    this.resetArrays();
    this.validTags.push(this.SELECT_TAG);
    this.getDrawings();
    this.messageToDisplay = '';
    this.confirmLoad = true;
  }

  fillTagLists(): void {
    for (const drawing of this.drawingsToDisplay) {
      for (const tag of drawing.tags) {
        if (!this.tagList.includes(tag)) {
          this.tagList.push(tag);
          this.validTags.push(tag);
        }
      }
    }
  }

  resetArrays(): void {
    this.drawingsToDisplay = [];
    this.tagList = [];
    this.selectedTags = [];
    this.validTags = [];
  }

  searchTags(result: string): void {
    this.validTags = [];
    this.validTags.push(this.SELECT_TAG);
    for (const tag of this.tagList) {
      if (tag.startsWith(result)) {
        if (!this.selectedTags.includes(tag)) {
          this.validTags.push(tag);
        }
      }
    }
  }

  getDrawings(): void {
    this.messageToDisplay = '';
    this.loaded = false;
    this.serverService.getDrawings().subscribe((drawings) => {
      if (drawings === undefined) {
        this.drawingsToDisplay = [];
        this.messageToDisplay = 'Erreur lors de l\'affichage de la galerie. Veuillez vérifier votre connexion au serveur.';
      } else {
        this.drawingsToDisplay = drawings;
      }
      this.fillTagLists();
      this.loaded = true;
    }, (error) => {
      this.messageToDisplay = error.message;
    });
  }

  deleteDrawing(): void {
    this.messageToDisplay = '';
    this.serverService.deleteDrawing(this.selectedDrawing.id).subscribe((next) => {
      if (next === undefined) {
        this.messageToDisplay = 'Erreur lors de la suppression du dessin. Veuillez vérifier votre connexion au serveur.';
      } else {
        this.messageToDisplay = next;
        setTimeout(() => this.messageToDisplay = '', this.DELAY);
      }
    }, (error) => {
      this.messageToDisplay = error.message;
    });
    this.getDrawings();
  }

  addTag(tag: string): void {
    if (tag !== this.SELECT_TAG && this.validTags.includes(tag)) {
      this.validTags.splice(this.validTags.lastIndexOf(tag), 1);
      this.selectedTags.push(tag);
    }
  }

  removeTag(tag: string): void {
    this.selectedTags.splice(this.selectedTags.lastIndexOf(tag), 1);
    this.validTags.push(tag);
  }

  shouldDisplay(drawing: Drawing): boolean {
    if (this.selectedTags.length === 0) {
      return true;
    }

    for (const tag of drawing.tags) {
      for (const selectedTag of this.selectedTags) {
        if (tag === selectedTag) {
          return true;
        }
      }
    }
    return false;
  }

  loadDrawing(confirm: boolean): void {
    this.confirmLoad = true;
    this.messageToDisplay = '';

    if (!this.interactionService.isShapeStackEmpty() && !confirm) {
      this.confirmLoad = false;
      this.messageToDisplay = 'Cette opération suprimera le dessin en cours.';
    }

    if (this.confirmLoad) {
      this.interactionService.loadDrawingFromServer(this.selectedDrawing);
      this.router.navigateByUrl('/dessin');
    }
  }

  select(drawing: Drawing): void {
    this.selectedDrawing = drawing;
  }

  isSelected(drawing: Drawing): boolean {
    return this.selectedDrawing === drawing;
  }

}
