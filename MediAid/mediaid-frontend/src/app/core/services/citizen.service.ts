import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.models';
import { CitizenDocumentResponse, CitizenRequest, CitizenResponse } from '../models/citizen.models';

@Injectable({ providedIn: 'root' })
export class CitizenService {
  private base = `${environment.apiUrl}/api`;
  constructor(private http: HttpClient) {}

  createCitizen(payload: CitizenRequest) {
    return this.http.post<ApiResponse<CitizenResponse>>(`${this.base}/citizens`, payload);
  }
  getCitizen(citizenId: number) {
    return this.http.get<ApiResponse<CitizenResponse>>(`${this.base}/citizens/${citizenId}`);
  }
  getAll() {
    return this.http.get<ApiResponse<CitizenResponse[]>>(`${this.base}/citizens`);
  }
  updateCitizen(citizenId: number, payload: CitizenRequest) {
    return this.http.put<ApiResponse<CitizenResponse>>(`${this.base}/citizens/${citizenId}`, payload);
  }
  verifyCitizen(citizenId: number, status: string) {
    return this.http.put<ApiResponse<CitizenResponse>>(`${this.base}/citizens/${citizenId}/verify?status=${status}`, {});
  }
  suspendCitizen(citizenId: number) {
    return this.http.put<ApiResponse<CitizenResponse>>(`${this.base}/citizens/${citizenId}/suspend`, {});
  }
  uploadDocument(citizenId: number, file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<ApiResponse<CitizenDocumentResponse>>(`${this.base}/citizens/${citizenId}/documents`, fd);
  }
  getDocuments(citizenId: number) {
    return this.http.get<ApiResponse<CitizenDocumentResponse[]>>(`${this.base}/citizens/${citizenId}/documents`);
  }
  verifyDocument(documentId: number, status: string) {
    return this.http.put<ApiResponse<CitizenDocumentResponse>>(`${this.base}/documents/${documentId}/verify?status=${status}`, {});
  }
  downloadDocument(fileName: string) {
    return this.http.get(`${this.base}/documents/${fileName}/download`, { responseType: 'blob' });
  }
}
