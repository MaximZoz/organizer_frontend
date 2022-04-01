import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../Models/responseModel';
import { map } from 'rxjs/operators';
import { ResponseCode } from '../enums/responseCode';
import { Task, User } from '../Models/user';
import { Constants } from '../Helper/constants';
import { Role } from '../Models/role';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseURL: string = 'https://localhost:5001/api/user/';
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  public login(email: string, password: string) {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const body = {
      Email: email,
      Password: password,
    };
    return this.httpClient.post<ResponseModel>(this.baseURL + 'Login', body);
  }

  public register(
    fullname: string,
    email: string,
    password: string,
    roles: string[]
  ) {
    const body = {
      FullName: fullname,
      Email: email,
      Password: password,
      Roles: roles,
    };
    return this.httpClient.post<ResponseModel>(
      this.baseURL + 'RegisterUser',
      body
    );
  }

  public getAllUser() {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
    });

    return this.httpClient
      .get<ResponseModel>(this.baseURL + 'GetAllUser', { headers: headers })
      .pipe(
        map((res) => {
          let userList = new Array<User>();
          if (res.responseCode == ResponseCode.OK) {
            if (res.dateSet) {
              res.dateSet.map((x: User) => {
                userList.push(
                  new User(x.fullName, x.email, x.userName, x.roles)
                );
              });
            }
          }
          return userList;
        })
      );
  }
  public getUserList() {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
    });

    return this.httpClient
      .get<ResponseModel>(this.baseURL + 'GetUserList', { headers: headers })
      .pipe(
        map((res) => {
          let userList = new Array<User>();
          if (res.responseCode == ResponseCode.OK) {
            if (res.dateSet) {
              res.dateSet.map((x: User) => {
                userList.push(
                  new User(x.fullName, x.email, x.userName, x.roles)
                );
              });
            }
          } else {
            this.toastr.error(res.responseMessage);
          }
          return userList;
        })
      );
  }
  public getAllRole() {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
    });

    return this.httpClient
      .get<ResponseModel>(this.baseURL + 'GetRoles', { headers: headers })
      .pipe(
        map((res) => {
          let roleList = new Array<Role>();
          if (res.responseCode == ResponseCode.OK) {
            if (res.dateSet) {
              res.dateSet.map((x: string) => {
                roleList.push(new Role(x));
              });
            }
          }
          return roleList;
        })
      );
  }

  public create(task: Task, date: string): Observable<Task> {
    const body = new Task();
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    body.title = task.title;
    body.userId = userInfo.id;
    body.date = moment(date, 'DD.MM.YYYY').add(1, 'd').toDate();
    body.id = task.id;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
    });
    return this.httpClient.post<Task>(`${this.baseURL}Tasks`, body, {
      headers: headers,
    });
  }

  public getTasks(date): Observable<Task[]> {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
      'Access-Control-Allow-Origin': '*',
    });

    return this.httpClient
      .get<any>(`${this.baseURL}Tasks/${userInfo.id}/${date}`, {
        headers: headers,
      })
      .pipe(
        map((res) => {
          return res.dateSet;
        })
      );
  }
  public getTaskMonth(date): Observable<Task[]> {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
      'Access-Control-Allow-Origin': '*',
    });

    return this.httpClient
      .get<any>(`${this.baseURL}GetTaskMonth/${userInfo.id}/${date}`, {
        headers: headers,
      })
      .pipe(
        map((res) => {
          return res.dateSet;
        })
      );
  }

  public removeTasks(id) {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
      'Access-Control-Allow-Origin': '*',
    });

    return this.httpClient.delete<any>(`${this.baseURL}Tasks/${id}`, {
      headers: headers,
    });
  }
}
