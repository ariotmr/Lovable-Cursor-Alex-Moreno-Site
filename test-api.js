const http = require('http');
http.get('http://localhost:8080/api/get-session?session_id=cs_test_a1Lmds2XAcApXiy4id86kThb4taWavCCZqiRAE6GeeKGEvcCI9IqCWIk0y', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'DATA:', data));
});
