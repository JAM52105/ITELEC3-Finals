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
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    const json = JSON.parse(body);
    console.log('LOGIN STATUS', res.statusCode);
    if (!json.token) {
      console.error('NO TOKEN', body);
      return;
    }
    const token = json.token;
    console.log('TOKEN RECEIVED, waiting 7s to expire...');
    setTimeout(() => {
      const opt2 = {
        hostname: '127.0.0.1',
        port: 3000,
        path: '/api/v1/products',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const req2 = http.request(opt2, (res2) => {
        let body2 = '';
        res2.on('data', (chunk) => {
          body2 += chunk;
        });
        res2.on('end', () => {
          console.log('PROTECTED STATUS', res2.statusCode);
          console.log('PROTECTED BODY', body2);
        });
      });
      req2.on('error', (err) => {
        console.error('PROTECTED REQUEST ERROR', err);
      });
      req2.end();
    }, 7000);
  });
});

req.on('error', (err) => {
  console.error('REQUEST ERROR', err);
});
req.write(data);
req.end();
