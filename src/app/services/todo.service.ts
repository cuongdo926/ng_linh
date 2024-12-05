import { Injectable } from '@angular/core';

import { BehaviorSubject, map } from 'rxjs';

import { faker } from '@faker-js/faker';

import { FilterType, Todo } from '../model';

type State = {
  filterType: FilterType;
  items: Todo[];
};

const initialState: State = {
  filterType: 'all',
  items: [],
};

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private _state$ = new BehaviorSubject<State>(initialState);
  state$ = this._state$.asObservable();

  filterType$ = this._state$.pipe(map((x) => x.filterType));
  activeCount$ = this._state$.pipe(
    map((x) => x.items.filter((x) => !x.completed).length)
  );

  filteredItems$ = this._state$.pipe(
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

  load(): void {
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
    this.patchValue({
      items: this._state$.value.items.map((todo) =>
        todo.id === item.id ? { ...todo, completed: !todo.completed } : todo
      ),
    });
  }

  addTodo(title: string) {
    if (!title) {
      return;
    }

    let newItems = [
      ...this._state$.value.items,
      {
        id: faker.string.uuid(),
        title: title,
        completed: false,
      },
    ];
    this.patchValue({
      items: newItems,
    });
  }

  setFilter(type: FilterType) {
    this.patchValue({
      filterType: type,
    });
  }

  clear() {
    this.patchValue({
      items: this._state$.value.items.filter((x) => !x.completed),
    });
  }

  patchValue(value: Partial<State>) {
    this._state$.next({
      ...this._state$.value,
      ...value,
    });
  }
}
