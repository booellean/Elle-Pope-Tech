import express from 'express';
import preRender from '../api/render';
import config from '../api/config';

const app = express();

app.get('*', (req, res) => {
  preRender(req)
  .then( ({ initialMarkup, initialData}) =>{
    res.send(`
      <!DOCTYPE html>
      <head>
        <title>Elle Pope Tech</title>
        <link rel='stylesheet' href='/css/main.css'>
        <script src='/bundle.js' defer></script>
      </head>
      <body>
        <div id='root'>${initialMarkup}</div>
        <script type="text/javascript">
          window.initialData = ${initialData};
        </script>
      </body>
    </html>
    `);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

app.use('../api', apiRouter);
app.use(express.static('public'));

app.listen(config.port, config.host, () => {
  console.log(`Server is listening on ${config.host}:${config.port}`);
});