import { expect } from 'chai';
import * as inversify from 'inversify';
import { DrawingOnServer } from '../../../common/communication/drawing-on-server';
import Types from '../types';
import { FileService } from './file.service';
import { GalleryService } from './gallery.service';

class MockFileService extends FileService {

    private drawing: DrawingOnServer = {
        id: '1',
        backgroundColor: 'rgb(255, 255, 255)',
        width: 100,
        height: 100,
        shapes: 'shapes',
        drawingURI: 'drawingURI'
    };

    async getDrawings(): Promise<DrawingOnServer[]> {
        const content: DrawingOnServer[] = [];
        content.push(this.drawing);
        this.drawing.id = '2';
        content.push(this.drawing);
        this.drawing.id = '3';
        content.push(this.drawing);
        return content;
    }

}

describe('Gallery service', () => {

    let galleryService: GalleryService;
    let container: inversify.Container;

    beforeEach(() => {
        container = new inversify.Container();
        container.bind(Types.GalleryService).to(GalleryService);
        container.bind(Types.FileService).to(MockFileService);
        galleryService = container.get<GalleryService>(Types.GalleryService);
    });

    it('getAllDrawings should return value from a promise', async () => {
        const drawingsOnServer: DrawingOnServer[] = [];
        const drawing: DrawingOnServer = {
            id: '1',
            backgroundColor: 'rgb(255, 255, 255)',
            width: 100,
            height: 100,
            shapes: 'shapes',
            drawingURI: 'drawingURI'
        };
        drawingsOnServer.push(drawing);

        galleryService.getAllDrawings(drawingsOnServer).then((value) => {
            expect(value).to.be('promise value');
        });
    });

});
