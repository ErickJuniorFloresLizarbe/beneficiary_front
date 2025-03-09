import { inject, Injectable, signal } from "@angular/core";
import { from, Observable } from "rxjs";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user, User } from "@angular/fire/auth";
import { UserInterface } from "../../../user.interface";


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private firebaseAuth = inject(Auth);


  // Observable para el usuario actual
  user$ = user(this.firebaseAuth);

  // Signal para almacenar los datos del usuario actual
  currentUserSig = signal<UserInterface | null>(null);


  constructor() {
    this.user$.subscribe((firebaseUser: User | null) => {
      if (firebaseUser) {
        this.currentUserSig.set({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          username: "",
          displayName: ""
        });
      } else {
        this.currentUserSig.set(null);
      }
    });
  }


  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => {
        return updateProfile(response.user, { displayName: username }).then(() => {
          this.currentUserSig.set({
            uid: response.user.uid,
            email: response.user.email || '',
            username: username,
            displayName: username
          });
        });
      });
    return from(promise);
  }



  // Inicio de sesión
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(() => {});
    return from(promise);
  }


  // Cierre de sesión
  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }


  // Obtener usuario actual
  getCurrentUser(): UserInterface | null {
    return this.currentUserSig();
  }


  // Verificar si hay una sesión activa
  isAuthenticated(): boolean {
    return this.currentUserSig() !== null;
  }
}
