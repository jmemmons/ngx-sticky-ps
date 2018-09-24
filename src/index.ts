import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStickyPsDirective } from 'ngx-sticky.directive';
export * from 'ngx-sticky.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    NgxStickyPsDirective
  ],
  exports: [
    NgxStickyPsDirective
  ]
})
export class NgxStickyPsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxStickyPsModule
    };
  }
}
