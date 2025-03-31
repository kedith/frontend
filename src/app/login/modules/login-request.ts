export class LoginRequest {
  constructor(
    public username: string | null | undefined,
    public password: string | null | undefined
  ) {}
}
