import { Component, OnInit  } from '@angular/core';
import { BeneficiariosService } from '../services/beneficiarios.service';
import { BeneficiarioDTO } from '../beneficiarios/beneficiariosDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormEditComponent } from '../beneficiarios/form-edit/form-edit.component';

@Component({
  standalone: true,
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  imports: [CommonModule, FormsModule, FormEditComponent],
})
export class BeneficiariosComponent implements OnInit {

  beneficiarios: BeneficiarioDTO[] = [];
  selectedBeneficiario: BeneficiarioDTO | null = null;
  isEditing: boolean = false;
  selectedEducation: any = null;
  isEditingEducation: boolean = false;
  selectedHealth: any = null;
  isEditingHealth: boolean = false;
  estadoActual: string = 'A';
  estadoApadrinamiento: string = 'NO';
  tipoParentesco: string = 'Hijo';
  isModalVisible: boolean = false;
  isHealthModalVisible: boolean = false;



  constructor(private beneficiariosService: BeneficiariosService) {}

  ngOnInit(): void {
    this.cargarBeneficiarios();
  }


  //LISTADO DE BENEFICIARIOS Y APADRINADOS
  cargarBeneficiarios(): void {
    if (this.estadoApadrinamiento === 'SI') {
      this.beneficiariosService.getPersonsBySponsoredAndState(this.estadoApadrinamiento, this.estadoActual)
        .subscribe(data => {
          this.beneficiarios = data;
        });
    } else if (this.estadoApadrinamiento === 'NO') {
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

  //FUNCIÓN PARA ABRIR EL MODAL Y CARGAR DETALLES
  verDetalles(id: number): void {
    this.beneficiariosService.getPersonByIdWithDetails(id).subscribe(data => {
      this.selectedBeneficiario = data;
      this.isEditing = false;
    });
  }

  //ABRE EL MODAL PARA HACER LA EDICION DE BENEFICIARIO Y APADRINADO
  editarBeneficiario(beneficiario: BeneficiarioDTO): void {
    this.selectedBeneficiario = { ...beneficiario };
    this.isEditing = true;
  }

  //GUARDAMOS LOS CAMBIOS DE BENEFICIARIO Y APADRINADO
  guardarCambios(): void {
    if (this.selectedBeneficiario) {
      const id = this.selectedBeneficiario.idPerson;
      this.beneficiariosService.updatePersonData(id, this.selectedBeneficiario).subscribe({
        next: () => {
          alert('Beneficiario actualizado correctamente');
          this.cargarBeneficiarios();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al actualizar beneficiario', error);
          alert('Error al actualizar el beneficiario');
        }
      });
    }
  }

  //CIERRA EL MODAL DE LA EDICION DE BENEFICIARIO Y APADRINADO
  cerrarModal(): void {
    this.selectedBeneficiario = null;
    this.isEditing = false;
  }


  //ABRE EL MODAL PARA HACER LA EDICION DE EDUCATION
  editarEducacion(edu: any): void {
    this.selectedEducation = { ...edu };
    this.isEditingEducation = true;
  }

  //GUARDAMOS LOS CAMBIOS DE LA EDICION DE EDUCATION
  guardarEducacion(): void {
    if (this.selectedBeneficiario && this.selectedEducation) {
      const id = this.selectedBeneficiario.idPerson;
      const payload = {
        idPerson: id,
        education: [this.selectedEducation]
      };

      console.log('Payload enviado a la API:', payload);

      this.beneficiariosService.correctEducationAndHealth(id, payload).subscribe({
        next: () => {
          alert('Educación actualizada correctamente');
          this.cargarBeneficiarios();
          this.verDetalles(id);
          this.cerrarModalEducacion();
        },
        error: (error) => {
          console.error('Error al actualizar educación', error);
          alert('Error al actualizar la educación');
        }
      });
    }
  }

  //CIERRA EL MODAL DE LA EDICION DE EDUCATION
  cerrarModalEducacion(): void {
    this.selectedEducation = null;
    this.isEditingEducation = false;
  }



  // ABRE EL MODAL PARA HACER LA EDICIÓN DE SALUD
  editarSalud(health: any): void {
    this.selectedHealth = { ...health };
    this.isEditingHealth = true;
  }

  // GUARDAMOS LOS CAMBIOS DE LA EDICIÓN DE SALUD
  guardarSalud(): void {
    if (this.selectedBeneficiario && this.selectedHealth) {
      const id = this.selectedBeneficiario.idPerson;
      const payload = {
        idPerson: id,
        health: [this.selectedHealth]
      };

      console.log('Payload enviado a la API:', payload);

      this.beneficiariosService.correctEducationAndHealth(id, payload).subscribe({
        next: () => {
          alert('Salud actualizada correctamente');
          this.cargarBeneficiarios();
          this.verDetalles(id);
          this.cerrarModalSalud();
        },
        error: (error) => {
          console.error('Error al actualizar salud', error);
          alert('Error al actualizar la salud');
        }
      });
    }
  }

  // CIERRA EL MODAL DE LA EDICIÓN DE SALUD
  cerrarModalSalud(): void {
    this.selectedHealth = null;
    this.isEditingHealth = false;
  }




   // Abre el modal con la educación del beneficiario seleccionado
   openModal(beneficiario: BeneficiarioDTO): void {
    this.selectedBeneficiario = beneficiario;

    // Cargar información de educación de la persona
    this.beneficiariosService.getPersonByIdWithDetails(beneficiario.idPerson).subscribe(data => {
      this.selectedEducation = data.education[0] || {};; // Suponiendo que solo hay un objeto de educación
      this.isModalVisible = true;
    });
  }

  // Cierra el modal
  closeModal(): void {
    this.isModalVisible = false;
  }

  // Guarda la educación y cierra el modal
  saveEducation(updatedEducation: any): void {
    if (!this.selectedBeneficiario) return;

    const updatedData = {
      ...this.selectedBeneficiario,
      education: [updatedEducation]
    };

    this.beneficiariosService.updatePerson(this.selectedBeneficiario.idPerson, updatedData).subscribe(() => {
      this.closeModal();
      this.cargarBeneficiarios();
    });
  }



  openHealthModal(beneficiario: BeneficiarioDTO): void {
    this.selectedBeneficiario = beneficiario;

    // Cargar información de salud de la persona
    this.beneficiariosService.getPersonByIdWithDetails(beneficiario.idPerson).subscribe(data => {
      this.selectedHealth = data.health[0] || {}; // CORREGIDO
      this.isHealthModalVisible = true;
    });
  }

  closeHealthModal(): void {
    this.isHealthModalVisible = false;
  }

  saveHealthChanges(updatedHealth: any): void {
    if (!this.selectedBeneficiario) return;

    const updatedData = {
      ...this.selectedBeneficiario,
      health: [updatedHealth] // CORREGIDO
    };

    this.beneficiariosService.updatePerson(this.selectedBeneficiario.idPerson, updatedData).subscribe(() => {
      this.closeHealthModal();
      this.cargarBeneficiarios();
    });
  }
}
