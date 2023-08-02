let express = require('express');
let request = require('request');
let bodyParser = require('body-parser');
let app = express();
var fs = require("fs");
app.use(bodyParser.json());//这是处理JSON格式的请求体
app.use(bodyParser.urlencoded({ extended: true }));//这是处理表单格式的请求体
app.get('/list', async function (req, res) {
  const base = 'https://www.javascriptpeixun.cn/my/courses/learning'
  console.log(req.query?.page,'req.query?.page')
  const url = req.query?.page ? `${base}?page=${req.query?.page}`:base 
  console.log(url,'url')
  await request({
    url,
    headers: {
      Cookie: '_ga_RPQ8W9GP8M=GS1.1.1681711716.1.1.1681711718.0.0.0; _ga=GA1.2.2112217781.1662625420; online-uuid=22F6C2B9-2EF2-082C-2659-81179E3BF4EC; PHPSESSID=0nati0ngjoojhj0imvi9h27ror; REMEMBERME=Qml6XFVzZXJcQ3VycmVudFVzZXI6ZFhObGNsOXNOWGN6ZUhFNGVHOUFaV1IxYzI5b2J5NXVaWFE9OjE3MjI1MDAwMzI6NDI5NmE2NzgwNjkwZWQzZDMwOTJlOGI0MmFlNzgzMjQwYjFlYjkzN2Y0NGNjYjYxZTI0OTJmNTY1M2I4MDc4Mw%3D%3D'
    }
  }, function (err, response, body) {
   
    res.send(response.body);
  });


});
app.get('/detail', async function (req, res) {
  const url = 'https://www.javascriptpeixun.cn/my/course/3415'
  console.log(url,'url')
  await request({
    url,
    headers: {
      Cookie: '_ga_RPQ8W9GP8M=GS1.1.1681711716.1.1.1681711718.0.0.0; _ga=GA1.2.2112217781.1662625420; online-uuid=22F6C2B9-2EF2-082C-2659-81179E3BF4EC; PHPSESSID=0nati0ngjoojhj0imvi9h27ror; REMEMBERME=Qml6XFVzZXJcQ3VycmVudFVzZXI6ZFhObGNsOXNOWGN6ZUhFNGVHOUFaV1IxYzI5b2J5NXVaWFE9OjE3MjI1MDAwMzI6NDI5NmE2NzgwNjkwZWQzZDMwOTJlOGI0MmFlNzgzMjQwYjFlYjkzN2Y0NGNjYjYxZTI0OTJmNTY1M2I4MDc4Mw%3D%3D'
    }
  }, function (err, response, body) {
    console.log( response.body,'response.body')
    fs.writeFile('1.html', response.body,  function(err) {
      if (err) {
          return console.error(err);
      }
      console.log("数据写入成功！");
      console.log("--------我是分割线-------------")
      console.log("读取写入的数据！");
     
   });
    res.send(response.body);
  });


});
app.post('/form', function (req, res) {
  let body = req.body;
  res.send(body);
});
//multer

app.listen(3000);