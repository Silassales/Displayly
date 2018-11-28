import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatSidenavModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatStepperModule,
  MatSnackBarModule,
  MatGridListModule, MatDialogModule, MatDividerModule, MatSelectModule, MatExpansionModule, MatTooltipModule
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
    MatSnackBarModule,
    MatDialogModule,
    MatDividerModule,
    MatSelectModule,
    MatExpansionModule,
    MatTooltipModule
  ],
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
    MatSnackBarModule,
    MatDialogModule,
    MatDividerModule,
    MatSelectModule,
    MatExpansionModule,
    MatTooltipModule
  ]

})
export class MaterialModulesModule {
}
