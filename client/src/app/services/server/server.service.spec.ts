import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import { Drawing } from '../../../../../common/communication/drawing';
import { ServerService } from './server.service';

// to test a private method
// tslint:disable: no-string-literal
describe('ServerService', () => {
    let httpClientSpyGet: SpyObj<HttpClient>;

    beforeEach(() => {
        httpClientSpyGet = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
    });

    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [{ provide: HttpClient, useValue: httpClientSpyGet }],
        }),
    );

    it('saveDrawing should post a drawing', inject([ServerService], (service: ServerService) => {
        const drawing: Drawing = { id: 'allo', name: 'test', tags: ['test'], backgroundColor: 'rgb(0,0,0,0)',
        width: 5, height: 10, shapes: 'oui', drawingURI: 'je t\'aime test', };

        httpClientSpyGet.post.and.returnValue(of(drawing));

        service.saveDrawing(drawing).subscribe( (drawingdata) => {
            expect(drawingdata.id).toBe('allo');
        });

        expect(httpClientSpyGet.post.calls.count()).toBe(1, ' one call');
    }));

    it('getDrawing should return a drawing', inject([ServerService], (service: ServerService) => {
        const drawing: Drawing[] = [{ id: 'allo', name: 'test', tags: ['test'], backgroundColor: 'rgb(0,0,0,0)',
        width: 5, height: 10, shapes: 'oui', drawingURI: 'je t\'aime test', }];

        httpClientSpyGet.get.and.returnValue(of(drawing));

        service.getDrawings().subscribe( (drawingdata) => {
            expect(drawingdata[0].id).toBe('allo');
        });

        expect(httpClientSpyGet.get.calls.count()).toBe(1, ' one call');
    }));

    it('deleteDrawing should delete a drawing', inject([ServerService], (service: ServerService) => {
        const drawing = 'Im deleted';

        httpClientSpyGet.delete.and.returnValue(of(drawing));

        service.deleteDrawing(drawing).subscribe( (drawingdata) => {
            expect(drawingdata).toBe(drawing);
        });

        expect(httpClientSpyGet.delete.calls.count()).toBe(1, ' one call');
    }));

    it('sendEmail should post', inject([ServerService], (service: ServerService) => {
        // We use any because we don't know what the api give us back
        // tslint:disable: no-any
        const email: any = 'I\'m a test';

        httpClientSpyGet.post.and.returnValue(of(email));

        service.sendEmail(email).subscribe( (emailData) => {
            expect(emailData).toBe('I\'m a test');
        });

        expect(httpClientSpyGet.post.calls.count()).toBe(1, ' one call');
    }));

});
