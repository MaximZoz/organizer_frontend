export class User {
  public fullName: string = '';
  public email: string = '';
  public userName: string = '';
  public roles: string[] = [];
  public quantityNotes: string = '';
  public quantityConfirmNotes: string = '';
  public id: string = '';

  constructor(
    fullName: string,
    email: string,
    userName: string,
    roles: string[],
    quantityNotes: string,
    quantityConfirmNotes: string,
    id: string
  ) {
    this.fullName = fullName;
    this.email = email;
    this.userName = userName;
    this.id = id;
    this.roles = roles;
    this.quantityNotes = quantityNotes;
    this.quantityConfirmNotes = quantityConfirmNotes;
  }
}

export class Task {
  id?: string;
  title: string;
  date?: string | Date | moment.Moment;
  userId?: string;
  completed: boolean;
  сonfirm = false;
  priority: number;
}
