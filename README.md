# sse-nodejs

Node.JS の標準モジュール http を使用し、SSE を実現する簡単なモジュールです。

## Usage

```
const SSE = require('sse-nodejs');
const http = require('http');

const connection = [];

http.createServer((req, res) => {
    var sse = new SSE(res);

    connection.push(sse);
    res.on('close', ()=> {
        connection.splice(connection.indexOf(sse), 1);
        sse.close();
    });

    sse.send('start!');
}).listen(8080);

setInterval(() => {
    connection.forEach(sse => {
        sse.keepAlive();
    });
}, 10 * 1000);
```

## Author

[@soshi1822](https://twitter.com/soshi1822)

## License

MIT License
