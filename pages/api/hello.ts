// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const hello = (_, res) => {
  res.statusCode = 200;
  res.json({name: 'John Doe'});
};

export default hello;
