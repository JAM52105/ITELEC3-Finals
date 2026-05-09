const http = require('http');
const data = JSON.stringify({ email: 'normal@example.com', password: '12345678' });

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/v1/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  console.log('HEADERS', res.headers);
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('BODY', body);
  });
});

req.on('error', (err) => {
  console.error('REQUEST ERROR', err);
});

req.write(data);
req.end();
