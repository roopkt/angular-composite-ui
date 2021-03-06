import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

import { ProductApi } from '../core/product.api';

import {
  Add,
  AddSuccess,
  AddError
} from '../actions/product-actions';

import { Product } from '../models/product';
import { ProductActionTypes } from '../actions/product-actions';
import { ProductManagementConfig, PRODUCT_MANAGEMENT_CONFIG } from '../config';
import {
  debounceTime,
  map,
  switchMap,
  skip,
  takeUntil,
  catchError,
} from 'rxjs/operators';

/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application.
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */

@Injectable()
export class ProductEffects {
  @Effect()
  addProduct$: Observable<Action> = this.actions$.pipe(
    ofType<Add>(ProductActionTypes.ADD),
    map(action => action.payload),
    switchMap(product => {
      return this.productApi
        .createProduct(product)
        .pipe(
        map(_ => new AddSuccess(product)),
        catchError(err => of(new AddError(err))));
    })
  );

  constructor(
    private actions$: Actions,
    private productApi: ProductApi

  ) {

  }
}
