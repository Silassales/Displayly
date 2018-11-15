
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule, MatInputModule, MatSidenavModule, MatMenuModule, MatProgressSpinnerModule, MatStepperModule, MatSnackBarModule, MatGridListModule
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
    MatGridListModule,
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
    MatGridListModule,
    MatSnackBarModule]

})
export class MaterialModulesModule {
}
