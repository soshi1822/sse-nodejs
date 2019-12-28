import { ServerResponse } from 'http' ;

default class {
  constructor(res: ServerResponse, optional?: { statusCode?: number, headers?: { [key: string]: string } })

  send(event: string, data: string | Object | Array<any>, id?: string | number, retry?: number): void
  send(data: { id?: string | number, event?: string, retry?: number, data: string | Object | Array<any> }): void

  keepAlive(): void

  close(): void
}
