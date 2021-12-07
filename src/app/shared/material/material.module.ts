import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule, } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressBarModule,
    FormsModule,
  ],
  exports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressBarModule,
    FormsModule,
  ]
})
export class MaterialModule { }
