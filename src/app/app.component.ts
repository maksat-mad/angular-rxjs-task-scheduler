import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, animationFrameScheduler, asapScheduler, asyncScheduler, delay, interval, observeOn, of, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <div [style.width.%]="progress$ | async" class="loader"></div>
      <div [style.width.%]="progress2$ | async" class="loader crimson"></div>
      <h1>RxJS Scheduler</h1>
      <button (click)="runAsync()">Run Async Tasks</button>
    </main>
  `,
  styles: [
    `
      .loader {
        height: 25px;
        background-color: green;
      }
      .crimson {
        background-color: crimson;
      }
    `
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  progress$!: Observable<number>;
  progress2$!: Observable<number>;
  ngDestroy = new Subject<void>();

  ngOnInit() {
    // real life use case
    this.progress$ = interval(1000 / 60).pipe(take(100));
    this.progress2$ = interval(100, animationFrameScheduler).pipe(take(100));
  }

  runAsync() {
    // asapScheduler: run task as a MICRO task
    Promise.resolve('Promise value').then(console.log);
    setTimeout(() => console.log('setTimeout callback'), 0);
    of("Stream value").pipe(
      observeOn(asapScheduler),
      takeUntil(this.ngDestroy)
    ).subscribe({
      next: (value) => {
        console.log(value);
      }
    });

    // asyncScheduler: run task as a MACRO task
    of("Stream value").pipe(
      // delay(0, asyncScheduler),
      observeOn(asyncScheduler),
      takeUntil(this.ngDestroy)
    ).subscribe({
      next: (value) => {
        console.log(value);
      }
    });
    setTimeout(() => console.log('setTimeout callback'), 0);
    Promise.resolve('Promise value').then(console.log);
  }

  ngOnDestroy() {
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }
}
