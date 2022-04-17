import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {User} from "../interfaces/user";
import {UserService} from "../user.service";
import {map, Observable, Subscription, switchMap} from "rxjs";
import {parse} from "@fortawesome/fontawesome-svg-core";
import {KeyboardProfile} from "../interfaces/keyboardprofile";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  public user: User;
  private sub: Subscription;
  public keyboardProfiles: KeyboardProfile;

  constructor(private userService: UserService, private route: ActivatedRoute) {
  }

  loadProfile(): void {
    this.route.params.subscribe(params => {
      console.log(params["username"])
      this.sub = this.userService.getUserByUsername(params["username"]).subscribe(
        {next: user => this.user = user, error: err => console.log(err)}
      );
      this.sub = this.userService.getKeyboardProfileByUsername(params["username"]).subscribe(
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
