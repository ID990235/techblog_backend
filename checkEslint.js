const chokidar = require('chokidar');
const execSh = require('exec-sh');

chokidar.watch(['./controller', './router']).on('all', (event, path) => {
  if (event === 'change') {
    // console.log(path)
    execSh("npm run lint", function (err) {
      if (err) console.log("Exit code: ", err.code);
    });
  }
})