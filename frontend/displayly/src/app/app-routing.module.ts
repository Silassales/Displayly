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
import {CreateSlideComponent} from './create-slide/create-slide.component';
import {ShowDisplayComponent} from './show-display/show-display.component';
import {SlideDisplayComponent} from './slide-display/slide-display.component';

const routes: Routes = [

  {path: '', component: HomeComponent},
  {
    path: 'dashboard',
    component: DisplaylyToolbarWrapperComponent,
    children: [
      {path: '', redirectTo: 'workspaceId', pathMatch: 'full'},
      {path: 'workspaceWithId', component: SceneComponent},
      {path: 'workspaceId', component: WorkspaceComponent},
      {path: 'slide', component: SlideComponent},
      {path: 'createSlide', component: CreateSlideComponent},
      {path: 'scene', component: SceneComponent},
      {path: 'display', component: DisplayComponent}
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'recover', component: RecoverComponent},
  {path: 'showDisplay', component: ShowDisplayComponent},
  {path: 'showSlide', component: SlideDisplayComponent},
  {path: '**', redirectTo: 'dashboard'} // This route must be the last route in the array or it will trigger before routes after it.
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
