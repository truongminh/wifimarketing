import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from './input-text/input-text.component';
import { InputCheckboxComponent } from './input-checkbox/input-checkbox.component';

@NgModule({
  declarations: [InputTextComponent, InputCheckboxComponent],
  imports: [
    CommonModule
  ],
  exports: [InputTextComponent]
})
export class ObjInputModule { }
