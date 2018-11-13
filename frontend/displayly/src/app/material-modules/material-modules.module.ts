import {MatButtonModule, MatCheckboxModule, MatSidenavModule, MatMenuModule, MatIconModule} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatSidenavModule, MatMenuModule, MatIconModule],
  exports: [MatButtonModule, MatCheckboxModule, MatSidenavModule, MatMenuModule, MatIconModule],
})
export class MaterialModulesModule { }
