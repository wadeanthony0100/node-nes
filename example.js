const fs = require('fs-promise');
const http = require('http');
const JSNES = require('./source/nes.js')({});
const self = JSNES.ui;

self.updateStatus("Downloading...");
fs.readFile('roms/lj65/lj65.nes', {encoding: 'binary'})
  .then(rom => {
    self.nes.loadRom(rom);
    self.nes.start();
    self.enable();
    const canvas = self.nes.ui.screen[0];
    http.createServer(function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(''
            + '<meta http-equiv="refresh" content="1;" />'
            + '<img src="' + canvas.toDataURL() + '" />');
    }).listen(3000);
    console.log('Server started on port 3000');
  })
  .catch(reason => console.error(reason));
