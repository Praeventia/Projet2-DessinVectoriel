import { expect } from 'chai';
import * as inversify from 'inversify';
import { DrawingOnServer } from '../../../common/communication/drawing-on-server';
import metadataSchema from '../models/metadata-schema';
import Types from '../types';
import { FileService } from './file.service';
import { SaveDrawingService } from './save-drawing.service';

describe('SaveDrawing service', () => {

    let saveDrawingService: SaveDrawingService;
    let container: inversify.Container;

    beforeEach(() => {
        container = new inversify.Container();
        container.bind(Types.SaveDrawingService).to(SaveDrawingService);
        container.bind(Types.FileService).to(FileService);
        saveDrawingService = container.get<SaveDrawingService>(Types.SaveDrawingService);
    });

    it('verifyNameAndTags should return false if the name is an empty string', () => {
        const tags: string[] = ['test'];
        saveDrawingService.verifyNameAndTags('', tags).then((result) => {
            expect(result).to.equals(false);
        });
    });

    it('verifyNameAndTags should return false if the name contains spaces only', () => {
        const tags: string[] = ['test'];
        saveDrawingService.verifyNameAndTags('   ', tags).then((result) => {
            expect(result).to.equals(false);
        });
    });

    it('verifyNameAndTags should return false if at least one of the tags contains spaces only', () => {
        const tags: string[] = ['   '];
        saveDrawingService.verifyNameAndTags('test', tags).then((result) => {
            expect(result).to.equals(false);
        });
    });

    it('saveDrawingOnServer should return value from a promise', async () => {
        const drawing: DrawingOnServer = {
            id: '1',
            backgroundColor: 'rgb(255, 255, 255)',
            width: 100,
            height: 100,
            shapes: 'shapes',
            drawingURI: 'drawingURI'
        };
        saveDrawingService.saveDrawingOnServer(drawing).then((value) => {
            expect(value).to.be('promise value');
        });
    });

    it('saveDrawingOnDatabase should return value from a promise', async () => {
        saveDrawingService.saveDrawingOnDatabase('test', []).then((value) => {
            expect(value).to.be('promise value');
        });
    });

    it('saveDrawingOnDatabase should save the metadata on the database', async () => {
        let id = '';
        saveDrawingService.saveDrawingOnDatabase('test', []).then((value) => {
            id = value.id;
        });
        metadataSchema.findOne({ _id: id }).then((metadata) => {
            expect(metadata).to.equals(true).and.to.equals({ name: 'test', tags: [] });
        });
    });

});
