import { Injectable } from '@angular/core';
import { SELECT_FILE_TYPE} from '../enum/file-type';
import { SELECT_FILTER_TYPE } from '../enum/filters';

@Injectable({
    providedIn: 'root'
})

export class ImageTransformationService {

  svgToImage(svgNodes: string, backgroundColor: string, height: number,
             width: number, drawingFilter: SELECT_FILTER_TYPE): HTMLImageElement {
    let svgString = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width.toString();
    svgString += '" height="' + height.toString();
    svgString += '" filter="' + drawingFilter + '" version="1.1">';
    svgString += '<rect width="100%" height="100%" fill="' + backgroundColor + '"/>';
    svgString += svgNodes;
    svgString += '</svg>';
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
    img.height = height;
    img.width = width;
    return img;
  }

  async preview(canvas: HTMLCanvasElement, svgNodes: string,  backgroundColor: string,
                height: number, width: number, drawingFilter: SELECT_FILTER_TYPE,
                dataURI: string, fileType: SELECT_FILE_TYPE): Promise<string> {
    const imgLoadPromise: Promise<void> = new Promise((resolve) => {
      const img: HTMLImageElement = this.svgToImage(svgNodes, backgroundColor, height, width, drawingFilter);
      img.onload = () => {
        dataURI = this.onLoadManipulation(canvas, img, dataURI, fileType);
        resolve();
      };
    });
    try {
      await imgLoadPromise;
      return dataURI;
    } catch (error) {
      console.log(error);
      return 'null';
    }
  }

  onLoadManipulation(canvas: HTMLCanvasElement, image: HTMLImageElement, dataURI: string, fileType: SELECT_FILE_TYPE): string {
    canvas.width = image.width;
    canvas.height = image.height;

    const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(image, 0, 0);

    switch (fileType) {
      case (SELECT_FILE_TYPE.SVG) :
        dataURI = image.src;
        break;
      case (SELECT_FILE_TYPE.PNG) :
        dataURI = canvas.toDataURL('image/png');
        break;
      case (SELECT_FILE_TYPE.JPG) :
        dataURI = canvas.toDataURL('image/jpeg');
        break;
    }
    return dataURI;
  }
}
