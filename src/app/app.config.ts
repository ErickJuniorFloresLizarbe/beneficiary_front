import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD0wLUvmgXJzTFmsEOBa8P4N3qFmEkCuXs",
  authDomain: "beneficiarios-b4738.firebaseapp.com",
  projectId: "beneficiarios-b4738",
  storageBucket: "beneficiarios-b4738.firebasestorage.app",
  messagingSenderId: "914133590405",
  appId: "1:914133590405:web:5ada8354aa721f94b724ec"
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)), // Inicializa Firebase
    provideAuth(() => getAuth()) // Configura la autenticación
  ]
};
