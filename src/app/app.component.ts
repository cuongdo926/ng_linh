import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { FilterType, Todo } from './model';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'my-app';
  service = inject(TodoService);

  vm$ = this.service.vm$;

  ngOnInit(): void {
    this.service.load();
  }

  toggle(item: Todo) {
    this.service.toggle(item);
  }

  addTodo(input: HTMLInputElement) {
    if (input.value) {
      this.service.addTodo(input.value);
    }
    input.value = '';
  }

  setFilter(type: FilterType) {
    this.service.setFilter(type);
  }
}
