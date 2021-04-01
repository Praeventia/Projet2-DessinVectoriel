import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { GalleryService } from '../services/gallery.service';
import Types from '../types';

@injectable()
export class GalleryController {

    router: Router;

    constructor(@inject(Types.GalleryService) private galleryService: GalleryService) {
        this.router = Router();
        this.configureRouter();
    }

    configureRouter(): void {
        this.router.get('/', this.galleryService.getDrawings);
        this.router.delete('/:id', this.galleryService.deleteDrawing);
    }

}
