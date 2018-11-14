
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule, MatInputModule, MatSidenavModule, MatMenuModule, MatProgressSpinnerModule
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
    MatProgressSpinnerModule],
  exports: [MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatProgressSpinnerModule],

})
export class MaterialModulesModule {
}
