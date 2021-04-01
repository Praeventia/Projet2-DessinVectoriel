import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA/*, MatDialogRef*/ } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { SELECT_FILTER_TYPE } from 'src/app/services/enum/filters';
import { ImageTransformationService } from 'src/app/services/image-transformation/image-transformation.service';
import { ServerService } from 'src/app/services/server/server.service';
import { EmailInfos } from '../../classes/email';
import { SELECT_FILE_TYPE } from '../../services/enum/file-type';
import { DrawingAreaComponent } from '../drawing-work-place/drawing-area/drawing-area.component';

@Component({
  selector: 'app-export-form',
  templateUrl: './export-form.component.html',
  styleUrls: ['./export-form.component.scss']
})

export class ExportFormComponent implements OnInit {

  @ViewChild('confirmation', {static: false}) confirmation: ElementRef;
  @ViewChild('error', {static: false}) error: ElementRef;

  faDownload: IconDefinition = faDownload;
  drawingArea: DrawingAreaComponent;
  drawingName: string;
  imgSrcSVGSafe: SafeResourceUrl;
  imgSrcSVG: string;
  imgSrcPNG: string;
  imgSrcJPG: string;
  filter: SELECT_FILTER_TYPE;
  errorMessage: string;
  emailInf: EmailInfos;

  constructor(private sanitizer: DomSanitizer,
              // Can't be a specific value since it can have many attributes
              // tslint:disable-next-line: no-any
              @Inject(MAT_DIALOG_DATA) public data: any,
              private imageTransformation: ImageTransformationService,
              public serverService: ServerService, ) {
                this.drawingName = '';
                this.imgSrcJPG = '';
                this.imgSrcPNG = '';
                this.imgSrcSVG = '';
                this.filter = SELECT_FILTER_TYPE.NONE;
                this.drawingArea =  this.data.drawingSurface;
                this.emailInf = {
                  email: '',
                  imageURI: this.imgSrcSVG,
                  imageType: SELECT_FILE_TYPE.SVG,
                  drawingName: this.drawingName
                };
               }

   async ngOnInit(): Promise<void> {
    this.drawingName = '';
    try {
      this.imgSrcSVGSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.imageSources[0]);
      this.imgSrcJPG = this.data.imageSources[2];
      this.imgSrcPNG = this.data.imageSources[1];
      this.imgSrcSVG = this.data.imageSources[0];
    } catch (error) {
      console.log(error);
    }
    this.filter = SELECT_FILTER_TYPE.NONE;
    this.errorMessage = 'Une erreur s\'est produite. ';
    this.emailInf = {
      email: '',
      imageURI: this.imgSrcSVG,
      imageType: SELECT_FILE_TYPE.SVG,
      drawingName: this.drawingName
    };
  }

  async applyFilter(filterType: string): Promise<void> {
    switch (filterType) {
      case ('none'):
        this.filter = SELECT_FILTER_TYPE.NONE;
        break;
      case ('sepia'):
        this.filter = SELECT_FILTER_TYPE.SEPIA;
        break;
      case ('blur'):
        this.filter = SELECT_FILTER_TYPE.BLUR;
        break;
      case ('grayscale'):
        this.filter = SELECT_FILTER_TYPE.GRAYSCALE;
        break;
      case ('saturate') :
        this.filter = SELECT_FILTER_TYPE.SATURATE;
        break;
      case ('invert') :
        this.filter = SELECT_FILTER_TYPE.INVERT;
        break;
      case ('hue-rotate') :
        this.filter = SELECT_FILTER_TYPE.HUEROTATE;
        break;
    }
    try {
      const [pSVG, pPNG, pJPG] = await Promise.all([
      await this.imageTransformation.preview(this.data.canvas, this.data.svgNodes, this.data.backgroundColor,
        this.data.height, this.data.width, this.filter, this.imgSrcSVG, SELECT_FILE_TYPE.SVG),

      await this.imageTransformation.preview(this.data.canvas, this.data.svgNodes, this.data.backgroundColor,
        this.data.height, this.data.width, this.filter, this.imgSrcSVG, SELECT_FILE_TYPE.PNG),

      await this.imageTransformation.preview(this.data.canvas, this.data.svgNodes, this.data.backgroundColor,
        this.data.height, this.data.width, this.filter, this.imgSrcSVG, SELECT_FILE_TYPE.JPG),
       ]);
      this.imgSrcSVGSafe  = this.sanitizer.bypassSecurityTrustResourceUrl(pSVG);
      this.imgSrcSVG = pSVG;
      this.imgSrcPNG  = pPNG;
      this.imgSrcJPG  = pJPG;
    } catch (error) {
      console.log(error);
    }
  }

  setFileType(imageType: string): void {
    switch (imageType) {
      case 'svg':
        this.emailInf.imageType = SELECT_FILE_TYPE.SVG;
        this.emailInf.imageURI = this.imgSrcSVG;
        break;
      case 'png' :
        this.emailInf.imageType = SELECT_FILE_TYPE.PNG;
        this.emailInf.imageURI = this.imgSrcPNG;
        break;
      case 'jpg' :
        this.emailInf.imageType = SELECT_FILE_TYPE.JPG;
        this.emailInf.imageURI = this.imgSrcJPG;
        break;
    }
  }

  sendEmail(): void {
    if (this.emailValidation()) {
      this.error.nativeElement.style.display = 'none';
      this.errorMessage = 'Loading...';
      this.error.nativeElement.style.display = 'block';
      // We don't know what is the api response type
      // tslint:disable-next-line: no-any
      this.serverService.sendEmail(this.emailInf).subscribe((response: any) => {
        if (response.success) {
          this.error.nativeElement.style.display = 'none';
          this.confirmation.nativeElement.style.display = 'block';
        } else {
          this.errorManager(response.message);
        }
      });
    } else {
      this.errorMessage = 'L\'adresse courriel fournie n\'existe pas ou son format n\'est pas valide.';
      this.confirmation.nativeElement.style.display = 'none';
      this.error.nativeElement.style.display = 'block';
    }
  }

  emailValidation(): boolean {
    const emailRegex = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
    return emailRegex.test(this.emailInf.email);
  }

  errorManager(error: string): void {
    this.errorMessage = 'Une erreur s\'est produite. ';
    switch (error) {
      case 'invalid email':
      case 'Request failed with status code 400':
        this.errorMessage += 'L\'adresse courriel fournie n\'existe pas ou son format n\'est pas valide.';
        break;
      case 'Request failed with status code 403':
        this.errorMessage += 'La cle X-Team-Key n\'est pas valide.';
        break;
      case 'Request failed with status code 422':
        this.errorMessage += 'Le format des donnees que vous voulez envoyer n\'est pas le bon.';
        break;
      case 'Request failed with status code 429':
        this.errorMessage += 'La limite de 100 courriels/heure a ete atteinte! SVP essayez plus tard.';
        break;
      case 'Request failed with status code 500':
        this.errorMessage += 'Une erreur interne nous empeche d\'envoyer vos donnes.';
        break;
    }
    this.error.nativeElement.style.display = 'block';
    this.confirmation.nativeElement.style.display = 'none';
  }
}
