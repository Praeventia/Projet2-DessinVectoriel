import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GridService } from 'src/app/services/grid-service/grid.service';
import { AppComponent } from './components/app/app.component';
import { ColorMakerComponent } from './components/color/color-maker/color-maker.component';
import { ColorPickerComponent } from './components/color/color-picker/color-picker.component';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { ColorOptionComponent } from './components/drawing-work-place/color-option/color-option.component';
import { DrawingAreaComponent } from './components/drawing-work-place/drawing-area/drawing-area.component';
import { DrawingOptionsComponent } from './components/drawing-work-place/drawing-options/drawing-options/drawing-options.component';
import { DrawingViewShapeBoxComponent } from './components/drawing-work-place/drawing-view-shape-box/drawing-view-shape-box.component';
import { DrawingViewToolBoxComponent } from './components/drawing-work-place/drawing-view-tool-box/drawing-view-tool-box.component';
import { DrawingViewUxComponent } from './components/drawing-work-place/drawing-view-ux/drawing-view-ux.component';
import { DrawingViewComponent } from './components/drawing-work-place/drawing-view/drawing-view.component';
import { FileOptionComponent } from './components/drawing-work-place/file-option/file-option.component';
import { PenOptionComponent } from './components/drawing-work-place/pen-option/pen-option.component';
import { SelectionOptionComponent } from './components/drawing-work-place/selection-option/selection-option.component';
import { ToolOptionComponent } from './components/drawing-work-place/tool-option/tool-option.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { ExportFormComponent } from './components/export-form/export-form.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { GridComponent } from './components/grid/grid.component';
import { GuideViewComponent } from './components/guide-view/guide-view.component';
import { NewDrawFormComponent } from './components/new-draw-form/new-draw-form.component';
import { SaveDrawingFormComponent } from './components/save-drawing-form/save-drawing-form.component';
import { EllipseComponent } from './components/shapes/ellipse/ellipse.component';
import { EraserComponent } from './components/shapes/eraser/eraser.component';
import { LineComponent } from './components/shapes/line/line.component';
import { PencilComponent } from './components/shapes/pencil/pencil.component';
import { PolygonComponent } from './components/shapes/polygon/polygon.component';
import { RectangleComponent } from './components/shapes/rectangle/rectangle.component';
import { ShapeComponent } from './components/shapes/shape/shape.component';
import { SprayComponent } from './components/shapes/spray/spray.component';
import { ColorService } from './services/color-service/color.service';
import { ModalWindowService } from './services/modal-window/modal-window.service';
import { ToolManagerService } from './services/tool-manager/tool-manager.service';

const appRoutes: Routes = [
    {path: 'accueil', component: EntryPointComponent},
    {path: 'galerie', component: GalleryComponent },
    {path: 'dessinOld', component: DrawingViewComponent},
    {path: 'dessin', component: DrawingViewUxComponent},
    {path: '**', redirectTo: 'accueil'},
];

@NgModule({
    declarations: [
        AppComponent,
        EntryPointComponent,
        GalleryComponent,
        GuideViewComponent,
        NewDrawFormComponent,
        DrawingViewComponent,
        DrawingAreaComponent,
        RectangleComponent,
        SprayComponent,
        ShapeComponent,
        LineComponent,
        ColorPickerComponent,
        ColorMakerComponent,
        DrawingViewToolBoxComponent,
        DrawingViewShapeBoxComponent,
        PencilComponent,
        ConfirmationPopupComponent,
        EllipseComponent,
        PolygonComponent,
        GridComponent,
        DrawingOptionsComponent,
        EraserComponent,
        SaveDrawingFormComponent,
        ExportFormComponent,
        DrawingViewUxComponent,
        SelectionOptionComponent,
        PenOptionComponent,
        ToolOptionComponent,
        ColorOptionComponent,
        FileOptionComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        BrowserAnimationsModule,
        MatDialogModule,
        BrowserModule,
        HttpClientModule,
        FontAwesomeModule,
        MatSliderModule,
        MatSelectModule,
        NgbModule,
        FormsModule],
    providers: [
        ModalWindowService,
        ColorService,
        ToolManagerService,
        GridService, ],
    entryComponents: [
        GuideViewComponent,
        NewDrawFormComponent,
        ColorMakerComponent,
        ConfirmationPopupComponent,
        SaveDrawingFormComponent,
        ExportFormComponent,
        ConfirmationPopupComponent
        ],
    bootstrap: [
        AppComponent],

})

export class AppModule {}
