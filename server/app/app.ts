import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import logger from 'morgan';
import { STATUS_CODES } from '../../common/communication/status-codes';
import { GalleryController } from './controllers/gallery.controller';
import { SaveDrawingController } from './controllers/save-drawing.controller';
import { SendEmailController } from './controllers/send-email.controller';
import Types from './types';

@injectable()
export class Application {

    app: express.Application;

    constructor(
        @inject(Types.SaveDrawingController) private saveDrawingController: SaveDrawingController,
        @inject(Types.GalleryController) private galleryController: GalleryController,
        @inject(Types.SendEmailController) private emailController: SendEmailController
    ) {
        this.app = express();
        this.config();
        this.connectDatabase();
        this.bindRoutes();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json({limit: '100mb'}));
        this.app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    bindRoutes(): void {
        // Notre application utilise le routeur de notre API `Index`
        this.app.use('/api/drawing', this.saveDrawingController.router);
        this.app.use('/api/gallery', this.galleryController.router);
        this.app.use('/api/email', this.emailController.router);
        this.errorHandling();
    }

    connectDatabase(): void {
        mongoose.connect('mongodb+srv://Rose:TempSalmon@log2990-owiha.mongodb.net/test?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        // change then and catch
            .then(() => console.log('Connexion à MongoDB réussie!'))
            .catch(() => console.log('Connexion à MongoDB échouée!'));
    }

    private errorHandling(): void {
        // When previous handlers have not served a request: path wasn't found
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            // tslint:disable-next-line:no-any
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || STATUS_CODES.INTERNAL_SERVER_ERROR);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || STATUS_CODES.INTERNAL_SERVER_ERROR);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
