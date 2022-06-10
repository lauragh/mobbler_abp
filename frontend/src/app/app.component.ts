import {
  Component,
  OnInit,
  Renderer2,
  HostListener,
  Inject,
  ViewEncapsulation
} from "@angular/core";

import { Location } from "@angular/common";
import { DOCUMENT } from "@angular/common";
import { TasksService } from "./tasks.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  constructor(
    private llamada: TasksService,
    private renderer: Renderer2,
    public location: Location,
    @Inject(DOCUMENT) document
  ) {}
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(e) {
    if (window.pageYOffset > 100) {
      var element = document.getElementById("navbar-top");
      if (element) {
        element.classList.remove("navbar-transparent");
        element.classList.add("bg-danger");
      }
    } else {
      var element = document.getElementById("navbar-top");
      if (element) {
        element.classList.add("navbar-transparent");
        element.classList.remove("bg-danger");
      }
    }
  }
  ngOnInit(): void {
    // console.log('Llamada');
    // this.onWindowScroll(event);
    this.llamada.miLlamada().subscribe(res => {
        // console.log('Llamada devuelve: ')
        // console.log(res);
      }, error => {
        //console.log('Llamada error:')
        // console.log(error);
      })
  }
}
