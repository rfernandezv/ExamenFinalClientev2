import {Component, ElementRef, OnInit, ViewChild, Inject} from '@angular/core';
import {StudentService} from '../../services/student.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatSort, PageEvent, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Student} from '../.././models/student';
import {Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {CalculateDialogComponent} from '../calculate/calculate.dialog.component';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageAlertHandleService } from '../../services/message-alert.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  displayedColumns = ['studentId', 'firstName', 'lastName', 'typeGrade', 'studentCode','isActive','actions'];
  studentDataBase: StudentService | null;
  studentDataSource: StudentDataSource | null;
  studentsType: string[] = ['ALL','PREGRADO','MAESTRIA','DOCTORADO'];

  form: FormGroup;
  index: number;
  id: number;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public studentType: string,
              public _messageAlertHandleService: MessageAlertHandleService,
              public _studentService: StudentService) {
              }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.setUpControls();
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  setUpControls() : void {
      this.studentType = 'ALL';
      this.form = this.fb.group({
        studentType: new FormControl('', [Validators.required] )
      });
  }

  onSubmit() {
    this.studentDataSource._studentType = this.studentType;
    this.studentDataSource.connect();
}

  private refreshTable() {
    this.blockUI.start();
    this.studentDataSource.connect();
    this.blockUI.stop();
  }

  addNew(){

  }

  calculateAmount(i: number, student : Student) {
       this.index = i;
        this.id = student.studentId;
        
        const dialogRef = this.dialog.open(CalculateDialogComponent, {
          data: {studentId: student.studentId, 
                firstName: student.firstName, 
                lastName: student.lastName, 
                amount : 0,
                typeGrade : student.typeGrade,
                studentCode : student.studentCode            
              }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result === 1) {
            this.refreshTable();      
          }
        });
        
  }

  public loadData() {    
    this.blockUI.start();
    this.studentDataBase = new StudentService(this.httpClient, this._messageAlertHandleService);
    this.studentDataSource = new StudentDataSource(this.studentDataBase, this.paginator, this.sort);
    
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.studentDataSource) {
            return;
          }
          this.studentDataSource.filter = this.filter.nativeElement.value;
        }); 
    this.blockUI.stop();  
  }

  obtenerMensajeIsActive(isActive : boolean) : string{
    if(isActive){
      return "Yes";
    }
    return "No";
  }
}


export class StudentDataSource extends DataSource<Student> {
  _filterChange = new BehaviorSubject('');
  searchStr : string;
  _studentType : string = 'ALL';

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Student[] = [];
  renderedData: Student[] = [];

  constructor(public _studentDatabase: StudentService,
              public _paginator: MatPaginator,
              public _sort: MatSort              
            ) {
    super();
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  connect(): Observable<Student[]> {
    
        const displayDataChanges = [
          this._studentDatabase.dataChange,
          this._studentDatabase.totalSize,
          this._sort.sortChange,
          this._filterChange,
          this._paginator.page
        ];
        
        if(this._studentType == 'ALL'){
          this._studentDatabase.getAllStudent();
        }else{
          this._studentDatabase.getStudentByType(this._studentType);
        }

        this.filteredData = this._studentDatabase.data.slice().filter((student: Student) => {
          const searchStr = (student.firstName + student.lastName + student.typeGrade).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        const sortedData = this.sortData(this.filteredData.slice());

        const startIndex = 0;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);

        return Observable.merge(...displayDataChanges).map(() => {

          this.filteredData = this._studentDatabase.data.slice().filter((student: Student) => {

            if(student === undefined || student.studentId === undefined){
              this.searchStr = '';
            }else{
              this.searchStr = (student.firstName + student.lastName + student.typeGrade).toLowerCase();
            }            
            return this.searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });          
          const sortedData = this.sortData(this.filteredData.slice());

          const startIndex = 0;
          this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
          return this.renderedData;
        });      
    }


    disconnect() {
    }

    sortData(data: Student[]): Student[] {
        if (!this._sort.active || this._sort.direction === '') {
          return data;
        }

        return data.sort((a, b) => {
          let propertyA: number | string = '';
          let propertyB: number | string = '';
          let propertyC: boolean = false;
          let propertyD: boolean = false;

          switch (this._sort.active) {
            case 'studentId': [propertyA, propertyB] = [a.studentId, b.studentId]; break;
            case 'firstName': [propertyA, propertyB] = [a.firstName, b.firstName]; break;
            case 'lastName': [propertyA, propertyB] = [a.lastName, b.lastName]; break;
            case 'typeGrade': [propertyA, propertyB] = [a.typeGrade, b.typeGrade]; break;
            case 'studentCode': [propertyA, propertyB] = [a.studentCode, b.studentCode]; break;
            case 'isActive': [propertyC, propertyD] = [a.isActive, b.isActive]; break;
          }
          
          const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

          return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}
