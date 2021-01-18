import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Acenda } from 'acenda';
import { AuthService } from 'src/auth/auth.service';
import { IAuth } from 'src/auth/models/auth.model';

@Injectable()
export class AcendaClient {
  constructor(@Inject('ACENDA_REPOSITORY') private auth: IAuth, private authService: AuthService) { }
  public async getAcendaClient(storeId: string): Promise<Acenda> {
    try {
      if (!storeId || storeId == 'undefined') {
        throw new NotFoundException()
      }
      if (((Date.now() - this.auth.createdAt.getTime()) > ((this.auth.expiresIn - 14400) * 1000))) {
        this.auth = await this.authService.createOrUpdateAccessToken()
      }
      return new Acenda(storeId, this.auth.accessToken);
    } catch (error) {
      throw error
    }
  }
}