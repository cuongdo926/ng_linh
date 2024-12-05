import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { map } from 'rxjs';

import { FilterType } from '../model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  service = inject(TodoService);

  filterType$ = this.service.state$.pipe(map((x) => x.filterType));
  activeCount$ = this.service.activeCount$;

  setFilter(type: FilterType) {
    this.service.setFilter(type);
  }

  clear() {
    this.service.clear();
  }
}
