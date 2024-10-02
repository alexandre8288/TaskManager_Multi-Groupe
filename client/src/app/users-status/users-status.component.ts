import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-users-status',
  templateUrl: './users-status.component.html',
  styleUrls: ['./users-status.component.scss'],
})
export class UsersStatusComponent implements OnInit {
  users: { firstname: string; lastname: string; status: string }[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsersStatus().subscribe(
      (data) => {
        console.log('Data received:', data);
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}
