
var app = require('express')();
var express = require('express');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var path = require('path');

app.use('/', express.static(__dirname+'/../'));

app.get('/', (req, res) => {
  
  res.sendFile(path.resolve(__dirname+'/../index.html'));
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});



var fs = require('fs');
var content = fs.readFileSync('../assets/users.csv','utf8');
var content2 = fs.readFileSync('../assets/pace.csv','utf8');






var jsonObj = [];
var finalObjects = [];
var x = 0;
          
          
          var arr = content.split('\n');     

          var headers = arr[0].split(';');
          for(var i = 0; i < arr.length; i++) {
            var data = arr[i].split(';');
            var obj = {};
            for(var j = 0; j < data.length; j++) {
              obj[headers[j].trim()] = data[j].trim();
            }
            jsonObj.push(obj);
          }
          jsonObj.splice(0,1);
          jsonObj.pop();



          var jsonObj2 = [];
          var arr2 = content2.split('\n');     
          var headers2 = arr2[0].split(';');
          for(var i = 0; i < arr2.length; i++) {
            var data2 = arr2[i].split(';');
            var obj2 = {};
            for(var j = 0; j < data2.length; j++) {
              obj2[headers2[j].trim()] = data2[j].trim();
            }
            jsonObj2.push(obj2);
          }
          jsonObj2.splice(0,1);
          jsonObj2.pop();


           //console.log(jsonObj);
           //console.log(jsonObj2);

          for(var n=0; n < jsonObj.length; n++) {

            for(m=0; m < jsonObj2.length; m++ ) {
              
              if(jsonObj[n].userid == jsonObj2[m].userid)
                
                finalObjects[m] = {...jsonObj[n], ...jsonObj2[m] };
                
           
            }

          }
        
          for(var h=0; h<finalObjects.length; h++) {
            finalObjects[h].avgPace = parseFloat(finalObjects[h].total_time) / parseFloat(finalObjects[h].distance) / 1000.0 ;
          }

          console.log(finalObjects);
        


          io.on('connection', (socket) => {
            socket.emit('data', (finalObjects))
          
          });