import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from './student';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner/public_api';
import { ToastrService } from 'ngx-toastr/public_api';
import { finalize, delay } from 'rxjs/operators'

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
    return this.http.post(`${this.apiURL}`, student);

  }

  update(id: number, student: Student) {
    return this.http.put(`${this.apiURL}/${id}`, student);

  }

  deleteById(id: number) {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  findById(id: number) {
    return this.http.get<Student>(`${this.apiURL}/${id}`);
  }

  findAll() {
    this.spinner.show();
    return this.http.get<Student[]>(`${this.apiURL}`).pipe(
      delay(2000),
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

}
