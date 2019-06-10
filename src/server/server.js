import express from 'express';
import apiRender from './render';

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  if(req.params.id){
    apiRender(req.params.id)
    .then( ({ initialMarkup, initialData}) =>{
      res.send(`
        <!DOCTYPE html>
        <head>
          <title>Universal Reacl</title>
          <link rel='stylesheet' href='/css/main.css'>
          <script src='/bundle.js' defer></script>
        </head>
        <body>
          <div id='root'>${initialMarkup}</div>
          <script type="text/javascript">
            window.initialData = JSON.stringify(${initialData});
          </script>
        </body>
      </html>
      `);
    })
    .catch(error => {
      console.error(error);
      res.status(404).send('Bad Request');
    });
  }else{
    apiRender(req)
    .then( ({ initialMarkup, initialData}) =>{
      res.send(`
        <!DOCTYPE html>
        <head>
          <title>Universal Reacl</title>
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
  }

});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening');
});