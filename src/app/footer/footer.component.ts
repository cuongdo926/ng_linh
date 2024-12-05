import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterType } from '../model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  service = inject(TodoService);

  vm$ = this.service.vm$;

  setFilter(type: FilterType) {
    this.service.setFilter(type);
  }

  clear() {
    this.service.clear();
  }
}
