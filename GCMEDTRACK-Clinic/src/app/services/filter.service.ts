import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type DepartmentKeys = 'CSS' | 'CEAS' | 'CAHS' | 'CHTM-Tourism' | 'CHTM-Hospitality' | 'CBA';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private departmentSource = new BehaviorSubject<DepartmentKeys>('CSS');
  private yearSource = new BehaviorSubject<string>('1st');

  currentDepartment$ = this.departmentSource.asObservable();
  currentYear$ = this.yearSource.asObservable();

  constructor() { }

  updateDepartment(department: DepartmentKeys) {
    this.departmentSource.next(department);
  }

  changeYear(year: string) {
    this.yearSource.next(year);
  }
}
