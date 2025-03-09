import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';


import { User } from 'firebase/auth'; // Importa el tipo User correctamente
import { AuthService } from './dashboard/pages/services/auth.services';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService); // Inyección del servicio AuthService


  ngOnInit(): void {
    this.authService.user$.subscribe((user: User | null) => {
      if (user) {
        this.authService.currentUserSig.set({
          uid: user.uid,                        // Agrega el uid del usuario
          email: user.email || '',             // Asegúrate de que no sea null
          username: user.displayName || '',    // Usa displayName como username o pon un valor por defecto
          displayName: user.displayName || ''  // Asegúrate de que no sea null
        });
      } else {
        this.authService.currentUserSig.set(null);
      }
      console.log(this.authService.currentUserSig());
    });
  }



  logout(): void {
    this.authService.logout().subscribe(); // Asegúrate de manejar la suscripción
  }
}
