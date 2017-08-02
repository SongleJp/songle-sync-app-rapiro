
var serialport = require('serialport')
  , hostname = require('os-hostname')
  , port = new serialport('/dev/ttyS0', { baudRate: 57600 })
  , host = null;

hostname(function (err, hname) {
  if (!err) host = hname;
  console.log('Host name:', host);
});

port.on('open', function () {
  console.log('Serial open.');
  setTimeout(function () {
    write("#M6");
    setTimeout(function () {
      process.exit(0);
    }, 500);
  }, 500);
});

port.on('data', function (data) {
  if (typeof data !== 'string') data = new String(data);
  data = data.trim();
  console.log('Recv: ' + data);
});

function write(data) {
  port.write(data, function(err, results) {
    if(err) {
      console.log('Err: ' + err);
      console.log('Results: ' + results);
    } else {
      console.log('Wrote: ' + data);
    }
  });
}
