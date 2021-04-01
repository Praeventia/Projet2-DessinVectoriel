import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridService } from 'src/app/services/grid-service/grid.service';
import { GridComponent } from './grid.component';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridComponent ],
      providers: [GridService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('init initialize values', () => {
    component.ngOnInit();
    expect(component.gridSize).toBeDefined();
    expect(component.opacity).toBeDefined();
  });
});
