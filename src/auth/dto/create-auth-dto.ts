export class CreateAuthDto {
    readonly name: string;
    readonly tokenType: string;
    readonly accessToken: string;
    readonly expiresIn: number;
    readonly refreshToken: string;
    readonly xRefreshToken: number;
    readonly idToken: string;
    readonly createdAt: number;
}