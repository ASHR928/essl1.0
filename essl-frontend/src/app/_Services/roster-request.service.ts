import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry, Subject, toArray } from 'rxjs';
import { Url } from '../_setUrl/url';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosterRequestService {
  err: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }




 getAllRosterRequests() {
    return this.http.get(`${Url.LocalUrl}rosterrequest/requests`).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  // Approve a roster request
  approveRosterRequest(requestId: string, managerId: any,status:any,comment:any) {
    return this.http.put(
      `${Url.LocalUrl}rosterrequest/approve/${requestId}`,
      { managerId,status,comment }
    ).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  // Create new roster request with file upload
  createRosterRequest(tlId: string, fileBase64: string, ) {
    return this.http.post(
      `${Url.LocalUrl}rosterrequest/create/${tlId}`,
      { file: fileBase64 }
    ).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  // Bulk insert approved roster data
  bulkInsertRosterMaster(requestId: string) {
    return this.http.post(
      `${Url.LocalUrl}rosterrequest/bulkinsert/${requestId}`,
      {}
    ).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  // Download roster file
  downloadRosterFile(requestId: any): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(
      `${Url.LocalUrl}rosterrequest/download/${requestId}`,
      {
        observe: 'response',
        responseType: 'blob' as 'json' // Special handling for Blob response
      }
    ).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return throwError(() => error); // Maintain proper Observable type
      })
    );
  }
}
