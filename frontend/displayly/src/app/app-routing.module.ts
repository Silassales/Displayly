import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DisplaylyToolbarWrapperComponent} from './displayly-toolbar-wrapper/displayly-toolbar-wrapper.component';
import {WorkspaceComponent} from './workspace/workspace.component';
import {DisplayComponent} from './display/display.component';
import {SlideComponent} from './slide/slide.component';
import {SceneComponent} from './scene/scene.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {
    path: 'dashboard',
    component: DisplaylyToolbarWrapperComponent,
    children: [
      {path: '', redirectTo: 'workspace', pathMatch: 'full'},
      {path: 'workspace', component: WorkspaceComponent},
      {path: 'slide', component: SlideComponent},
      {path: 'scene', component: SceneComponent},
      {path: 'display', component: DisplayComponent},
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', component: LoginComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
