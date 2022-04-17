import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {User} from "./interfaces/user";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serverUrl = environment.restServerUrl;

  constructor(private http: HttpClient) {
  }

  public getUsers(): Observable<User[]> {
    console.log(`getting at ${this.serverUrl}/user`)
    return this.http.get<User[]>(`${this.serverUrl}/user`);
  }

  public getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.serverUrl}/user/profile/${username}`);
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.serverUrl}/user/add`, user);
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.serverUrl}/user/update`, user);
  }

  public deleteUser(username: string): Observable<void> {
    return this.http.delete<void>(`${this.serverUrl}/user/delete/${username}`);
  }

  getKeyboardProfileByUsername(username: string) {
    return this.http.get<User>(`${this.serverUrl}/user/profile/${username}`);
  }
}
