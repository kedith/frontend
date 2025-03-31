import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ColumnPredicate } from '../../model/column-predicate';

@Component({
  selector: 'app-number-filter',
  templateUrl: './number-filter.component.html',
  styleUrls: ['./number-filter.component.css'],
})
export class NumberFilterComponent {
  @ViewChild('filterMenu') matMenuTrigger;
  @Input() columnName: string;
  @Output() filterValueEmitter = new EventEmitter<number>();
  @Output() predicateEmitter = new EventEmitter<{
    columnPredicate: ColumnPredicate;
    filterValue: string;
  }>();
  operandInput = '';
  operator = (input, value) => value.toString().startsWith(input.toString());

  constructor() {}

  onValidation() {
    this.predicateEmitter.emit({
      columnPredicate: this.generatePredicate(),
      filterValue: this.operandInput,
    });
    this.matMenuTrigger.closed.emit();
  }

  isDisabled(): boolean {
    return this.operandInput.trim() === '';
  }

  generatePredicate(): ColumnPredicate {
    return {
      name: this.columnName,
      predicate: (value) =>
        this.operator.apply(undefined, [this.operandInput, value]),
    };
  }

  changeOperand($event: Event) {
    const operand = ($event.target as HTMLInputElement).value;
    this.operandInput = operand.trim();
  }
}
