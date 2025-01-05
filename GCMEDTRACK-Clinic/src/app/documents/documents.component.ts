import { Component } from '@angular/core';
import { FilterService } from '../services/filter.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


type DepartmentKeys = 'CSS' | 'CEAS' | 'CAHS' | 'CHTM-Tourism' | 'CHTM-Hospitality' | 'CBA';

interface MedicalDocument {
  name: string;
  status: string;
  needsSubmission?: boolean;
  information?: {
    title: string;
    details: string;
  };
}

interface Student {
  id: string;
  name: string;
  department: DepartmentKeys;
  medicalDocuments: MedicalDocument[];
}

@Component({
  selector: 'app-documents',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {
 searchQuery: string = '';
  selectedDepartment: DepartmentKeys = 'CSS';
  selectedYear: string = '1st';

  departmentDocuments: { [key in DepartmentKeys]: MedicalDocument[] } = {
    'CSS': [
      { name: 'Complete Blood Count', status: 'Uploaded' },
      { name: 'Urinalysis', status: 'Needs Submission', needsSubmission: true },
      { name: 'COVID-19 Vaccination Card', status: 'Uploaded' },
      { name: 'Chest Xray', status: 'Needs Submission', needsSubmission: true }
    ],
    'CEAS': [
      { name: 'Complete Blood Count', status: 'Needs Submission', needsSubmission: true },
      { name: 'Urinalysis', status: 'Needs Submission', needsSubmission: true },
      { name: 'COVID-19 Vaccination Card', status: 'Needs Submission', needsSubmission: true },
      { name: 'Chest Xray', status: 'Needs Submission', needsSubmission: true }
    ],
    'CAHS': [
      { name: 'Complete Blood Count (CBC)', status: 'Needs Submission', needsSubmission: true },
      { name: 'Urinalysis', status: 'Needs Submission', needsSubmission: true },
      { name: 'Anti-HBS', status: 'Needs Submission', needsSubmission: true },
      { name: 'Chest X-ray (PA view)', status: 'Needs Submission', needsSubmission: true },
      { name: 'Hepa B Vaccine Card', status: 'Needs Submission', needsSubmission: true },
      { name: 'Flu Vaccine Card', status: 'Needs Submission', needsSubmission: true },
      { name: 'Drug Test for RLE requirements', status: 'Needs Submission', needsSubmission: true }
    ],
    'CHTM-Tourism': [
      { name: 'Complete Blood Count', status: 'Needs Submission', needsSubmission: true },
      { name: 'Urinalysis', status: 'Needs Submission', needsSubmission: true },
      { name: 'COVID-19 Vaccination Card', status: 'Needs Submission', needsSubmission: true },
      { name: 'Chest Xray', status: 'Needs Submission', needsSubmission: true }
    ],
    'CHTM-Hospitality': [
      { name: 'Complete Blood Count (CBC) (Blood typing for freshmen students only)', status: 'Uploaded' },
      { name: 'Urinalysis', status: 'Needs Submission', needsSubmission: true },
      { name: 'Chest X-ray (PA view)', status: 'Uploaded' },
      { name: 'Anti-HAV (Hepa A)', status: 'Needs Submission', needsSubmission: true },
      { name: 'Fecalysis', status: 'Uploaded' },
      { name: 'COVID-19 Vaccination Card', status: 'Needs Submission', needsSubmission: true }
    ],
    'CBA': [
      { name: 'Complete Blood Count', status: 'Needs Submission', needsSubmission: true },
      { name: 'Urinalysis', status: 'Needs Submission', needsSubmission: true },
      { name: 'COVID-19 Vaccination Card', status: 'Needs Submission', needsSubmission: true },
      { name: 'Chest Xray', status: 'Needs Submission', needsSubmission: true }
    ]
  };

  students: Student[] = [
    {
      id: '12345',
      name: 'Marron Jeremy Flores',
      department: 'CSS',
      medicalDocuments: this.departmentDocuments['CSS']
    },
    {
      id: '12345',
      name: 'Marron Jeremy Flores',
      department: 'CEAS',
      medicalDocuments: this.departmentDocuments['CEAS']
    },
    {
      id: '12345',
      name: 'Marron Jeremy Flores',
      department: 'CAHS',
      medicalDocuments: this.departmentDocuments['CAHS']
    },
    {
      id: '12345',
      name: 'Marron Jeremy Flores',
      department: 'CHTM-Tourism',
      medicalDocuments: this.departmentDocuments['CHTM-Tourism']
    },
    {
      id: '12345',
      name: 'Marron Jeremy Flores',
      department: 'CHTM-Hospitality',
      medicalDocuments: this.departmentDocuments['CHTM-Hospitality']
    },
    {
      id: '12345',
      name: 'Marron Jeremy Flores',
      department: 'CBA',
      medicalDocuments: this.departmentDocuments['CBA']
    }
  ];

  constructor(private filterService: FilterService) {
    this.filterService.currentDepartment$.subscribe(department => {
      this.selectedDepartment = department;
    });
    this.filterService.currentYear$.subscribe(year => {
      this.selectedYear = year;
    });
  }

  onDepartmentChange(event: any) {
    this.filterService.updateDepartment(this.selectedDepartment);
  }

  onYearChange() {
    this.filterService.changeYear(this.selectedYear);
  }

  getFilteredDocuments(department: DepartmentKeys, year: string): MedicalDocument[] {
    const docs = this.departmentDocuments[department];
    if (department === 'CAHS') {
      if (year === '1st') {
        return docs.filter(doc => doc.name !== 'Drug Test for RLE requirements');
      } else {
        return docs.filter(doc => doc.name !== 'Hepatitis screening: HBsAg (Hepatitis B Surface Antigen)');
      }
    }
    return docs;
  }

  get filteredStudents() {
    return this.students.map(student => ({
      ...student,
      medicalDocuments: this.getFilteredDocuments(this.selectedDepartment, this.selectedYear)
    })).filter(student => {
      const departmentMatch = student.department === this.selectedDepartment;
      const searchMatch = !this.searchQuery || 
        student.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        student.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      return departmentMatch && searchMatch;
    });
  }
}
