import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthResponse } from './authResponse';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = environment.authApiUrl;

    constructor(private http: HttpClient) { }

    login(email: string, password: string): void {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          accept: '*/*',
        });
    
        const body = {
          email: email,
          password: password,
        };
    
        this.http.post<AuthResponse>(this.apiUrl, body, { headers }).subscribe({
            next: (response) => {
              console.log('Token:', response.token);
              localStorage.setItem('token', response.token);
            },
            error: (error) => {
              console.error('Erro ao fazer login:', error);
            },
          });
      }

    deleteProduct(id: number | string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
