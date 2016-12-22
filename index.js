const fs = require('fs-promise');
const http = require('http');
const JSNES = require('./source/nes.js')({});
const self = JSNES.ui;

module.exports = opts => {
  self.updateStatus("Downloading...");
  fs.readFile(opts.romPath, {encoding: 'binary'})
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
      }).listen(opts.port);
      console.log(`Server started on port ${opts.port}`);
    })
};
