import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../interfaces/user";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.css']
})
export class UserProfileEditComponent implements OnInit, OnDestroy {

  public user: User;
  private sub: Subscription;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  loadProfile(): void {
    this.route.params.subscribe(params => {
      console.log(params["username"])
      this.sub = this.userService.getUserByUsername(params["username"]).subscribe(
        {next: user => this.user = user, error: err => console.log(err)}
      );
    })
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
