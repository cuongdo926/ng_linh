import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, delay, map, tap } from 'rxjs';

import { faker } from '@faker-js/faker';

import { FilterType, Todo } from '../model';

type State = {
  filterType: FilterType;
  items: Todo[];
  isLoading: boolean;
};

const initialState: State = {
  filterType: 'all',
  items: [],
  isLoading: false,
};

@Injectable()
export class TodoService {
  private http = inject(HttpClient);

  private state$ = new BehaviorSubject<State>(initialState);

  private filterType$ = this.state$.pipe(map((x) => x.filterType));
  activeCount$ = this.state$.pipe(
    map((x) => x.items.filter((x) => !x.completed).length)
  );
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

  vm$ = combineLatest([
    this.state$,
    this.activeCount$,
    this.filteredItems$,
  ]).pipe(
    map(([{ filterType, isLoading }, count, filteredItems]) => {
      return {
        filteredItems: filteredItems,
        filterType: filterType,
        count: count,
        isLoading: isLoading,
      };
    })
  );

  load(): void {
    // let items: Todo[] = [];
    // for (let index = 0; index < 5; index++) {
    //   items.push({
    //     id: faker.string.uuid(),
    //     title: faker.book.title(),
    //     completed: faker.datatype.boolean(),
    //   });
    // }
    // this.patchValue({
    //   items: items,
    // });
    this.patchState({
      isLoading: true,
    });
    this.http
      .get<Todo[]>(`https://jsonplaceholder.typicode.com/todos?_limit=10`)
      .pipe(
        delay(2000),
        tap((items) => {
          this.patchState({
            items: items,
            isLoading: false,
          });
        })
      )
      .subscribe();
  }

  toggle(item: Todo) {
    this.patchState({
      items: this.state$.value.items.map((todo) =>
        todo.id === item.id ? { ...todo, completed: !todo.completed } : todo
      ),
    });
  }

  addTodo(title: string) {
    if (!title) {
      return;
    }

    let newItems = [
      ...this.state$.value.items,
      {
        id: faker.string.uuid(),
        title: title,
        completed: false,
      },
    ];
    this.patchState({
      items: newItems,
    });
  }

  setFilter(type: FilterType) {
    this.patchState({
      filterType: type,
    });
  }

  clear() {
    this.patchState({
      items: this.state$.value.items.filter((x) => !x.completed),
    });
  }

  patchState(value: Partial<State>) {
    this.state$.next({
      ...this.state$.value,
      ...value,
    });
  }
}
