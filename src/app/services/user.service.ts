import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../Models/responseModel';
import { map } from 'rxjs/operators';
import { ResponseCode } from '../enums/responseCode';
import { Task, User } from '../Models/user';
import { Constants } from '../Helper/constants';
import { Role } from '../Models/role';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';
import { isUndefined } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userEmail: string;
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
                  new User(
                    x.fullName,
                    x.email,
                    x.userName,
                    x.roles,
                    x.quantityNotes,
                    x.quantityConfirmNotes,
                    x.id
                  )
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
                  new User(
                    x.fullName,
                    x.email,
                    x.userName,
                    x.roles,
                    x.quantityNotes,
                    x.quantityConfirmNotes,
                    x.id
                  )
                );
                userList.sort((b, a) => +b.quantityNotes - +a.quantityNotes);
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

  public create(task: Task, date: string, id?): Observable<Task> {
    const body = new Task();
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    body.title = task.title;
    body.priority = task.priority;
    body.userId = isUndefined(id) ? userInfo.id : id;
    body.date = moment(date, 'DD.MM.YYYY').add(1, 'd').toDate();
    body.id = task.id;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
    });
    return this.httpClient.post<Task>(`${this.baseURL}Tasks`, body, {
      headers: headers,
    });
  }

  public getTasks(date, id?): Observable<Task[]> {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
      'Access-Control-Allow-Origin': '*',
    });
    const userId = isUndefined(id) ? userInfo.id : id;
    return this.httpClient
      .get<any>(`${this.baseURL}Tasks/${userId}/${date}`, {
        headers: headers,
      })
      .pipe(
        map((res) => {
          return res.dateSet;
        })
      );
  }

  public getTaskMonth(date, id?): Observable<Task[]> {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
      'Access-Control-Allow-Origin': '*',
    });
    const userId = isUndefined(id) ? userInfo.id : id;
    return this.httpClient
      .get<any>(`${this.baseURL}GetTaskMonth/${userId}/${date}`, {
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

  public successTasks(id) {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
      'Access-Control-Allow-Origin': '*',
    });

    return this.httpClient.put<any>(`${this.baseURL}SuccessTasks/${id}`, {
      headers: headers,
    });
  }

  public refuseTasks(id) {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
      'Access-Control-Allow-Origin': '*',
    });

    return this.httpClient.put<any>(`${this.baseURL}RefuseTasks/${id}`, {
      headers: headers,
    });
  }

  public priorityTasks(id, index) {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
      'Access-Control-Allow-Origin': '*',
    });

    return this.httpClient.put<any>(
      `${this.baseURL}PriorityTasks/${id}/${index}`,
      {
        headers: headers,
      }
    );
  }

  public confirmTasks(id) {
    let userInfo = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userInfo?.token}`,
      'Access-Control-Allow-Origin': '*',
    });

    return this.httpClient.put<any>(`${this.baseURL}ConfirmTasks/${id}`, {
      headers: headers,
    });
  }
}
