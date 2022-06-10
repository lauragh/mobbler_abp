import {  ElementRef, Renderer2, RendererFactory2, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HomeService {
  @ViewChild('notification') notification: ElementRef;
  renderer: Renderer2;
  public isShown = false;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setNotification(value: boolean){
    this.isShown = value;
  }
}
