var http = require("http");

var options = {  
    path : "/health",
    host : "localhost",
    port : "8080",
    timeout : 2000
};

var request = http.request(options, (res) => {  

  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      var code = 5;
      const parsedData = JSON.parse(rawData);
      console.log("health: " + parsedData.health);
      switch(parsedData.health) {
	case "healthy":
	  code = 0;
	  break;
	case "unhealthy":
	  code = 1;
	  break;
	case "reserved":
	  code = 2;
	  break;
	default:
	  code = 3;
	  break;
      }
      process.exit(code);		
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
request.end();
