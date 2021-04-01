import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material';
import { of } from 'rxjs';
import { SELECT_FILE_TYPE } from 'src/app/services/enum/file-type';
import { SELECT_FILTER_TYPE } from 'src/app/services/enum/filters';
import { ImageTransformationService } from 'src/app/services/image-transformation/image-transformation.service';
import { ServerService } from 'src/app/services/server/server.service';
import { ExportFormComponent } from './export-form.component';

// To test the case
// tslint:disable: prefer-const
describe('ExportFormComponent', () => {
  let component: ExportFormComponent;
  let fixture: ComponentFixture<ExportFormComponent>;
  const injectToken = MAT_DIALOG_DATA;
  let httpClient: HttpClient;
  let serverService: ServerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportFormComponent ],
      providers: [{provide: MAT_DIALOG_DATA, useValue: injectToken}, {provide: HttpClient, useValue: httpClient},
      ServerService, ImageTransformationService],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    serverService = TestBed.get(ServerService);
    const emailObservable = of(String);
    spyOn(serverService, 'sendEmail').and.returnValue(emailObservable);
    fixture = TestBed.createComponent(ExportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('applyFilter() should select the right filter', () => {
    let filterType = 'none';
    component.applyFilter(filterType);
    expect(component.filter).toEqual(SELECT_FILTER_TYPE.NONE);

    filterType = 'sepia';
    component.applyFilter(filterType);
    expect(component.filter).toEqual(SELECT_FILTER_TYPE.SEPIA);

    filterType = 'blur';
    component.applyFilter(filterType);
    expect(component.filter).toEqual(SELECT_FILTER_TYPE.BLUR);

    filterType = 'grayscale';
    component.applyFilter(filterType);
    expect(component.filter).toEqual(SELECT_FILTER_TYPE.GRAYSCALE);

    filterType = 'saturate';
    component.applyFilter(filterType);
    expect(component.filter).toEqual(SELECT_FILTER_TYPE.SATURATE);

    filterType = 'invert';
    component.applyFilter(filterType);
    expect(component.filter).toEqual(SELECT_FILTER_TYPE.INVERT);

    filterType = 'hue-rotate';
    component.applyFilter(filterType);
    expect(component.filter).toEqual(SELECT_FILTER_TYPE.HUEROTATE);
  });

  it('setFileType should select the right file type', () => {
    let imageType = 'svg';
    component.setFileType(imageType);
    expect(component.emailInf.imageType).toEqual(SELECT_FILE_TYPE.SVG);
    expect(component.emailInf.imageURI).toEqual(component.imgSrcSVG);

    imageType = 'png';
    component.setFileType(imageType);
    expect(component.emailInf.imageType).toEqual(SELECT_FILE_TYPE.PNG);
    expect(component.emailInf.imageURI).toEqual(component.imgSrcPNG);

    imageType = 'jpg';
    component.setFileType(imageType);
    expect(component.emailInf.imageType).toEqual(SELECT_FILE_TYPE.JPG);
    expect(component.emailInf.imageURI).toEqual(component.imgSrcPNG);
  });

  // tslint:disable: max-line-length
  it('errorManager should chose the right error message', () => {
    let error = 'invalid email';
    component.errorManager(error);
    expect(component.errorMessage).toEqual('Une erreur s\'est produite. L\'adresse courriel fournie n\'existe pas ou son format n\'est pas valide.');

    error = 'Request failed with status code 400';
    component.errorManager(error);
    expect(component.errorMessage).toEqual('Une erreur s\'est produite. L\'adresse courriel fournie n\'existe pas ou son format n\'est pas valide.');

    error = 'Request failed with status code 403';
    component.errorManager(error);
    expect(component.errorMessage).toEqual('Une erreur s\'est produite. La cle X-Team-Key n\'est pas valide.');

    error = 'Request failed with status code 422';
    component.errorManager(error);
    expect(component.errorMessage).toEqual('Une erreur s\'est produite. Le format des donnees que vous voulez envoyer n\'est pas le bon.');

    error = 'Request failed with status code 429';
    component.errorManager(error);
    expect(component.errorMessage).toEqual('Une erreur s\'est produite. La limite de 100 courriels/heure a ete atteinte! SVP essayez plus tard.');

    error = 'Request failed with status code 500';
    component.errorManager(error);
    expect(component.errorMessage).toEqual('Une erreur s\'est produite. Une erreur interne nous empeche d\'envoyer vos donnes.');
  });

  it('email validation should validate email', () => {
    component.emailInf.email = 'a'; // simple string
    let validation = component.emailValidation();
    expect(validation).toBeFalsy();

    component.emailInf.email = 'a@'; // no domain
    validation = component.emailValidation();
    expect(validation).toBeFalsy();

    component.emailInf.email = 'a@a'; // no .com
    validation = component.emailValidation();
    expect(validation).toBeFalsy();

    component.emailInf.email = 'agmail.com'; // no @
    validation = component.emailValidation();
    expect(validation).toBeFalsy();

    component.emailInf.email = '@gmail.com'; // just @ and domain
    validation = component.emailValidation();
    expect(validation).toBeFalsy();

    component.emailInf.email = '   a@gmail.com'; // white spaces at the beginning of the address
    validation = component.emailValidation();
    expect(validation).toBeFalsy();

    component.emailInf.email = 'a@gmail.com  '; // trailing white spaces
    validation = component.emailValidation();
    expect(validation).toBeFalsy();

    component.emailInf.email = 'a @gmail.com'; // white spaces in the middle of the address
    validation = component.emailValidation();
    expect(validation).toBeFalsy();

    component.emailInf.email = 'a@gamil.com'; // correct format
    validation = component.emailValidation();
    expect(validation).toBeTruthy();
  });

  it('sendEmail should call emailValidation()', () => {
    component.emailInf.email = 'a@gmail.com';
    const emailValidation = spyOn(component, 'emailValidation').and.callThrough();
    component.sendEmail();
    expect(emailValidation).toHaveBeenCalled();
  });

  it('sendEmail should display an error message if emailValidation doesn\'t pass', () => {
    component.emailInf.email = 'a@gmail';
    component.sendEmail();
    expect(component.errorMessage).toEqual('L\'adresse courriel fournie n\'existe pas ou son format n\'est pas valide.');
  });

});
