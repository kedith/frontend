import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ColumnPredicate } from '../../model/column-predicate';

@Component({
  selector: 'app-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.css'],
})
export class TextFilterComponent {
  @ViewChild('filterMenu') matMenuTrigger;
  @Input() columnName: string;
  @Output() predicateEmitter = new EventEmitter<{
    columnPredicate: ColumnPredicate;
    filterValue: any;
  }>();
  operandInput = '';
  operator = (input, value) =>
    String(value).toLowerCase().includes(input.toLowerCase());

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
      predicate: (value) => {
        return this.operator.apply(undefined, [this.operandInput, value]);
      },
    };
  }

  changeOperand($event: Event) {
    const operand = ($event.target as HTMLInputElement).value;
    this.operandInput = operand.trim();
  }
}
