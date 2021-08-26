import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Hall } from './cinema-model'

@Injectable({
  providedIn: 'root'
})
export class CinemaServiceService {

  private URL: string = ""

  constructor(private http: HttpClient) { }

  save(data: Hall) {
    return this.http.post<Hall>("http://localhost:8080/hall", data)
      .pipe(
        catchError(( ) => {
          console.log("error post") 
          return throwError("asdasdas")
        })
      )
  }

  private errorHandler(message: String) {

  }
}
