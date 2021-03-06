import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  hide = true;

  AdminForm = this.fb.group({
    userID: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router) {
  }

  ngOnInit(): void {

  }

  /**
   * Verifies information submitted by user and determines if the login information matches the information on the database so the administrator can gain access.
   * @returns Alert if the information submitted is incorrect.
   */
  submit() {
    let userInfo = this.AdminForm.value;
    let data = this.dataService.admin;
    if (userInfo.userID == data.username && userInfo.password == data.password) {
      console.log('Match');
      sessionStorage.setItem('admin','true');
      this.router.navigate(['/adminPanel']);
    } else {
      if (userInfo.userID == data.username && userInfo.password != data.password) {
        alert("Wrong Password.");
      } else {
        alert("User Not Found.");
      }
    }
  }
}
