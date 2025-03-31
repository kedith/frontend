import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ColumnPredicate } from '../../model/column-predicate';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css'],
})
export class DateFilterComponent {
  @ViewChild('filterMenu') matMenuTrigger;
  @Input() columnName: string;
  @Output() predicateEmitter = new EventEmitter<{
    columnPredicate: ColumnPredicate;
    filterValue: string;
  }>();
  operandInput;
  operator = (operand, value) => {
    return value != null
      ? this.parseNonIsoDate(value).getTime() === new Date(operand).getTime()
      : false;
  };

  constructor(public datepipe: DatePipe) {}

  ngOnInit() {}

  onValidation() {
    this.predicateEmitter.emit({
      columnPredicate: this.generatePredicate(),
      filterValue: this.datepipe.transform(this.operandInput, 'yyyy-MM-dd'),
    });
    this.matMenuTrigger.closed.emit();
  }

  isDisabled(): boolean {
    return !this.operandInput;
  }

  generatePredicate(): ColumnPredicate {
    return {
      name: this.columnName,
      predicate: (value) =>
        this.operator.apply(undefined, [this.operandInput, value]),
    };
  }

  parseNonIsoDate(dateString: string): Date {
    if (dateString) {
      const dateParts = dateString.split('-');
      return new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
    }
    return null;
  }
}
