import { expect } from 'chai';
import * as sinon from 'sinon';
import { SendEmailService } from '../services/send-email.service';
import { SendEmailController } from './send-email.controller';

describe('save-drawing controller', () => {

    it('the router should call his methode', () => {

        const sendEmailConstroller = new SendEmailController(new SendEmailService());

        const spy = sinon.spy(sendEmailConstroller.router, 'post');
        sendEmailConstroller.configureRouter();

        expect(spy.called).to.equal(true);
    });

});
