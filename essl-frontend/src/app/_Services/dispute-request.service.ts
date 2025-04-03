import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, retry, Subject, toArray } from 'rxjs';
import { Url } from '../_setUrl/url';


@Injectable({
  providedIn: 'root'
})
export class DisputeRequestService {

  err: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  createDisputeRequest(obj:any){
 return this.http.post(Url.LocalUrl + "disputes", obj ).pipe(
  retry(3),
  catchError(error => {
    this.err.next(error);
    return this.err.asObservable();
  })

 )
  }
  updateDisputeStatus(id: string, status: string, managerId: any) {
    const url = `${Url.LocalUrl}disputes/${id}`;
    const body = { Status: status, Manager_id: managerId };

    return this.http.put(url, body).pipe(
      retry(3),
      catchError((error) => {
        this.err.next(error.message);
        return this.err.asObservable();
      })
    );
  }

  getPendingRequests(managerId: string) {
    const url = `${Url.LocalUrl}disputes/pendingrequests`;
    const body = { Manager_id: managerId };

    return this.http.post(url, body).pipe(
      retry(3),
      catchError((error) => {
        this.err.next(error.message);
        return this.err.asObservable();
      })
    );
  }


  getPendingRequestById(employeeId: string) {
    const url = `${Url.LocalUrl}disputes/pendingrequestsId/${employeeId}`; // Replace with your API endpoint

    return this.http.get(url).pipe(
      retry(3), // Retry the request up to 3 times in case of failure
      catchError((error) => {
        this.err.next(error.message); // Emit the error message
        return this.err.asObservable(); // Re-throw the error for further handling
      })
    );
  }
 
}