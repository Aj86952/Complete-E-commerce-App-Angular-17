import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [BrowserModule, HttpClientModule],
  bootstrap: [], // No root component bootstrapped here (handled by standalone components)
})
export class AppModule {}
