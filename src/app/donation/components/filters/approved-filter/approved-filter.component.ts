import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ColumnPredicate } from '../../model/column-predicate';

@Component({
  selector: 'app-approved-filter',
  templateUrl: './approved-filter.component.html',
  styleUrls: ['./approved-filter.component.css'],
})
export class ApprovedFilterComponent {
  @ViewChild('filterMenu') matMenuTrigger;
  @Input() columnName: string;
  @Output() predicateEmitter = new EventEmitter<{
    columnPredicate: ColumnPredicate;
    filterValue: string;
  }>();
  protected readonly Object = Object;
  operandInput;
  operator = (input, value) => {
    return input.toString() === value.toString();
  };

  constructor() {}

  onValidation() {
    this.predicateEmitter.emit({
      columnPredicate: this.generatePredicate(),
      filterValue: this.operandInput.toString(),
    });
    this.matMenuTrigger.closed.emit();
  }

  isDisabled(): boolean {
    return this.operandInput == null;
  }

  generatePredicate(): ColumnPredicate {
    return {
      name: this.columnName,
      predicate: (value) => {
        return this.operator.apply(undefined, [this.operandInput, value]);
      },
    };
  }
}
