// src/app/appointment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product';
import { environment } from '../environments/environment';

import { AuthService } from './auth.service';
import Category from './category';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private authService: AuthService;
    private apiUrl = environment.apiUrl;
    private categoryApiUrl = environment.categoryApiUrl;

    constructor(private http: HttpClient, authService: AuthService) {
        this.authService = authService;
     }

    getProducts(name: string = '', category: string = '', page: number = 0, size: number = 10, sortBy: string = 'id', order: string = 'asc'): Observable<any> {
        this.authService.login(environment.authCredentials.email, environment.authCredentials.password);
        const token = localStorage.getItem('token');
    
        // Configura os parâmetros de consulta
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sortBy', sortBy)
          .set('order', order);
    
        if (name) {
          params = params.set('name', name);
        }
    
        if (category) {
          params = params.set('category', category);
        }
    
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
        return this.http.get<any>(this.apiUrl, { params, headers });
      }

    deleteProduct(id: number | string): Observable<void> {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        });
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
    }

    updateProduct(product: Product): Observable<Product> {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        });
        return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product, { headers });
      }

    getCategories(): Observable<Category[]> {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        });
        return this.http.get<Category[]>(this.categoryApiUrl, { headers });
      }

}
