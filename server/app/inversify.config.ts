import { Container } from 'inversify';
import { Application } from './app';
import { GalleryController } from './controllers/gallery.controller';
import { SaveDrawingController } from './controllers/save-drawing.controller';
import { SendEmailController } from './controllers/send-email.controller';
import { Server } from './server';
import { FileService } from './services/file.service';
import { GalleryService } from './services/gallery.service';
import { SaveDrawingService } from './services/save-drawing.service';
import { SendEmailService } from './services/send-email.service';
import Types from './types';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.SaveDrawingController).to(SaveDrawingController);
container.bind(Types.SaveDrawingService).to(SaveDrawingService);

container.bind(Types.GalleryController).to(GalleryController);
container.bind(Types.GalleryService).to(GalleryService);

container.bind(Types.SendEmailController).to(SendEmailController);
container.bind(Types.SendEmailService).to(SendEmailService);

container.bind(Types.FileService).to(FileService);

export { container };
