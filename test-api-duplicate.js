// Test duplicate field handling via actual API
const http = require('http');

const testData = {
  name: "Wireless Headphones",
  price: 2500,
  category: "Electronics",
  description: "Test duplicate",
  seller: "Test User"
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/products',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing duplicate field via API...');
console.log('Request data:', postData);

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response status:', res.statusCode);
    console.log('Response body:', data);
    
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 400 && 
          response.status === 'fail' && 
          response.message.includes('Duplicate field value')) {
        console.log('\n✅ SUCCESS: Duplicate field error handling is working correctly!');
      } else if (res.statusCode === 201) {
        console.log('\n⚠️  WARNING: Product created successfully (no duplicate error triggered)');
        console.log('This might indicate the unique constraint is not working as expected.');
      } else {
        console.log('\n❌ UNEXPECTED: Got different response than expected');
      }
    } catch (e) {
      console.log('Error parsing response:', e.message);
    }
  });
});

req.on('error', (err) => {
  console.log('Request error:', err.message);
});

req.write(postData);
req.end();
