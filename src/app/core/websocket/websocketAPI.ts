import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { inject } from '@angular/core';
import { AuthorizationService } from '../authorization/service/authorization.service';
import { ERight } from '../../permission/model/ERight';
import { AuthenticationService } from '../authentication/service/authentication.service';
import { Observable } from 'rxjs';
import { Right } from '../../permission/model/Right';
import { HandleErrorService } from '../../utils/handle-error.service';

export class WebSocketAPI {
  alertCount = 0;
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  stompClient: any;
  authorizationService = inject(AuthorizationService);
  authenticationService = inject(AuthenticationService);
  errorService = inject(HandleErrorService);
  userPermissions$: Observable<Right[]>;

  constructor() {
    this.userPermissions$ = this.authorizationService.userPermissions$;
  }

  connect() {
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;

    this.stompClient.connect(
      { username: this.authenticationService.getLoggedInUsername() },
      function () {
        _this.userPermissions$.subscribe((permissions) => {
          if (
            permissions
              .map((permission) => permission.name)
              .includes(ERight.USER_MANAGEMENT)
          ) {
            _this.stompClient.subscribe(
              '/topic/userDeleted',
              function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
              }
            );

            _this.stompClient.subscribe(
              '/topic/userDeactivated',
              function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
              }
            );

            _this.stompClient.subscribe(
              '/topic/userUpdated',
              function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
              }
            );
          }
        });
      }
    );
  }

  onMessageReceived(message) {
    this.errorService.handleInformative(message.body);
  }
}
