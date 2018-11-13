import {MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatInputModule} from '@angular/material';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatInputModule, MatCardModule, ReactiveFormsModule, MatIconModule],
  exports: [MatButtonModule, MatCheckboxModule, MatInputModule, MatCardModule, ReactiveFormsModule, MatIconModule],
})
export class MaterialModulesModule {
}
