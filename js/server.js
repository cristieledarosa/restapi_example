var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

var input = '', output = '';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (request, response) {
   fs.readFile('../views/index.html', null, function (error, data) {
      if (error) {
         response.writeHead(404);
         response.write('File not found.');
      }
      else {
         response.write(data);
         response.end();
      }
   });
});

app.post('/', function (request, response) {
   fs.readFile('../views/index.html', null, function (error, data) {
      if (error) {
         response.writeHead(404);
         response.write('File not found.');
      }
      else
         response.redirect('/');
   });
});

app.get('/output', function (request, response) {
   fs.readFile('../views/result.html', null, function (error, data) {
      if (error) {
         response.writeHead(404);
         response.write('File not found.');
      }
      else {
         response.write(data);
         response.end();
      }
   });
});

app.post('/output', function (request, response) {
   input = request.body.digit ? request.body.digit : input;
   verify();
   response.redirect('/output');
});

app.get('/digit', function (request, response) {
   response.send(output);
});

app.get('/JSON', function (request, response) {
   fs.readFile('../digits/test.json', null, function (error, data) {
      if (error) {
         response.writeHead(404);
         response.write('File not found.');
      }
      else {
         response.send(JSON.parse(data));
         response.end();
      }
   });
});

function verify() {
   output = '';
   var ajax = new XMLHttpRequest();
   var url = 'http://localhost:3000/JSON';
   ajax.open("GET", url);

   ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
         var jcontent = JSON.parse(ajax.responseText);
         for (var i = 0; i < jcontent.digits.length; i++) {
            if (jcontent.digits[i].digit == input) {
               output = jcontent.digits[i].name;
               break;
            }
         }
      }
   }
   ajax.send();
}

app.listen(PORT);
