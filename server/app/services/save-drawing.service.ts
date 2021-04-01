import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DrawingOnServer } from '../../../common/communication/drawing-on-server';
import { STATUS_CODES } from '../../../common/communication/status-codes';
import { Metadata } from '../models/metadata';
import metadataSchema from '../models/metadata-schema';
import Types from '../types';
import { FileService } from './file.service';

@injectable()
export class SaveDrawingService {

    constructor(@inject(Types.FileService) private fileService: FileService) {

    }

    saveDrawing = async (req: Request, res: Response, next: NextFunction) => {

        this.fileService.accessFile().catch(async () => await this.fileService.createFile());

        this.verifyNameAndTags(req.body.name, req.body.tags)
            .then((areNameAndTagsValid) => {
                if (!areNameAndTagsValid) {
                    const alert = 'Le nom et/ou les étiquettes du dessin ne doivent pas être vides ou ne contenir que des espaces.';
                    res.status(STATUS_CODES.BAD_REQUEST).json({ message: alert });
                }
            });

        this.saveDrawingOnDatabase(req.body.name, req.body.tags)
            .then(async (returnedMetadata) => {
                const drawing: DrawingOnServer = {
                    id: returnedMetadata._id,
                    backgroundColor: req.body.backgroundColor,
                    width: req.body.width,
                    height: req.body.height,
                    shapes: req.body.shapes,
                    drawingURI: req.body.drawingURI
                };
                this.saveDrawingOnServer(drawing)
                    .then(() => res.status(STATUS_CODES.CREATED).json('Le dessin a été sauvegardé avec succès!'))
                    .catch((error) => res.status(STATUS_CODES.BAD_REQUEST).json({ error }));
            })
            .catch((error) => {
                res.status(STATUS_CODES.BAD_REQUEST).json({ error });
            });
    }

    async saveDrawingOnDatabase(name: string, tags: string[]): Promise<Metadata> {
        const metadata = new metadataSchema({ name, tags });
        return metadata.save();
    }

    async saveDrawingOnServer(drawing: DrawingOnServer): Promise<void> {
        await this.fileService.saveDrawing(drawing);
    }

    async verifyNameAndTags(name: string, tags: string[]): Promise<boolean> {
        let areNameAndTagsValid = true;
        if (name.match(/^\s*$/) !== null) {
            areNameAndTagsValid = false;
        } else if (tags !== []) {
            for (const tag of tags) {
                if (tag.match(/^\s*$/) !== null) {
                    areNameAndTagsValid = false;
                }
            }
        }
        return areNameAndTagsValid;
    }

}
