import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  private subject = new Subject<any>();
  constructor() { }

  sendCaptura(){
    this.subject.next();
  }

  getEvent():Observable<any>{
    return this.subject.asObservable();
 }
}
