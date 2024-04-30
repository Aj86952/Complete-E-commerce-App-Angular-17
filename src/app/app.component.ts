import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TestingComponent } from './components/testing/testing.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        CommonModule,
        RouterOutlet,
        FormsModule,
        RouterModule,
        TestingComponent,
        HeaderComponent,
        FooterComponent
    ]
})
export class AppComponent {
  title = 'e-shop';
  public full_name: any = '';
  public message: any;

  ngOnInit() {}

  receveMessage(msg: any) {
    console.log('parent', msg);
    this.message = msg;
  }
}
