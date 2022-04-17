import {Component, OnInit} from '@angular/core';
import {User} from "../interfaces/user";
import {UserService} from "../user.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  title = 'thiccthocc';
  public users: User[] = [];

  constructor(private userService: UserService,) {
  }

  public getUsers(): void {
    this.userService.getUsers().subscribe(
      {
        next: (user) => this.users = user,
        error: (error) => console.log(error)
      }
      // (response) => {
      //   this.users = response;
      // },
      // (error: HttpErrorResponse) => {
      //   console.log(error)
      // }
    );
  }

  ngOnInit(): void {
    this.getUsers();
  }

  searchUsers(searchterm: string) {
    console.log(searchterm);
    const results: User[] = [];
    for (const user of this.users) {
      if (user.username!.toLowerCase().indexOf(searchterm.toLowerCase()) !== -1
        || user.email!.toLowerCase().indexOf(searchterm.toLowerCase()) !== -1) {
        results.push(user);
      }
    }
    this.users = results;
    if (results.length === 0 || !searchterm) {
      this.getUsers();
    }
  }
}
