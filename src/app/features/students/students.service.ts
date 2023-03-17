import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Student } from './student';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner/public_api';
import { ToastrService } from 'ngx-toastr/public_api';
import { finalize, delay, catchError, retryWhen, mergeMap, scan } from 'rxjs/operators'
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  apiURL = `${environment.apiUrl}/students`
  students: Student[] = [];

  constructor(private http: HttpClient, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this.loadStudents();
  }

  save(student: Student) {
    return this.http.post(`${this.apiURL}`, student).pipe(
      delay(2000),
      catchError(error => this.exceptionHandler(error)),
      finalize(() => this.spinner.hide())
    );

  }

  update(id: number, student: Student) {
    return this.http.put(`${this.apiURL}/${id}`, student).pipe(
      delay(2000),
      catchError(error => this.exceptionHandler(error)),
      finalize(() => this.spinner.hide())
    );

  }

  deleteById(id: number) {
    return this.http.delete<void>(`${this.apiURL}/${id}`).pipe(
      delay(2000),
      catchError(error => this.exceptionHandler(error)),
      finalize(() => this.spinner.hide())
    );
  }

  findById(id: number) {
    return this.http.get<Student>(`${this.apiURL}/${id}`).pipe(
      delay(2000),
      catchError(error => this.exceptionHandler(error)),
      finalize(() => this.spinner.hide())
    );
  }

  findAll() {
    this.spinner.show();
    return this.http.get<Student[]>(`${this.apiURL}`).pipe(
      delay(2000),
      retryWhen(err => this.retryHandler(err)),
      catchError(error => this.exceptionHandler(error)),
      finalize(() => this.spinner.hide())
    );
  }

  private loadStudents() {
    // this.students.push(new Student(1, 'Ana', 'ana@gmail.com', '2001-04-01'));
    // this.students.push(new Student(2, 'Pedro', 'pedro@gmail.com', '2000-08-28'));
    // this.students.push(new Student(3, 'Marcia', 'marcia@gmail.com', '2002-08-21'));
    // this.students.push(new Student(4, 'Marcos', 'marcos@gmail.com', '2003-05-17'));
    // this.students.push(new Student(5, 'Victor', 'victor@gmail.com', '1993-04-12'));
    // this.students.push(new Student(6, 'Vanessa', 'vanessa@gmail.com', '2003-08-09'));
    // this.students.push(new Student(7, 'Mariana', 'mariana@gmail.com', '2000-11-06'));
    // this.students.push(new Student(8, 'Bernardo', 'bernardo@gmail.com', '1995-02-27'));
  }

  private exceptionHandler(error: HttpErrorResponse) {
    this.toastr.error(error.message, `${error.status} - ${error.statusText}`)
    return throwError(error)
  }

  private retryHandler(error: Observable<any>) {
    return error.pipe(
      delay(2000),
      mergeMap(err => {
        if(err.status < 500) {
          return of(err)
        }
        return throwError(err)
      }),
      scan((acc, err) => {
        if(acc > 5) {
          throw err;
        }
        this.toastr.warning(`Retrying the request #${acc}`, `${err.status} - Retrying`)
        return ++acc
      }, 1)
    )
  }
}
