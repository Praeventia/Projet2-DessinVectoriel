import Axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import FD from 'form-data';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { EmailInfos } from '../../../client/src/app/classes/email';
import { SELECT_FILE_TYPE } from '../../../client/src/app/services/enum/file-type';

@injectable()
export class SendEmailService {

    instance: AxiosInstance;
    private readonly MAIL_API_URL: string = 'https://log2990.step.polymtl.ca/email?address_validation=True&quick_return=False';

    constructor() {
        this.instance = Axios.create();
        dotenv.config();
    }

    // tslint:disable: no-any because of the API response
    sendEmail = async (req: Request, res: Response, next: NextFunction) => {
        if (!this.emailValidation(req.body.email)) {
            console.log('invalid email');
            res.json({message: 'invalid email', success: false});
        } else {
            const emailInfo: EmailInfos = {
                email: req.body.email,
                imageURI: req.body.imageURI,
                imageType: req.body.imageType,
                drawingName: req.body.drawingName,
            };

            this.sendImgEmail(emailInfo).then((result: any) => {
                res.json({message: result.data, success: true});
            })
            .catch((error: Error) => {
                console.log(error);
                res.json({message: error, succes: false});
            });
         }
    }

    async sendImgEmail(emailInfo: EmailInfos): Promise<any> {
        return new Promise(async (resolve: any, reject: any) => {
            const imageSplit: string[] = emailInfo.imageURI.split(',');
            const imgBuffer = Buffer.from(imageSplit[1], 'base64');

            const fD = this.createFormData(emailInfo, imgBuffer);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Team-Key': process.env.API_KEY,
                    ...fD.getHeaders(),
                }
            };

            try {
                const result = await this.instance.post(this.MAIL_API_URL, fD, config);
                resolve(result);
            } catch (err) {
                console.log(err.message);
                reject(err.message);
            }
            });
    }

    emailValidation(email: string): boolean {
        const emailRegex = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
        return emailRegex.test(email);
    }

    createFormData(emailInfo: EmailInfos, imgBuffer: Buffer): FD {
        const processedData: string[] = this.pickContentFormat(emailInfo.drawingName, emailInfo.imageType);
        const contentFormat = processedData[0];
        emailInfo.drawingName = processedData[1];

        const fD = new FD();
        fD.append('to', emailInfo.email);
        fD.append('payload', imgBuffer, {
                contentType: contentFormat,
                filename: emailInfo.drawingName,
                knownLength: imgBuffer.byteLength
            });
        return fD;
    }

    pickContentFormat(drawingName: string, imageType: SELECT_FILE_TYPE): string[] {
        let contentFormat = '';
        switch (imageType) {
            case SELECT_FILE_TYPE.SVG:
                contentFormat = 'image/svg+xml';
                drawingName += '.svg';
                break;
            case SELECT_FILE_TYPE.PNG:
                contentFormat = 'image/png';
                drawingName += '.png';
                break;
            case SELECT_FILE_TYPE.JPG:
                contentFormat = 'image/jpeg';
                drawingName += '.jpeg';
                break;
        }
        const result: string[] = [contentFormat, drawingName];
        return result;
    }

}
