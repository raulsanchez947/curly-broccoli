const http = require('http');
const port = process.argv[2] || 3005;
const server = http.createServer((req,res)=>{ res.end('ok') });
server.listen(port, ()=> console.log('listening', port));
setInterval(()=>{}, 10000); // keep alive
