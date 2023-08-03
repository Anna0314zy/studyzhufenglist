let express = require('express');
let request = require('request');
let bodyParser = require('body-parser');
let app = express();
var fs = require('fs');
const query = require('./db.js');
const cheerio = require('cheerio');
const Cookie =
  '_ga_RPQ8W9GP8M=GS1.1.1681711716.1.1.1681711718.0.0.0; _ga=GA1.2.2112217781.1662625420; online-uuid=22F6C2B9-2EF2-082C-2659-81179E3BF4EC; PHPSESSID=0nati0ngjoojhj0imvi9h27ror; REMEMBERME=Qml6XFVzZXJcQ3VycmVudFVzZXI6ZFhObGNsOXNOWGN6ZUhFNGVHOUFaV1IxYzI5b2J5NXVaWFE9OjE3MjI1MDAwMzI6NDI5NmE2NzgwNjkwZWQzZDMwOTJlOGI0MmFlNzgzMjQwYjFlYjkzN2Y0NGNjYjYxZTI0OTJmNTY1M2I4MDc4Mw%3D%3D';
app.use(bodyParser.json()); //这是处理JSON格式的请求体
app.use(bodyParser.urlencoded({ extended: true })); //这是处理表单格式的请求体
app.get('/list', async function (req, res) {
  const base = 'https://www.javascriptpeixun.cn/my/courses/learning';
  console.log(req.query?.page, 'req.query?.page');
  const url = req.query?.page ? `${base}?page=${req.query?.page}` : base;
  console.log(url, 'url');
  await request(
    {
      url,
      headers: {
        Cookie,
      },
    },
    async function (err, response, body) {
      const data = await query(`SELECT html FROM article WHERE id = ? `, [req.query?.page || 1]);
      res.send(data[0]?.html);
    }
  );
});
// app.get('/detail', async function (req, res) {
//   const id = req.query?.id;
//   const url = `https://www.javascriptpeixun.cn/my/course/${id}`;
//   await request(
//     {
//       url,
//       headers: {
//         Cookie,
//       },
//     },
//     async function (err, response, body) {
//       // course-detail-heading
//       const head = await query(`SELECT title FROM detail WHERE articleId = ? `, [id]);
//       const data = await query(`SELECT * FROM detailData WHERE articleId = ? `, [id]);
//       res.send({ head: head[0]?.title, data });

//     }
//   );
// });
app.get('/detail', async function (req, res) {
  const id = req.query?.id;
  const url = `https://www.javascriptpeixun.cn/my/course/${id}`;
  await request(
    {
      url,
      headers: {
        Cookie,
      },
    },
    async function (err, response, body) {
      // course-detail-heading
      const $ = cheerio.load(response.body);
     
      const title = $('.breadcrumb li').last().text();
      console.log(title,'--ddddd-',)
      const has =  await query(`SELECT * FROM detail WHERE articleId = ? `, [id]);
    console.log(has,'has')
      if(has.length) return res.send('success')
      await query(`INSERT INTO detail(articleId,html,title) VALUES(?,?,?)`, [id, response.body, title]);
      const url = `https://www.javascriptpeixun.cn/course/${id}/task/list/render/default`;
      // const url = "https://www.javascriptpeixun.cn/course/3397/task/list/render/default"
      await request(
        {
          url,
          headers: {
            Cookie,
          },
        },
        async function (err, response, body) {
          let $ = cheerio.load(response.body);
          const data =JSON.parse($('.js-hidden-cached-data').text())
        
          for (let i = 0; i <= (data).length; i++) {
            // console.log(data[i], 'data[i]');
            const obj = data[i];
            if(!obj?.itemType) return;
            // UPDATE Person SET Address = 'Zhongshan 23', City = 'Nanjing'，WHERE LastName = 'Wilson'
            // await query(`UPDATE detailData SET (itemType,number,title,activityLength) VALUES(?,?,?,?,?) ，WHERE id=${id}`,[obj.itemType,obj.number,obj.title,obj.activityLength]);
            await query(
              `INSERT INTO detailData(articleId,itemType,number,title,activityLength) VALUES(?,?,?,?,?)`,
              [id, obj.itemType, obj.number, obj.title, obj.activityLength]
            );
          }
        }
      );

      res.send('success');// data 是一个数组 数值是 detailData 里面的数据
    }
  );
});
app.listen(3000);
//id 数组
