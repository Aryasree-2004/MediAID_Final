import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        localStorage.clear();
        router.navigate(['/auth/login']);
        toastr.error('Session expired. Please login again.');
      } else if (err.status === 403) {
        toastr.error('Access denied.');
      } else if (err.status === 0) {
        toastr.error('Cannot reach the server. Check your connection.');
      } else {
        const msg = err.error?.message || err.message || 'An error occurred.';
        toastr.error(msg);
      }
      return throwError(() => err);
    })
  );
};
