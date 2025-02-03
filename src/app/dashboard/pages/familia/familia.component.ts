import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FamilyDTO } from './familiaDto';
import { FamilyService } from '../services/family.service';
import { FamiliaFormularioComponent } from './familia-formulario/familia-formulario.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-familia',
  standalone: true,
  imports: [CommonModule, FormsModule, FamiliaFormularioComponent],
  templateUrl: './familia.component.html',
  styleUrls: ['./familia.component.css']
})
export class FamiliaComponent implements OnInit {
  familias: FamilyDTO[] = [];
  familySelected: FamilyDTO | null = null;
  loading = false;
  error: string | null = null;
  showFamilyForm = false;
  searchTerm: string = '';
  showInactive: boolean = false;
  currentSection: number = 1;

  constructor(private familyService: FamilyService) {}

  ngOnInit(): void {
    this.cargarFamiliasActivas();
  }

  cargarFamiliasActivas() {
    this.loading = true;
    this.familyService.getFamiliesActive('id').subscribe(
      data => {
        this.familias = data;
        this.loading = false;
        this.error = null;
      },
      error => {
        console.error('Error al obtener familias activas:', error);
        this.error = this.procesarError(error);
        this.loading = false;
      }
    );
  }

  toggleFamilias() {
    this.filtrarFamilias();
  }

  filtrarFamilias() {
    this.loading = true;
    const request = this.showInactive ? 
      this.familyService.getFamiliesInactive('id') : 
      this.familyService.getFamiliesActive('id');

    request.subscribe(
      data => {
        this.familias = data.filter(familia =>
          familia.direction.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.loading = false;
      },
      error => {
        console.error('Error al obtener familias:', error);
        this.error = this.procesarError(error);
        this.loading = false;
      }
    );
  }

  private procesarError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Error: ${error.error.message}` || 'Error desconocido';
    } else {
      return `Código de error ${error.status}: ${error.error?.error || 'Error desconocido'}`;
    }
  }

  seleccionarFamilia(familia: FamilyDTO) {
    this.familySelected = familia;
  }

  openFamilyForm() {
    this.showFamilyForm = true; // Abre el modal del formulario
  }

  onFamilyCreated(familyData: any) {
    console.log('Familia creada:', familyData);
    this.cargarFamiliasActivas(); // Recarga las familias después de crear una nueva
    this.showFamilyForm = false; // Cierra el modal
  }

  editFamily(familia: FamilyDTO) {
    this.familySelected = familia; // Asignar la familia seleccionada
    this.showFamilyForm = true; // Mostrar el formulario
  }
  
  nextSection() {
    if (this.currentSection < 3) {
      this.currentSection++;
    }
  }

  previousSection() {
    if (this.currentSection > 1) {
      this.currentSection--;
    }
  }

  eliminarFamilia(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la familia de forma lógica.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.familyService.deleteFamily(id).subscribe(
          () => {
            Swal.fire('Eliminado', 'La familia ha sido eliminada.', 'success');
            this.filtrarFamilias();
          },
          (error) => {
            console.error('Error al eliminar la familia:', error);
            Swal.fire('Error', 'Ocurrió un error al eliminar la familia.', 'error');
          }
        );
      }
    });
  }

  reactivarFamilia(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción reactivará la familia.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reactivar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.familyService.activeFamily(id).subscribe(
          () => {
            Swal.fire('Reactivado', 'La familia ha sido reactivada.', 'success');
            this.filtrarFamilias();
          },
          (error) => {
            console.error('Error al reactivar la familia:', error);
            Swal.fire('Error', 'Ocurrió un error al reactivar la familia.', 'error');
          }
        );
      }
    });
  }

  getFamilyTypeColor(type: string): string {
    switch (type) {
      case 'Nuclear': return 'bg-green-100 text-green-800';
      case 'Extendida': return 'bg-blue-100 text-blue-800';
      case 'Monoparental': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
