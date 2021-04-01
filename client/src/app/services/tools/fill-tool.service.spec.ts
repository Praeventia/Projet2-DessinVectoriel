import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { GridService } from '../grid-service/grid.service';
import { Coordinate } from '../interfaces/coordinate';
import { FillToolService } from './fill-tool.service';

describe('FillToolService', () => {
  // tslint:disable-next-line: prefer-const
  let matDialog: MatDialog;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [DrawingAreaComponent, {provide: MatDialog, useValue: matDialog}, GridService]
  }));

  it('should be created', () => {
    const service: FillToolService = TestBed.get(FillToolService);
    expect(service).toBeTruthy();
  });

  it('onMouseClick should call finish and start', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const drawingArea = TestBed.get(DrawingAreaComponent);
    const service: FillToolService = TestBed.get(FillToolService);
    const spyFinish = spyOn (service, 'finish').and.callThrough();
    const spyStart = spyOn (service, 'start').and.callThrough();
    service.modification = new ShapeModification();

    service.onMouseClick(coordinate, drawingArea);
    expect(spyFinish).toHaveBeenCalled();
    expect(spyStart).toHaveBeenCalled();
  });

});
