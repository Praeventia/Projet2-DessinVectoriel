import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { SendEmailService } from '../services/send-email.service';
import Types from '../types';

@injectable()
export class SendEmailController {

    router: Router;

    constructor(@inject(Types.SendEmailService) private emailService: SendEmailService) {
        this.router = Router();
        this.configureRouter();
    }

    configureRouter(): void {
        this.router.post('/', this.emailService.sendEmail);
    }

}
