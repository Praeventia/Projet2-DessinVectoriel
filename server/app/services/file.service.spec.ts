import { expect } from 'chai';
import { DrawingOnServer } from '../../../common/communication/drawing-on-server';
import { FileService } from './file.service';

describe('File Service', () => {

    let fileService: FileService;

    beforeEach(async () => {
        fileService = new FileService();
    });

    it('write should return value from a promise', async () => {
        fileService.write('test').then((value) => {
            expect(value).to.be('promise value');
        });
    });

    it('read should return value from a promise', async () => {
        fileService.read().then((value) => {
            expect(value).to.be('promise value');
        });
    });

    it('accessFile should return value from a promise', async () => {
        fileService.accessFile().then((value) => {
            expect(value).to.be('promise value');
        });
    });

    it('createFile should return value from a promise', async () => {
        fileService.createFile().then((value) => {
            expect(value).to.be('promise value');
        });
    });

    it('getDrawings should return drawings saved in the server', async () => {
        fileService.getDrawings().then((drawings) => {
            expect(drawings).to.be.an('array');
        });
    });

    it('saveDrawing should add the drawing in the server', async () => {
        let numberOfDrawings = 0;
        const drawing: DrawingOnServer = {
            id: '1',
            backgroundColor: 'rgb(255, 255, 255)',
            width: 100,
            height: 100,
            shapes: 'shapes',
            drawingURI: 'drawingURI'
        };

        fileService.createFile().then(() => {
            fileService.saveDrawing(drawing).then(() => {
                fileService.getDrawings().then((drawings) => {
                    numberOfDrawings = drawings.length;
                });
            });
        });

        drawing.id = '2';
        fileService.saveDrawing(drawing).then(() => {
            fileService.getDrawings().then((drawings) => {
                expect(drawings.length).to.be.above(numberOfDrawings);
            });
        });
    });

    it('deleteDrawing should remove the drawing from the server', async () => {
        let numberOfDrawings = 0;
        const drawing: DrawingOnServer = {
            id: '1',
            backgroundColor: 'rgb(255, 255, 255)',
            width: 100,
            height: 100,
            shapes: 'shapes',
            drawingURI: 'drawingURI'
        };

        fileService.createFile().then(() => {
            fileService.saveDrawing(drawing).then(() => {
                drawing.id = '2';
                fileService.saveDrawing(drawing).then(() => {
                    fileService.getDrawings().then((drawings) => {
                        numberOfDrawings = drawings.length;
                    });
                });
            });
        });

        fileService.deleteDrawing('2').then(() => {
            fileService.getDrawings().then((drawings) => {
                expect(drawings.length).to.be.below(numberOfDrawings);
            });
        });
    });

    it('writeDrawings should save all the drawings in the server', async () => {
        let numberOfDrawings = 0;
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
        drawing.id = '2';
        drawingsOnServer.push(drawing);
        drawing.id = '3';
        drawingsOnServer.push(drawing);
        numberOfDrawings = drawingsOnServer.length;

        fileService.writeDrawings(drawingsOnServer).then(() => {
            fileService.getDrawings().then((drawings) => {
                expect(drawings.length).to.be.eql(numberOfDrawings);
            });
        });
    });

});
