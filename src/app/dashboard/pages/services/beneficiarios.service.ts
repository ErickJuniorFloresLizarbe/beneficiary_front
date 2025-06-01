// service/person.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { BeneficiarioDTO } from '../beneficiarios/beneficiariosDTO';

@Injectable({
  providedIn: 'root'
})

export class BeneficiariosService {
  private apiUrl = 'http://localhost:8082/api/persons';

  constructor(private http: HttpClient) {}

  //LISTADO DE TODOS LOS BENEFICIARIOS Y APADRINADOS ACTIVOS Y INACTIVOS
  getPersonsByTypeKinshipAndState(typeKinship: string, state: string): Observable<BeneficiarioDTO[]> {
    return this.http.get<BeneficiarioDTO[]>(`${this.apiUrl}/filter?typeKinship=${typeKinship}&state=${state}`);
  }

  // CALCULO PARA MOSTRAR EN DASHBOARD
  getBeneficiariosStats(): Observable<any> {
    return forkJoin([
      this.getPersonsByTypeKinshipAndState('HIJO', 'A'), // Beneficiarios Activos
      this.getPersonsByTypeKinshipAndState('HIJO', 'I'), // Beneficiarios Inactivos
      this.getPersonsBySponsoredAndState('NO', 'A'), // No Apadrinados Activos
      this.getPersonsBySponsoredAndState('NO', 'I'), // No Apadrinados Inactivos
      this.getPersonsBySponsoredAndState('SI', 'A'), // Apadrinados Activos
      this.getPersonsBySponsoredAndState('SI', 'I'), // Apadrinados Inactivos
    ]).pipe(
      map(([activos, inactivos, noApadrinadosActivos, noApadrinadosInactivos, apadrinadosActivos, apadrinadosInactivos]) => {
        // Filtrar solo los HIJOS de los resultados obtenidos
        const hijosActivos = activos.filter(person => person.typeKinship === 'HIJO');
        const hijosInactivos = inactivos.filter(person => person.typeKinship === 'HIJO');
        const hijosNoApadrinadosActivos = noApadrinadosActivos.filter(person => person.typeKinship === 'HIJO');
        const hijosNoApadrinadosInactivos = noApadrinadosInactivos.filter(person => person.typeKinship === 'HIJO');
        const hijosApadrinadosActivos = apadrinadosActivos.filter(person => person.typeKinship === 'HIJO');
        const hijosApadrinadosInactivos = apadrinadosInactivos.filter(person => person.typeKinship === 'HIJO');

        return {
          totalBeneficiarios: hijosActivos.length + hijosInactivos.length,
          beneficiariosActivos: hijosActivos.length,
          beneficiariosInactivos: hijosInactivos.length,
          totalNoApadrinados: hijosNoApadrinadosActivos.length + hijosNoApadrinadosInactivos.length,
          totalApadrinados: hijosApadrinadosActivos.length + hijosApadrinadosInactivos.length,
        };
      })
    );
  }


  //LISTADO DE SOLO LOS APRADRINADOS ACTIVOS Y INACTIVOS
  getPersonsBySponsoredAndState(sponsored: string, state: string): Observable<BeneficiarioDTO[]> {
    return this.http.get<BeneficiarioDTO[]>(`${this.apiUrl}/filter-sponsored?sponsored=${sponsored}&state=${state}`);
  }

  //LISTA TODOS LOS BENEFICIARIOS Y SUS DETALLES
  getPersonByIdWithDetails(id: number): Observable<BeneficiarioDTO> {
    return this.http.get<BeneficiarioDTO>(`${this.apiUrl}/${id}/details`);
  }

  //ELIMINADO LOGICO
  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/delete`);
  }

  //RESTAURADO LOGICO
  restorePerson(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/restore`, {});
  }

  //MODIFICACION DE DATOS DE BENEFICIARIOS Y APADRINADOS SIN GENERAR UN NUEVO ID
  updatePersonData(id: number, person: BeneficiarioDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/update-person`, person);
  }

  //MODIFICACION DE DATOS DE EDUCATION Y HEALTH SIN GENERAR UN NUEVO ID
  correctEducationAndHealth(id: number, educationData: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/correct-education-health`, educationData);
  }

  updatePerson(id: number, person: BeneficiarioDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/update`, person);
  }

  registerPerson(person: BeneficiarioDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, person);
  }
}
