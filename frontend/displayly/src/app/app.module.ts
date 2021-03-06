import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModulesModule} from './material-modules/material-modules.module';

import {DisplaylyToolbarWrapperComponent} from './displayly-toolbar-wrapper/displayly-toolbar-wrapper.component';
import {WorkspaceComponent, WorkspaceHelpDialogComponent} from './workspace/workspace.component';
import {DisplayComponent, DisplayHelpDialogComponent} from './display/display.component';
import {SlideComponent, SlideHelpDialogComponent} from './slide/slide.component';
import {SceneComponent, SceneHelpDialogComponent} from './scene/scene.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {RecoverComponent} from './recover/recover.component';
import {CreateWorkspaceModalComponent} from './create-workspace-modal/create-workspace-modal.component';
import {CreateSceneModalComponent} from './create-scene-modal/create-scene-modal.component';
import { CreateSlideComponent } from './create-slide/create-slide.component';
import {BoxComponent, LayoutTemplateComponent} from './layout-template/layout-template.component';
import { CreateDisplayModalComponent } from './create-display-modal/create-display-modal.component';
import { SlideDisplayComponent } from './slide-display/slide-display.component';
import { AddSlidesModalComponent } from './add-slides-modal/add-slides-modal.component';
import { SceneDisplayComponent } from './scene-display/scene-display.component';
import { AddSceneModalComponent } from './add-scene-modal/add-scene-modal.component';
import { ShowDisplayComponent } from './show-display/show-display.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AddUserToWorkspaceComponent } from './add-user-to-workspace/add-user-to-workspace.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplaylyToolbarWrapperComponent,
    WorkspaceComponent,
    WorkspaceHelpDialogComponent,
    DisplayComponent,
    DisplayHelpDialogComponent,
    SlideComponent,
    SlideHelpDialogComponent,
    SceneComponent,
    SceneHelpDialogComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    RecoverComponent,
    CreateWorkspaceModalComponent,
    CreateSceneModalComponent,
    CreateSlideComponent,
    LayoutTemplateComponent,
    BoxComponent,
    CreateDisplayModalComponent,
    SlideDisplayComponent,
    AddSlidesModalComponent,
    SceneDisplayComponent,
    AddSceneModalComponent,
    ShowDisplayComponent,
    ConfirmDialogComponent,
    AddUserToWorkspaceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModulesModule,
    AppRoutingModule,
    HttpClientModule
  ],
  entryComponents: [
    CreateWorkspaceModalComponent,
    CreateSceneModalComponent,
    CreateDisplayModalComponent,
    AddSlidesModalComponent,
    AddSceneModalComponent,
    ConfirmDialogComponent,
    WorkspaceHelpDialogComponent,
    SlideHelpDialogComponent,
    SceneHelpDialogComponent,
    DisplayHelpDialogComponent,
    AddUserToWorkspaceComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
