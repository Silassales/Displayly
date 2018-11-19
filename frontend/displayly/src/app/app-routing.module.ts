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
import {RecoverComponent} from './recover/recover.component';
import {LayoutTemplateComponent} from './layout-template/layout-template.component';

const routes: Routes = [

  {path: '', component: HomeComponent},
  {
    path: 'dashboard',
    component: DisplaylyToolbarWrapperComponent,
    children: [
      {path: '', redirectTo: 'workspace', pathMatch: 'full'},
      {path: 'workspaceWithId', component: SceneComponent},
      {path: 'workspace', component: WorkspaceComponent},
      {path: 'slide', component: SlideComponent},
      {path: 'scene', component: SceneComponent},
      {path: 'display', component: DisplayComponent}
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'recover', component: RecoverComponent},
  {path: '**', redirectTo: 'dashboard'} // This route must be the last route in the array or it will trigger before routes after it.
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
