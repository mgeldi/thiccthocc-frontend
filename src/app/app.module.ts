import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {RecordComponent} from "./record/record.component";
import {UsersComponent} from "./users/users.component";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {LoginComponent} from "./login/login.component";
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';

export const routerConfig: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'record',
    component: RecordComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'user/profile/:username',
    component: UserProfileComponent
  },
  {
    path: 'user/profile/:username/edit',
    component: UserProfileEditComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [AppComponent, HomeComponent, UsersComponent, RecordComponent, UserProfileComponent, UserProfileEditComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot(routerConfig),
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
