import { Injectable, OnModuleInit } from '@nestjs/common';
import { RecordStore } from './record.store';
// El núcleo es JavaScript compartido con la variante Express; se compila con allowJs.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createAuth } = require('./auth/auth-core.js');

@Injectable()
export class AuthService implements OnModuleInit {
  readonly core: any;
  constructor(private readonly store: RecordStore) { this.core = createAuth({ store }); }
  async onModuleInit() {
    await this.store.ensureReady();
    await this.core.init();
  }
}
