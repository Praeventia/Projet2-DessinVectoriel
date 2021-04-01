import { access, constants, readFile, writeFile } from 'fs';
import { injectable } from 'inversify';
import 'reflect-metadata';
import * as util from 'util';
import { DrawingOnServer } from '../../../common/communication/drawing-on-server';

@injectable()
export class FileService {

    private readonly SPACES: number = 2;
    private readonly ENCODING: string = 'utf8';
    private readonly FILE: string = 'drawings.json';

    constructor() {
        this.accessFile().catch(async () => await this.createFile());
    }

    async write(data: string): Promise<void> {
        return util.promisify(writeFile)(this.FILE, data, this.ENCODING);
    }

    async read(): Promise<string> {
        return util.promisify(readFile)(this.FILE, this.ENCODING);
    }

    async accessFile(): Promise<void> {
        return util.promisify(access)(this.FILE, constants.F_OK);
    }

    async createFile(): Promise<void> {
        const data = JSON.stringify([], null, this.SPACES);
        await this.write(data);
    }

    async saveDrawing(drawing: DrawingOnServer): Promise<void> {
        const drawingsOnServer = await this.getDrawings();
        drawingsOnServer.push(drawing);
        await this.writeDrawings(drawingsOnServer);
    }

    async deleteDrawing(id: string): Promise<void> {
        const drawingsOnServer: DrawingOnServer[] = await this.getDrawings();
        const newDrawingsOnServer: DrawingOnServer[] = [];
        for (const drawing of drawingsOnServer) {
            if (id !== drawing.id) {
                newDrawingsOnServer.push(drawing);
            }
        }
        await this.writeDrawings(newDrawingsOnServer);
    }

    async getDrawings(): Promise<DrawingOnServer[]> {
        const content = await this.read();
        return JSON.parse(content);
    }

    async writeDrawings(drawingsOnServer: DrawingOnServer[]): Promise<void> {
        await this.createFile();
        const data = JSON.stringify(drawingsOnServer, null, this.SPACES);
        await this.write(data);
    }

}
