import SpyObj = jasmine.SpyObj;
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material';
import { of } from 'rxjs';
import { ServerService } from 'src/app/services/server/server.service';
import { Drawing } from '../../../../../common/communication/drawing';
import { SaveDrawingFormComponent } from './save-drawing-form.component';

const DRAWING: Drawing = { id: 'allo', name: 'test', tags: ['test'], backgroundColor: 'rgb(0,0,0,0)',
width: 5, height: 10, shapes: 'oui', drawingURI: 'je t\'aime test', };

// Can't initiate httpclient
// tslint:disable: prefer-const
describe('SaveDrawingFormComponent', () => {
  let component: SaveDrawingFormComponent;
  let httpClientSpy: SpyObj<HttpClient>;
  let fixture: ComponentFixture<SaveDrawingFormComponent>;
  const injectToken = MAT_DIALOG_DATA;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveDrawingFormComponent ],
      providers: [{provide: MAT_DIALOG_DATA, useValue: injectToken}, ServerService, { provide: HttpClient, useValue: httpClientSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDrawingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('add tag should only add correct tag', () => {

    // add good tag
    component['currentTag'] = 'a';
    component.addTag();
    expect(component['tagsArray'].length).toBe(1);

    // no double tag does not increase size
    component['currentTag'] = 'a';
    component.addTag();
    expect(component['tagsArray'].length).toBe(1);

    // bad atg does not increase size
    component['currentTag'] = ' ';
    component.addTag();
    expect(component['tagsArray'].length).toBe(1);

  });

  it('delete tag should delete correct tag', () => {

    // add good tag
    component['currentTag'] = 'a';
    component.addTag();
    component.deleteTag('a');
    expect(component['tagsArray'].length).toBe(0);

  });

  it('sendDrawing should send the drawing to the server', () => {
    const service = TestBed.get(ServerService);
    const drawingObservable = of(DRAWING);
    spyOn(service, 'saveDrawing').and.returnValue(drawingObservable);
    const spy = spyOn(JSON, 'stringify').and.callThrough();
    component['currentName'] = '';
    component.sendDrawing();

    component['currentName'] = 'Je deteste les tests';
    component.sendDrawing();
    expect(spy).toHaveBeenCalled();

  });

});
