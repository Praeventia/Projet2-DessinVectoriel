import { expect } from 'chai';
import * as sinon from 'sinon';
import { FileService } from '../services/file.service';
import { GalleryService } from '../services/gallery.service';
import { GalleryController } from './gallery.controller';

describe('galerry controller', () => {

    it('this router should call his methode', () => {

        const galleryController = new GalleryController(new GalleryService(new FileService()));

        const spy = sinon.spy(galleryController.router, 'get');
        galleryController.configureRouter();

        expect(spy.called).to.equal(true);
    });

});
