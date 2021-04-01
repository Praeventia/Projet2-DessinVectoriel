import { SELECT_FILE_TYPE } from '../services/enum/file-type';

export interface EmailInfos {
    email: string;
    imageURI: string;
    imageType: SELECT_FILE_TYPE;
    drawingName: string;
}
