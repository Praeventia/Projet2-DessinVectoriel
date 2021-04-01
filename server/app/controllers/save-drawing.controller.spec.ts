import { expect } from 'chai';
import * as sinon from 'sinon';
import { FileService } from '../services/file.service';
import { SaveDrawingService } from '../services/save-drawing.service';
import { SaveDrawingController } from './save-drawing.controller';

describe('save-drawing controller', () => {

    it('the router should call his methode', () => {

        const saveDrawController = new SaveDrawingController(new SaveDrawingService(new FileService()));

        const spy = sinon.spy(saveDrawController.router, 'post');
        saveDrawController.configureRouter();

        expect(spy.called).to.equal(true);
    });

});
