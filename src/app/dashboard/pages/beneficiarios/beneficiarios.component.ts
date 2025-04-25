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
  beneficiariosFiltrados: BeneficiarioDTO[] = []; // Nueva lista para mostrar los resultados filtrados
  searchTerm: string = '';
  showBeneficiarioDetails: boolean = true;


  constructor(private beneficiariosService: BeneficiariosService) {}

  ngOnInit(): void {
    this.cargarBeneficiarios();
  }

   // Método para formatear la fecha
   formatBirthdate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options).replace(/\s/g, '-');
  }

  //FILTRO DE BUSQUEDA
  filtrarBeneficiarios(): void {
    if (!this.searchTerm) {
      this.beneficiariosFiltrados = this.beneficiarios;
    } else {
      const lowerCaseSearch = this.searchTerm.toLowerCase();
      this.beneficiariosFiltrados = this.beneficiarios.filter(b =>
        b.name.toLowerCase().includes(lowerCaseSearch) ||
        b.surname.toLowerCase().includes(lowerCaseSearch)||
        b.documentNumber.toLowerCase().includes(lowerCaseSearch)
      );
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

  //LISTADO DE BENEFICIARIOS Y APADRINADOS
  cargarBeneficiarios(): void {
    if (this.estadoApadrinamiento === 'SI') {
      this.beneficiariosService.getPersonsBySponsoredAndState(this.estadoApadrinamiento, this.estadoActual)
        .subscribe(data => {
          this.beneficiarios = data;
          this.filtrarBeneficiarios();
        });
    } else if (this.estadoApadrinamiento === 'NO') {
      this.beneficiariosService.getPersonsByTypeKinshipAndState(this.tipoParentesco, this.estadoActual)
        .subscribe(data => {
          this.beneficiarios = data;
          this.filtrarBeneficiarios();
        });
    }
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

  //viewdetail

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
    this.isModalVisible = true;
    this.showBeneficiarioDetails = false; // Ocultar detalles del beneficiario
    
    // Cargar información de educación de la persona
    this.beneficiariosService.getPersonByIdWithDetails(beneficiario.idPerson).subscribe(data => {
      this.selectedEducation = data.education[0] || {}; 
    });
  }
  
  closeModal(): void {
    this.isModalVisible = false;
    this.showBeneficiarioDetails = true; // Mostrar detalles del beneficiario
  
    // Actualizar los datos del beneficiario seleccionado
    if (this.selectedBeneficiario) {
      this.beneficiariosService.getPersonByIdWithDetails(this.selectedBeneficiario.idPerson).subscribe(updatedBeneficiario => {
        this.selectedBeneficiario = updatedBeneficiario;
        this.selectedEducation = updatedBeneficiario.education[0] || {}; // Actualizar datos de educación
        this.selectedHealth = updatedBeneficiario.health[0] || {}; // Actualizar datos de salud
        this.isEditing = false;
      });
    }
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
    this.isHealthModalVisible = true;
    this.showBeneficiarioDetails = false;

    // Cargar información de salud de la persona
    this.beneficiariosService.getPersonByIdWithDetails(beneficiario.idPerson).subscribe(data => {
      this.selectedHealth = data.health[0] || {}; // CORREGIDO
    });
  }

  closeHealthModal(): void {
    this.isHealthModalVisible = false;
    this.showBeneficiarioDetails = true; // Mostrar detalles del beneficiario
  
    // Actualizar los datos del beneficiario seleccionado
    if (this.selectedBeneficiario) {
      this.beneficiariosService.getPersonByIdWithDetails(this.selectedBeneficiario.idPerson).subscribe(updatedBeneficiario => {
        this.selectedBeneficiario = updatedBeneficiario;
        this.selectedEducation = updatedBeneficiario.education[0] || {}; // Actualizar datos de educación
        this.selectedHealth = updatedBeneficiario.health[0] || {}; // Actualizar datos de salud
        this.isEditing = false;
      });
    }
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
