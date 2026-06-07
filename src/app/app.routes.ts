import { Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog';
import { ProfileComponent } from './profile/profile';
import { LoginComponent } from './login/login';
import { CreateComponent } from './create/create';
export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'create', component: CreateComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'catalog' }
];
