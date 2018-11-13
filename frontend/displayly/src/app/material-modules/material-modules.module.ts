
import {MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule, MatInputModule, MatSidenavModule, MatMenuModule} from '@angular/material';

import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule, MatIconModule, MatSidenavModule, MatMenuModule],
  exports: [MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule, ReactiveFormsModule, MatIconModule, MatSidenavModule, MatMenuModule],

})
export class MaterialModulesModule {
}
