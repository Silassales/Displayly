
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule, MatInputModule, MatSidenavModule, MatMenuModule, MatProgressSpinnerModule, MatStepperModule, MatSnackBarModule
} from '@angular/material';

import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule],
  exports: [MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule],

})
export class MaterialModulesModule {
}
