import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { faker } from '@faker-js/faker';

import { FilterType, Todo } from './model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'my-app';
  items: Todo[] = [];
  filterType: FilterType = 'all';

  get activeCount() {
    return this.items.filter((x) => !x.completed).length;
  }

  get filteredItems() {
    switch (this.filterType) {
      case 'active':
        return this.items.filter((x) => !x.completed);
      case 'completed':
        return this.items.filter((x) => x.completed);
      default:
        return this.items;
    }
  }

  ngOnInit(): void {
    for (let index = 0; index < 5; index++) {
      this.items.push({
        name: faker.book.title(),
        completed: faker.datatype.boolean(),
      });
    }
  }

  toggle(item: Todo) {
    item.completed = !item.completed;
  }

  addTodo(input: HTMLInputElement) {
    if (input.value) {
      this.items.push({
        name: input.value,
        completed: false,
      });
    }
    input.value = '';
  }

  setFilter(type: FilterType) {
    this.filterType = type;
  }

  clear() {
    this.items = this.items.filter((x) => !x.completed);
  }
}
