import { Injectable, OnModuleInit } from '@nestjs/common';
// El almacén es JavaScript compartido con la variante Express; se compila con allowJs.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Base: any = require('./record.store.base.js');

@Injectable()
export class RecordStore extends Base implements OnModuleInit {
  private starting?: Promise<void>;
  // Idempotente: otros proveedores (autenticación) esperan a que las migraciones terminen.
  ensureReady(): Promise<void> { return this.starting || (this.starting = this.init()); }
  async onModuleInit() { await this.ensureReady(); }
}
