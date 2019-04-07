const Koa = require('koa');
const app = new Koa();

const members = [
  {
    name: 'Ignasi Barrera',
    initial: 'I',
    title: 'Engineer',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Ignasi_Barrera2.jpg',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Zack Butcher',
    initial: 'Z',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/02/Zack_Butcher.png',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Hongtao Gao',
    initial: 'H',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Hongtao-1-e1551500623352.jpg',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Devarajan Ramaswamy',
    initial: 'D',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Screenshot-2019-03-02-at-06.51.56-e1551538502713.png',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Lizan Zhou',
    initial: 'L',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/lizan-e1551501164830.jpg',
    quote: "I really want a boat, that's my reason to join Tetrate."
  }
];

app.use(ctx => {
  const parts = ctx.path.split('/');
  for (let member of members) {
    if (member.initial === parts[parts.length - 1]) {
      ctx.body = member;
      return
    }
  }
  ctx.body = {
    name: 'Lizan Zhou',
    initial: 'L',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/lizan-e1551501164830.jpg'
  };
});

app.listen(process.env.PORT || 3001);
