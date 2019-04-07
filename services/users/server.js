const Koa = require('koa');
const got = require('got');
const app = new Koa();

const members = [
  {
    name: 'Ignasi Barrera',
    initial: 'I',
    title: 'Engineer',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Ignasi_Barrera2.jpg'
  },
  {
    name: 'Zack Butcher',
    initial: 'Z',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/02/Zack_Butcher.png'
  },
  {
    name: 'Hongtao Gao',
    initial: 'H',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Hongtao-1-e1551500623352.jpg'
  },
  {
    name: 'Devarajan Ramaswamy',
    initial: 'D',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Screenshot-2019-03-02-at-06.51.56-e1551538502713.png'
  },
  {
    name: 'Lizan Zhou',
    initial: 'L',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/lizan-e1551501164830.jpg'
  }
];

function getQuote(initial) {
  return got(process.env.QUOTE_SERVICE + '/' + initial);
}

app.use(async ctx => {
  const promises = members.map(member => {
    return getQuote(member.initial);
  });

  const responses = await Promise.all(promises);
  ctx.body = responses.map(({ body }) => JSON.parse(body));
});

app.listen(process.env.PORT || 3000);
