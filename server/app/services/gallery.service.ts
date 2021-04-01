import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Drawing } from '../../../common/communication/drawing';
import { DrawingOnServer } from '../../../common/communication/drawing-on-server';
import { STATUS_CODES } from '../../../common/communication/status-codes';
import metadataSchema from '../models/metadata-schema';
import Types from '../types';
import { FileService } from './file.service';

@injectable()
export class GalleryService {

    constructor(@inject(Types.FileService) private fileService: FileService) {}

    getDrawings = async (req: Request, res: Response, next: NextFunction) => {

        this.fileService.accessFile().catch(async () => await this.fileService.createFile());

        let drawings: Drawing[] = [];
        try {
            const drawingsOnServer: DrawingOnServer[] = await this.fileService.getDrawings();
            drawings = await this.getAllDrawings(drawingsOnServer);
            res.status(STATUS_CODES.OK).json(drawings);
        } catch (error) {
            drawings = [];
            res.status(STATUS_CODES.NOT_FOUND).json(drawings);
        }
    }

    deleteDrawing = async (req: Request, res: Response, next: NextFunction) => {

        this.fileService.accessFile().catch(async () => await this.fileService.createFile());

        await metadataSchema.deleteOne({ _id: req.params.id })
            .then(async () => {
                this.fileService.deleteDrawing(req.params.id)
                    .then(() => res.status(STATUS_CODES.OK).json('Le dessin a été supprimé avec succès!'))
                    .catch((error) => res.status(STATUS_CODES.BAD_REQUEST).json({ error }));
            })
            .catch((error) => res.status(STATUS_CODES.BAD_REQUEST).json({ error }));
    }

    async getAllDrawings(drawingsOnServer: DrawingOnServer[]): Promise<Drawing[]> {
        const drawings: Drawing[] = [];
        for (const drawingOnServer of drawingsOnServer) {
            await metadataSchema.findOne({ _id: drawingOnServer.id })
                .then((metadata) => {
                    if (metadata) {
                        const drawing: Drawing = {
                            id: drawingOnServer.id,
                            name: metadata.name,
                            tags: metadata.tags,
                            backgroundColor: drawingOnServer.backgroundColor,
                            width: drawingOnServer.width,
                            height: drawingOnServer.height,
                            shapes: drawingOnServer.shapes,
                            drawingURI: drawingOnServer.drawingURI
                        };
                        drawings.push(drawing);
                    }
                });
        }
        return drawings;
    }

}
