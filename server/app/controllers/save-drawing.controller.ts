import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { SaveDrawingService } from '../services/save-drawing.service';
import Types from '../types';

@injectable()
export class SaveDrawingController {

    router: Router;

    constructor(@inject(Types.SaveDrawingService) private saveDrawingService: SaveDrawingService) {
        this.router = Router();
        this.configureRouter();
    }

    configureRouter(): void {
        this.router.post('/', this.saveDrawingService.saveDrawing);
    }

}
