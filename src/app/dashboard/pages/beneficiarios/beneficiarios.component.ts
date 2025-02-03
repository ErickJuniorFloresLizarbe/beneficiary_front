import { Component, OnInit } from '@angular/core';
import { BeneficiariosService } from '../services/beneficiarios.service';
import { BeneficiarioDTO } from '../beneficiarios/beneficiariosDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  imports: [CommonModule, FormsModule],
})
export class BeneficiariosComponent implements OnInit {
  beneficiarios: BeneficiarioDTO[] = [];
  selectedBeneficiario: BeneficiarioDTO | null = null;
  isEditing: boolean = false;
  estadoActual: string = 'A';
  estadoApadrinamiento: string = 'NO';
  tipoParentesco: string = 'Hijo';


  constructor(private beneficiariosService: BeneficiariosService) {}

  ngOnInit(): void {
    this.cargarBeneficiarios();
  }

  //LISTADO DE BENEFICIARIOS Y APADRINADOS
  cargarBeneficiarios(): void {
    if (this.estadoApadrinamiento === 'SI') {
      // Usamos el servicio que filtra por apadrinamiento (sponsored) y estado
      this.beneficiariosService.getPersonsBySponsoredAndState(this.estadoApadrinamiento, this.estadoActual)
        .subscribe(data => {
          this.beneficiarios = data;
        });
    } else if (this.estadoApadrinamiento === 'NO') {
      // Usamos el servicio que filtra por tipo de parentesco (typeKinship) y estado
      this.beneficiariosService.getPersonsByTypeKinshipAndState(this.tipoParentesco, this.estadoActual)
        .subscribe(data => {
          this.beneficiarios = data;
        });
    }
  }

  //LISTA DE ESTADO ACTIVO Y INACTIVO
  cambiarEstado(): void {
    this.estadoActual = this.estadoActual === 'A' ? 'I' : 'A';
    this.cargarBeneficiarios();
  }

  //BOTON DE FILTRO APADRINADO
  cambiarApadrinamiento(): void {
    this.estadoApadrinamiento = this.estadoApadrinamiento === 'NO' ? 'SI' : 'NO';
    this.cargarBeneficiarios();
  }

  //BOTON DE ELIMINAR Y RESTAURAR
  toggleEstado(beneficiario: BeneficiarioDTO): void {
    if (beneficiario.state === 'A') {
      this.beneficiariosService.deletePerson(beneficiario.idPerson).subscribe(() => {
        beneficiario.state = 'I';
      });
    } else {
      this.beneficiariosService.restorePerson(beneficiario.idPerson).subscribe(() => {
        beneficiario.state = 'A';
      });
    }
  }

  // FUNCIÓN PARA ABRIR EL MODAL Y CARGAR DETALLES
  verDetalles(id: number): void {
    this.beneficiariosService.getPersonByIdWithDetails(id).subscribe(data => {
      this.selectedBeneficiario = data;
      this.isEditing = false;  // Establecer modo de sólo ver detalles
    });
  }

  // FUNCIÓN PARA ABRIR EL MODAL Y CARGAR LOS DATOS DEL BENEFICIARIO
  editarBeneficiario(beneficiario: BeneficiarioDTO): void {
    this.selectedBeneficiario = { ...beneficiario };  // Clonamos para no modificar el objeto original
    this.isEditing = true;  // Establecer modo de edición
  }

  //FUNCIÓN PARA GUARDAR LOS CAMBIOS DEL BENEFICIARIO
  guardarCambios(): void {
    if (this.selectedBeneficiario) {
      const id = this.selectedBeneficiario.idPerson;
      this.beneficiariosService.updatePersonData(id, this.selectedBeneficiario).subscribe({
        next: () => {
          alert('Beneficiario actualizado correctamente');
          this.cargarBeneficiarios();  // Recargamos la lista de beneficiarios
          this.cerrarModal();  // Cerramos el modal
        },
        error: (error) => {
          console.error('Error al actualizar beneficiario', error);
          alert('Error al actualizar el beneficiario');
        }
      });
    }
  }

  // Cerrar modal
  cerrarModal(): void {
    this.selectedBeneficiario = null;
    this.isEditing = false;  // Al cerrar, restablecer el modo de edición
  }
}
