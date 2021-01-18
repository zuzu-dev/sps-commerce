import { AuthService } from "src/auth/auth.service"


export const acendaAuth = {
  provide: 'ACENDA_REPOSITORY',
  useFactory: async (authService: AuthService) => {
    return await authService.createOrUpdateAccessToken()
  },
  inject: [AuthService]
}