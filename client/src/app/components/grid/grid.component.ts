import { Component, OnInit } from '@angular/core';
import { GridService } from 'src/app/services/grid-service/grid.service';

const INIT_GRIDSIZE = 5;
const INIT_OPACITY = 0.99;

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class GridComponent implements OnInit {

  opacity: number;
  gridSize: number;

  constructor(private gridService: GridService) {
    this.gridSize = INIT_GRIDSIZE;
    this.opacity = INIT_OPACITY;
  }

  ngOnInit(): void {
    this.gridService.getEmittedValueGridSize().subscribe((item: number) => this.gridSize = item );
    this.gridService.getEmittedValueOpacity().subscribe((item: number) => this.opacity = item);
  }
}
