import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.models';
import { UserResponse } from '../models/audit.models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiUrl}/api/users`;
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<ApiResponse<UserResponse[]>>(this.base); }
  getById(id: number) { return this.http.get<ApiResponse<UserResponse>>(`${this.base}/${id}`); }
  update(id: number, payload: Partial<UserResponse>) { return this.http.put<ApiResponse<UserResponse>>(`${this.base}/${id}`, payload); }
  delete(id: number) { return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`); }
  updateRole(id: number, role: string) { return this.http.put<ApiResponse<UserResponse>>(`${this.base}/${id}/role`, { role }); }
}
