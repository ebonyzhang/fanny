var spawn = require('child_process').exec;

// Hexo 3 �û��������
hexo.on('new', function(data){
  spawn('start  "F:\ProgramData\marktext\Mark Text\Mark Text.exe" ' + data.path);
});