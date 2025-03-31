import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthorizationService } from '../service/authorization.service';
import { ERight } from '../../../permission/model/ERight';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[hasPermissions]',
  standalone: true,
})
export class HasPermissionsDirective implements OnDestroy {
  @Input() set hasPermissions(permissions: ERight[]) {
    this.updateView(permissions);
  }
  private isHidden = false;

  private _directiveDestroy$ = new Subject<void>();
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) {}

  ngOnDestroy(): void {
    this._directiveDestroy$.next();
    this._directiveDestroy$.complete();
  }
  private updateView(permissions: ERight[]) {
    this.authorizationService.userPermissions$
      .pipe(takeUntil(this._directiveDestroy$))
      .subscribe(() => {
        this.authorizationService
          .hasPermissions(permissions)
          .then((result: boolean) => {
            if (result && !this.isHidden) {
              this.viewContainer.createEmbeddedView(this.templateRef);
              this.isHidden = true;
            } else if (!result && this.isHidden) {
              this.viewContainer.clear();
              this.isHidden = false;
            }
          });
      });
  }
}
