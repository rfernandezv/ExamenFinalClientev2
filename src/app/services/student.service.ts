import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Student} from '../models/student';
import {ResponseApi} from '../models/dto/responseApi';
import {HttpOptionsConst} from '../shared/models/http-options';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { MessageAlertHandleService } from './message-alert.service';


@Injectable()
export class StudentService {
  API_URL : string = environment.apiUrl + 'student';

  dataChange: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);
  dialogData: Student; 
  totalSize : BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor (private httpClient: HttpClient,
              public _messageAlertHandleService: MessageAlertHandleService,
              ) {}
  

  getStudentByType(type : string): void {
    this.httpClient.get<Student[]>(this.API_URL+'/searchStudentByType/'+type).subscribe(
      data => {
        this.dataChange.next(data);
      },
      (error : any) => {
        this._messageAlertHandleService.handleError(error);
      },
      () => {
      }
      );
  }

  getAllStudent(): void {
    this.httpClient.get<Student[]>(this.API_URL+'/findAll/').subscribe(
        data => {
          this.dataChange.next(data);
        },
        (error : any) => {
          this._messageAlertHandleService.handleError(error);
        },
        () => {
        }
      );
  }

  calculateAmountByStudentId (studentId : number): Observable<number> {
    return this.httpClient
            .get<number>(this.API_URL+'/calculateAmount/'+studentId, HttpOptionsConst)
            .map(
                res => res
              )
            .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  
  get data(): Student[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getTotalSize() : number{
      return this.totalSize.value;
  }

  
}