import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
) => {
  const token = localStorage.getItem('clinicAuthToken');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};