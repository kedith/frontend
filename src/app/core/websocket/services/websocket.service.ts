import { Injectable } from '@angular/core';
import { WebSocketAPI } from '../websocketAPI';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  webSocketAPI: WebSocketAPI;
  name: string;

  constructor() {
    this.webSocketAPI = new WebSocketAPI();
  }

  connect() {
    this.webSocketAPI.connect();
  }
}
