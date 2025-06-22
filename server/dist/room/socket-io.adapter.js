"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class SocketIoAdapter extends platform_socket_io_1.IoAdapter {
    app;
    configService;
    constructor(app, configService) {
        super(app);
        this.app = app;
        this.configService = configService;
    }
    createIOServer(port, options) {
        const origin = this.configService.get('CLIENT_URL');
        return super.createIOServer(port, {
            ...options,
            cors: {
                origin,
                credentials: true,
            },
        });
    }
}
exports.SocketIoAdapter = SocketIoAdapter;
//# sourceMappingURL=socket-io.adapter.js.map