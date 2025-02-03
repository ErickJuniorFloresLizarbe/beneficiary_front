import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { FamilyDTO } from '../familiaDto';
import { FamilyService } from '../../services/family.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-familia-formulario',
  standalone: true,
  imports: [FormsModule], // Asegúrate de incluir FormsModule aquí
  templateUrl: './familia-formulario.component.html',
  styleUrls: ['./familia-formulario.component.css']
})
export class FamiliaFormularioComponent {
  @Input() familyToEdit: FamilyDTO | null = null; 
  @Output() familyCreated = new EventEmitter<FamilyDTO>();
  @Output() formClosed = new EventEmitter<void>();

  family: FamilyDTO = this.initializeFamily();
  familyId: number | null = null; // Añadir esta propiedad

  constructor(private familyService: FamilyService) {}

  ngOnChanges() {
    if (this.familyToEdit) {
      this.family = { ...this.familyToEdit }; 
      this.familyId = this.family.id; // Asignar el ID de la familia a editar
    } else {
      this.family = this.initializeFamily(); 
      this.familyId = null; // Reiniciar el ID si no hay familia a editar
    }
  }

  initializeFamily(): FamilyDTO {
    return {
      id: 0,
      direction: '',
      reasibAdmission: '',
      status: 'A',
      basicService: {
        waterService: '',
        servDrain: '',
        servLight: '',
        servCable: '',
        servGas: ''
      },
      communityEnvironment: {
        area: '',
        referenceLocation: '',
        residue: '',
        publicLighting: '',
        security: ''
      },
      familyComposition: {
        numberMembers: 0,
        numberChildren: 0,
        familyType: '',
        socialProblems: ''
      },
      familyFeeding: {
        frecuenciaSemanal: '',
        tipoAlimentacion: ''
      },
      familyHealth: {
        safeType: '',
        familyDisease: '',
        treatment: '',
        antecedentesEnfermedad: '',
        examenMedico: ''
      },
      housingDistribution: {
        ambienteHogar: 0,
        numeroDormitorio: 0,
        habitabilidad: ''
      },
      housingEnvironment: {
        tenure: '',
        typeOfHousing: '',
        housingMaterial: '',
        housingSecurity: ''
      },
      laborAutonomy: {
        numberRooms: 0,
        numberOfBedrooms: 0,
        habitabilityBuilding: ''
      },
      socialLife: {
        material: '',
        feeding: '',
        economic: '',
        spiritual: '',
        socialCompany: '',
        guideTip: ''
      }
    };
  }

  onSubmit(form: any) {
    if (form.valid) {
      if (this.familyId) { // Verifica si hay un ID
        this.familyService.updateFamily(this.familyId, this.family).subscribe(
          response => {
            console.log('Familia editada:', response);
            this.familyCreated.emit(response);
            Swal.fire({
              title: 'Éxito!',
              text: 'Registro editado exitosamente!',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.resetForm();
              this.closeForm();
            });
          },
          (error: any) => { // Añadido tipo explícito
            console.error('Error al editar la familia:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Ocurrió un error al editar el registro.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      } else {
        this.familyService.createFamily(this.family).subscribe(
          response => {
            console.log('Familia creada:', response);
            this.familyCreated.emit(response);
            Swal.fire({
              title: 'Éxito!',
              text: 'Registro creado exitosamente!',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.resetForm();
              this.closeForm();
            });
          },
          (error: any) => { // Añadido tipo explícito
            console.error('Error al crear la familia:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Ocurrió un error al crear el registro.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      }
    } else {
      console.log('Formulario no válido');
    }
  }

  resetForm() {
    this.family = this.initializeFamily(); 
    this.familyId = null; // Reiniciar el ID al restablecer el formulario
  }

  closeForm() {
    this.formClosed.emit(); 
  }
}
