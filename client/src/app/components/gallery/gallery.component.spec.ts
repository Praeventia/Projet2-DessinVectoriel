import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { InteractionFormDrawingService } from 'src/app/services/interaction-form-drawing/interaction-form-drawing.service';
import { ServerService } from 'src/app/services/server/server.service';
import { Drawing } from '../../../../../common/communication/drawing';
import SpyObj = jasmine.SpyObj;
import { GalleryComponent } from './gallery.component';

const DRAWING: Drawing[] = [{ id: 'allo', name: 'test', tags: ['test'], backgroundColor: 'rgb(0,0,0,0)',
width: 5, height: 10, shapes: 'oui', drawingURI: 'je t\'aime test', }];

  // Specific numbers for edge cases
  // tslint:disable: no-magic-numbers
  // tslint:disable: no-string-literal
  // tslint:disable: prefer-const
describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  let serverService: ServerService;
  let routerSpy: SpyObj<Router>;
  let httpClient: HttpClient;
  let matDialog: MatDialog;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryComponent ],
      providers: [{provide: Router, useValue: routerSpy}, {provide: HttpClient, useValue: httpClient},
        {provide: MatDialog, useValue: matDialog}, ServerService, InteractionFormDrawingService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    serverService = TestBed.get(ServerService);
    const drawingObservable = of(DRAWING);
    spyOn(serverService, 'getDrawings').and.returnValue(drawingObservable);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('fillTagList() works properly', () => {
    const drawing: Drawing = {id: '1', name: 'test', tags: ['a', 'b', 'c'],
    backgroundColor: 'color', width: 1, height: 1, shapes: 'shapes', drawingURI: 'uri'};

    // sould take all tags
    component.drawingsToDisplay[0] = (drawing);
    component.fillTagLists();
    expect(component.tagList.length).toBe(5);

    // not double tag
    drawing.tags = ['b', 'd', 'e'];
    component.drawingsToDisplay[0] = (drawing);
    component.fillTagLists();
    expect(component.tagList.length).toBe(7);
  });

  it('resetArrays() should initialize arrays', () => {
    component.resetArrays();
    expect(component.tagList).toBeDefined();
    expect(component.selectedTags).toBeDefined();
    expect(component.drawingsToDisplay).toBeDefined();
    expect(component.validTags).toBeDefined();
  });

  it('searchTags() should find the good tag', () => {
    const drawing: Drawing = {id: '1', name: 'test', tags: ['aa', 'ab', 'c'],
    backgroundColor: 'color', width: 1, height: 1, shapes: 'shapes', drawingURI: 'uri'};
    component.drawingsToDisplay[0] = (drawing);
    component.fillTagLists();

    component.searchTags('a');
    expect(component.validTags.length).toBe(3);

    component.searchTags('c');
    expect(component.validTags.length).toBe(2);

    component.searchTags('x');
    expect(component.validTags.length).toBe(1);

  });

  it('addTag() should remove from valid and add in selectedTags array', () => {
    const drawing: Drawing = {id: '1', name: 'test', tags: ['b'],
    backgroundColor: 'color', width: 1, height: 1, shapes: 'shapes', drawingURI: 'uri'};
    component.drawingsToDisplay = [];
    component.drawingsToDisplay[0] = drawing;
    component.fillTagLists();

    // add valid tag
    component.addTag('b');
    expect(component.selectedTags.length).toBe(1);

    // do nothing on false tag
    component.addTag('x');
    expect(component.selectedTags.length).toBe(1);

    // remove the first tag added should reset lists
    component.removeTag('b');
    expect(component.selectedTags.length).toBe(0);

  });

  it('shouldDisplay() should only show good drawing', () => {
    const drawing: Drawing = {id: '1', name: 'test', tags: ['aa', 'ab', 'c'],
    backgroundColor: 'color', width: 1, height: 1, shapes: 'shapes', drawingURI: 'uri'};
    const drawing2: Drawing = {id: '1', name: 'test', tags: ['x'],
    backgroundColor: 'color', width: 1, height: 1, shapes: 'shapes', drawingURI: 'uri'};
    component.drawingsToDisplay.push(drawing);
    component.drawingsToDisplay.push(drawing2);
    component.fillTagLists();

    expect(component.shouldDisplay(drawing)).toBeTruthy();

    component.addTag('x');

    expect(component.shouldDisplay(drawing)).toBeFalsy();

    component.addTag('aa');

    expect(component.shouldDisplay(drawing)).toBeTruthy();
  });

  it('select() should set the selected drawing', () => {
    const drawing: Drawing = {id: '1', name: 'test', tags: ['aa', 'ab', 'c'],
    backgroundColor: 'color', width: 1, height: 1, shapes: 'shapes', drawingURI: 'uri'};
    component.select(drawing);
    expect(component.isSelected(drawing)).toBeTruthy();
  });

  it('loadDrawing() should call the loadDrawingFromServer() method of the interaction service', () => {
    const drawing: Drawing = {id: '1', name: 'test', tags: ['aa', 'ab', 'c'],
    backgroundColor: 'color', width: 1, height: 1, shapes: '{}', drawingURI: 'uri'};
    component.select(drawing);
    const interactionService: InteractionFormDrawingService = TestBed.get(InteractionFormDrawingService);
    const loadDrawingFromServerSpy = spyOn(interactionService, 'loadDrawingFromServer');

    component.loadDrawing(true);
    expect(loadDrawingFromServerSpy).toHaveBeenCalled();
  });

  it('deleteDrawing() should delete the drawing', () => {
    component.selectedDrawing = DRAWING[0];
    const spy = spyOn(component, 'getDrawings');
    const drawingObservable = of('http://localhost:3000/api/gallery/' + component.selectedDrawing.id );
    spyOn(serverService, 'deleteDrawing').and.returnValue(drawingObservable);

    component.deleteDrawing();
    expect(spy).toHaveBeenCalled();
  });
});
