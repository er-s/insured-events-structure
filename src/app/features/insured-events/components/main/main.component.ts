import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ReplaySubject, map, of, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import type * as Bootstrap from 'bootstrap';
import { Store } from '@ngrx/store';

declare const bootstrap: typeof Bootstrap;

@Component({
  selector: 'app-insured-events-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class InsuredEventsMainComponent implements OnInit, OnChanges {
  
  private readonly destroySignal$$ = new ReplaySubject<void>(1);

  private user: any = null;
  private real: any = null;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroySignal$$))
      .subscribe((queryParams: any) => {
        /* Do something here */
      });

    this.store
      .select('profile' as any)
      .pipe(takeUntil(this.destroySignal$$))
      .subscribe((profile: any) => {
        this.user = profile;
        if (this.user.real) {
          this.real = this.user.real;
          delete this.user.real;
        } else {
          this.real = null;
        }
      });
  }

  ngOnDestroy() {
    this.destroySignal$$.next();
    this.destroySignal$$.complete();
  }
}
