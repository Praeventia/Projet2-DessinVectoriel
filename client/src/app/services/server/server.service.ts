import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmailInfos } from 'src/app/classes/email';
import { Drawing } from '../../../../../common/communication/drawing';

@Injectable({
    providedIn: 'root',
})

export class ServerService {

    private readonly DRAWING_URL: string = 'http://localhost:3000/api/drawing';
    private readonly GALLERY_URL: string = 'http://localhost:3000/api/gallery';
    private readonly MAIL_URL: string = 'http://localhost:3000/api/email';

    constructor(public http: HttpClient) {}

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => of(result as T);
    }

    saveDrawing(drawing: Drawing): Observable<Drawing> {
        return this.http.post<Drawing>(this.DRAWING_URL, drawing).pipe(catchError(this.handleError<Drawing>('Sauvegarder le dessin')));
    }

    getDrawings(): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(this.GALLERY_URL).pipe(catchError(this.handleError<Drawing[]>('Accéder aux dessins')));
    }

    deleteDrawing(id: string): Observable<string> {
        return this.http.delete<string>(this.GALLERY_URL + '/' + id).pipe(catchError(this.handleError<string>('Supprimer le dessin')));
    }

    // We use any because we don't know what the api give us back
    // tslint:disable: no-any
    sendEmail(emailInf: EmailInfos): Observable<any> {
        return this.http.post<any>(this.MAIL_URL, emailInf).pipe(
            catchError(this.handleSendEmailErrors<any>('Envoyer dessin par courriel'))
        );
    }

    private handleSendEmailErrors<T>(request: string, result?: T): (error: Error) => Observable<Error> {
        return (error: Error): Observable<Error> => of(error);
    }
}
