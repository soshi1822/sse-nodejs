import { ServerResponse } from 'http';

export class SSE {
    constructor(private readonly res: ServerResponse, private options: SSEInitialize = {}) {
        this.initialize();
    }

    initialize() {
        this.res.writeHead(
            this.options.statusCode || 200,
            Object.assign(
                {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    Connection: 'keep-alive'
                },
                this.options.headers
            )
        );
        this.res.write('\n');
    }

    send(event: SSESendOptions | string, data?: string, id?: number | string, retry?: string) {
        const options: SSESendOptions = {
            data: data,
            event: event,
            id: id,
            retry: retry
        };

        if (typeof event === 'object') {
            options.data = event.data;
            options.event = event.event;
            options.id = event.id;
            options.retry = event.retry;
        }

        if (typeof event !== 'object' && typeof data === 'undefined') {
            options.event = undefined;
            options.data = event;
        }

        if (options.id) {
            this.res.write(`id: ${options.id}\n`);
        }
        if (options.event) {
            this.res.write(`event: ${options.event}\n`);
        }
        if (options.retry) {
            this.res.write(`retry: ${options.retry}\n`);
        }
        if (typeof options.data !== 'string') {
            options.data = JSON.stringify(options.data);
        }

        options.data = options.data.replace(/(\r\n|\r|\n)/g, '\n');
        options.data.split(/\n/).forEach((line, i, all) => {
            this.res.write(`data: ${line}\n${i === all.length - 1 ? '\n' : ''}`);
        });
    }

    keepAlive() {
        this.res.write(':\n\n');
    }

    close() {
        this.res.end();
    }
}

interface SSEInitialize {
    statusCode?: number;
    headers?: { [key: string]: string };
}

interface SSESendOptions {
    id?: string | number;
    event?: string | SSESendOptions;
    retry?: string;
    data?: string | object | Array<any>;
}
