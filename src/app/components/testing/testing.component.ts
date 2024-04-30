import { Component, ElementRef, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { HostingDirective } from '../../directives/hosting.directive';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [HostingDirective, FormsModule, RouterModule],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.scss',
})
export class TestingComponent {
  @ViewChild('name', { static: true }) name: any;
  @Input()
  public my_name : any;
  // @Input('my_name') my_name : any;
  @Output()
  public event_value = new EventEmitter();
  
  constructor(public elemRef: ElementRef) {}

  ngOnInit() {
    this.name.nativeElement.focus();
  }

  submit(data: any) {
    console.log(data.value);
  }

  sendMessage(data:any){
    console.log('child',data.target.value);
    this.event_value.emit(data.target.value);
  }
}
