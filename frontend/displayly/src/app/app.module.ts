import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModulesModule} from './material-modules/material-modules.module';
import { DisplaylyToolbarWrapperComponent } from './displayly-toolbar-wrapper/displayly-toolbar-wrapper.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { DisplayComponent } from './display/display.component';
import { SlideComponent } from './slide/slide.component';
import { SceneComponent } from './scene/scene.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplaylyToolbarWrapperComponent,
    WorkspaceComponent,
    DisplayComponent,
    SlideComponent,
    SceneComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModulesModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
