import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FamilyDTO } from '../familia/familiaDto';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private apiUrl = 'https://stunning-spork-jjq45w465prqcj97-8080.app.github.dev/api/families';

  constructor(private http: HttpClient) { }

  // Obtener familias activas
  getFamiliesActive(sortBy: string = 'id'): Observable<FamilyDTO[]> {
    return this.http.get<FamilyDTO[]>(`${this.apiUrl}/active`).pipe(
      map(response => response || [])
    );
  }

  // Obtener familias inactivas
  getFamiliesInactive(sortBy: string = 'id'): Observable<FamilyDTO[]> {
    return this.http.get<FamilyDTO[]>(`${this.apiUrl}/inactive`).pipe(
      map(response => response || [])
    );
  }

  // Obtener familia por ID
  getFamilyById(id: number): Observable<FamilyDTO> {
    return this.http.get<FamilyDTO>(`${this.apiUrl}/${id}`).pipe(
      map(response => response)
    );
  }

  // Crear nueva familia
  createFamily(family: FamilyDTO): Observable<FamilyDTO> {
    return this.http.post<FamilyDTO>(this.apiUrl, family).pipe(
      map(response => response)
    );
  }

  // Actualizar familia
  updateFamily(id: number, family: FamilyDTO): Observable<FamilyDTO> {
    return this.http.put<FamilyDTO>(`${this.apiUrl}/${id}`, family).pipe(
      map(response => response)
    );
  }

  // Eliminar familia
  deleteFamily(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {})
    );
  }

  // Activar familia
  activeFamily(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/active/${id}`, {}).pipe(
      map(() => {})
    );
  }
}
