export class AuthResponse {
  public email!: string;
  public token!: string;

  constructor(
    email: string,
    token: string
  ) {
    this.email = email;
    this.token = token;
  }
}
