import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplaylyToolbarWrapperComponent } from './displayly-toolbar-wrapper/displayly-toolbar-wrapper.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { DisplayComponent } from './display/display.component';
import { SlideComponent } from './slide/slide.component';
import { SceneComponent } from './scene/scene.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DisplaylyToolbarWrapperComponent,
    children: [ 
      {path: '', redirectTo: 'workspace', pathMatch: 'full' },
      {path: 'workspace', component: WorkspaceComponent}, 
      {path: 'slide', component: SlideComponent}, 
      {path: 'scene', component: SceneComponent}, 
      {path: 'display', component: DisplayComponent}, 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
