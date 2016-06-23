'use strict';

require('./env');
const restify = require('restify');
const fs = require('fs');
const uuid = require('uuid');
const mustache = require('mustache');
const pdc = require('pdc');
const Trello = require('node-trello');

function getDataFromTrello(boardID) {
  const trello = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_API_TOK);
  const data = { };

  return new Promise(mainResolve => {
    trello.get(`/1/boards/${boardID}/lists`, function(err, lists) {
      const promises = [ ];
      lists.forEach(l => {
        const listName = l.name.toLowerCase().replace(' ', '_');
        data[listName] = { };
        promises.push(new Promise(resolve => {
          trello.get(`/1/lists/${l.id}/cards?fields=name,desc`, (e, cards) => {
            cards.forEach(card => {
              const cardName = card.name.toLowerCase().replace(' ', '_')
              if(data[listName][cardName] && !Array.isArray(data[listName][cardName])) {
                data[listName][cardName] = [ data[listName][cardName] ];
              }

              if(Array.isArray(data[listName][cardName])) {
                data[listName][cardName].push(card.desc);
              } else {
                data[listName][cardName] = card.desc;
              }
            });
            resolve();
          });
        }));
      });

      Promise.all(promises)
        .then(() => {
          data.format = {
            uc: () => (str, render) => render(str).toUpperCase(),
            lc: () => (str, render) => render(str).toLowerCase()
          }
          mainResolve(data);
        });
    });
  });
};

const server = restify.createServer({ name: 'Template Demo' });

server.get('/build', (req, res, next) => {
  getDataFromTrello('sgPeUjGo')
    .then(data => {
      //const template = fs.readFileSync('./templates/agile_bpa_rfp_and_pws.md', { 'encoding': 'utf-8' });
      const template = fs.readFileSync('./templates/test.md', { 'encoding': 'utf-8' });
      const markdown = mustache.render(template, data);
      const filename = `${uuid.v4()}.docx`;
      pdc(markdown, 'markdown', 'docx', [ '-o', filename ], (err, out) => {
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-disposition', 'attachment; filename=rfp.docx');
        res.send(fs.readFileSync(filename));
        fs.unlink(filename);
      });
    })
    .catch(e => console.log(`ERROR: ${e}`));
  next();
});

server.get('/', restify.serveStatic({
  directory: './static-web',
  default: 'index.html'
}));

server.listen(process.env.PORT, () => {
  console.log(`${server.name} listening at ${server.url}`);
});
