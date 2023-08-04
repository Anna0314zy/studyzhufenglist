let express = require('express');
let request = require('request');
let bodyParser = require('body-parser');
let app = express();
var fs = require('fs');
const query = require('./db.js');
const cheerio = require('cheerio');
const Cookie =
  '_gid=GA1.2.450067700.1690956954; online-uuid=AF267BFE-C328-80C9-E7F7-977470EA6766; _gat_gtag_UA_140025935_1=1; PHPSESSID=0ks9o6sj9naum1hkvj0lf4b456; REMEMBERME=Qml6XFVzZXJcQ3VycmVudFVzZXI6ZFhObGNsOXNOWGN6ZUhFNGVHOUFaV1IxYzI5b2J5NXVaWFE9OjE3MjI2OTM3ODM6M2FhNDFkMzMwYzc1ZjUwZTVlNTE4NjQzNzZhNWMyNDYxZjY2MDE2NzY3YjI4MmFmNzJmN2Y3MjFhZTAyNmY4OQ%3D%3D;';
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
const setData = async (id) => {
  const head = await query(`SELECT title FROM detail WHERE articleId = ? `, [id]);
  const data = await query(`SELECT * FROM detailData WHERE articleId = ? `, [id]);
  const summary = await query(`SELECT summary FROM detailData WHERE articleId = ? `, [id]);
  console.log(head, 'head');
  return { head: head[0]?.title, data, summary: summary[0]?.summary };
};
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
      const $ = cheerio.load(response.body);
      const title = $('.breadcrumb li').last().text();
      const head = await query(`SELECT title FROM detail WHERE articleId = ? `, [id]);
      const detailData = await query(`SELECT * FROM detailData WHERE articleId = ? `, [id]);
      const summary = await query(`SELECT summary FROM detailData WHERE articleId = ? `, [id]);
      if (head?.length && detailData?.length && summary?.length) {
        const res1 = await setData(id);
        res.send(res1);
        return;
      }
      await query(`INSERT INTO detail(articleId,html,title) VALUES(?,?,?)`, [
        id,
        response.body,
        title,
      ]);
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
          const data = JSON.parse($('.js-hidden-cached-data').text());

          for (let i = 0; i <= data.length; i++) {
            // console.log(data[i], 'data[i]');
            const obj = data[i];
            // UPDATE Person SET Address = 'Zhongshan 23', City = 'Nanjing'，WHERE LastName = 'Wilson'
            // await query(`UPDATE detailData SET (itemType,number,title,activityLength) VALUES(?,?,?,?,?) ，WHERE id=${id}`,[obj.itemType,obj.number,obj.title,obj.activityLength]);
            if (obj?.itemType) {
              await query(
                `INSERT INTO detailData(articleId,itemType,number,title,activityLength) VALUES(?,?,?,?,?)`,
                [id, obj.itemType, obj.number, obj.title, obj.activityLength]
              );
            }
          }

          const summaryUrl = `http://www.javascriptpeixun.cn/my/course/${id}/summary?type=summary`;
          console.log(summaryUrl, 'summaryUrl');
          await request(
            {
              url: summaryUrl,
              headers: {
                Cookie,
              },
            },
            async (err, response, body) => {
              let $ = cheerio.load(response.body);
              const html = $('.es-piece').html();
              await query(`UPDATE detailData SET summary=? WHERE articleId=?`, [html, id]);
              const res2 = await setData(id);
              res.send(res2);
            }
          );
         
        }
      );
    }
  );
});
app.listen(3001);
//id 数组
