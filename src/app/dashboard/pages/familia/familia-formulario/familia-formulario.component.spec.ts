import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliaFormularioComponent } from './familia-formulario.component';

describe('FamiliaFormularioComponent', () => {
  let component: FamiliaFormularioComponent;
  let fixture: ComponentFixture<FamiliaFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamiliaFormularioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FamiliaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
