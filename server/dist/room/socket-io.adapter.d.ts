import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerOptions } from 'socket.io';
export declare class SocketIoAdapter extends IoAdapter {
    private app;
    private configService;
    constructor(app: INestApplication, configService: ConfigService);
    createIOServer(port: number, options?: ServerOptions): any;
}
