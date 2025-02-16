import { Injectable } from '@angular/core'; 
import { HttpClient,HttpHeaders,HttpResponse } from '@angular/common/http';
import { catchError, retry, Subject } from 'rxjs';
import { Url } from '../_setUrl/url';

interface Shift{
  Shift_ID:string;
  Shift_StartTime:string;
  Shift_EndTime:string,
  Is_Approved:boolean,
  Is_Active:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftMasterService {
  err:Subject<string>=new Subject<string>();


  constructor(private http: HttpClient) { }
  
  getAllShifts(){
    return this.http.get(`${Url.localUrl}shifts/allShifts`).pipe(
      retry(3),
      catchError(error=>{
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }
  createShift(shift:Shift){
    return this.http.post(
      `${Url.localUrl}shifts/createShift`,shift).pipe(
        retry(3),
        catchError(error=>{
          this.err.next(error);
          return this.err.asObservable();
        })
      )

  }


}
