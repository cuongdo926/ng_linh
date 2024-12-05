import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BehaviorSubject, map } from 'rxjs';

import { faker } from '@faker-js/faker';

import { FilterType, Todo } from './model';

type State = {
  filterType: FilterType;
  items: Todo[];
};

const initialState: State = {
  filterType: 'all',
  items: [],
};

// type State = typeof initialState;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'my-app';
  state$ = new BehaviorSubject<State>(initialState);

  // filterType$ = new BehaviorSubject<FilterType>('all');
  // items$ = new BehaviorSubject<Todo[]>([]);

  // filteredItems$ = combineLatest([this.items$, this.filterType$]).pipe(
  //   map(([items, filterType]) => {
  //     switch (filterType) {
  //       case 'active':
  //         return items.filter((x) => !x.completed);
  //       case 'completed':
  //         return items.filter((x) => x.completed);
  //       default:
  //         return items;
  //     }
  //   })
  // );

  filterType$ = this.state$.pipe(map((x) => x.filterType));
  filteredItems$ = this.state$.pipe(
    map(({ filterType, items }) => {
      switch (filterType) {
        case 'active':
          return items.filter((x) => !x.completed);
        case 'completed':
          return items.filter((x) => x.completed);
        default:
          return items;
      }
    })
  );

  get activeCount() {
    return this.state$.value.items.filter((x) => !x.completed).length;
  }

  ngOnInit(): void {
    let items: Todo[] = [];
    for (let index = 0; index < 5; index++) {
      items.push({
        id: faker.string.uuid(),
        title: faker.book.title(),
        completed: faker.datatype.boolean(),
      });
    }
    this.patchValue({
      items: items,
    });
  }

  toggle(item: Todo) {
    item.completed = !item.completed;
  }

  addTodo(input: HTMLInputElement) {
    if (input.value) {
      let newItems = [
        ...this.state$.value.items,
        {
          id: faker.string.uuid(),
          title: input.value,
          completed: false,
        },
      ];
      this.patchValue({
        items: newItems,
      });
    }
    input.value = '';
  }

  setFilter(type: FilterType) {
    // this.filterType$.next(type);
    this.patchValue({
      filterType: type,
    });
  }

  clear() {
    this.patchValue({
      items: this.state$.value.items.filter((x) => !x.completed),
    });
  }

  patchValue(value: Partial<State>) {
    this.state$.next({
      ...this.state$.value,
      ...value,
    });
  }
}
