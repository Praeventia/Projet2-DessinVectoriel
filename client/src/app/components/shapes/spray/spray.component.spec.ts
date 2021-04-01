import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ColorService } from 'src/app/services/color-service/color.service';
import { SprayComponent } from './spray.component';

describe('SprayComponent', () => {
  let component: SprayComponent;
  let fixture: ComponentFixture<SprayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprayComponent ],
      providers: [ MatDialog, ColorService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.description = new ShapeDescription();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
