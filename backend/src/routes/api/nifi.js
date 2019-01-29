var router = require('express').Router();

router.route('/stop').get((req, res) => {

    var request = require("request");

    var options = { method: 'PUT',
      url: 'http://docker.for.mac.localhost:9090/nifi-api/flow/process-groups/cf46a59c-0166-1000-b231-d79f453f63c7',
      headers: 
       { 'cache-control': 'no-cache',
         'Content-Type': 'application/json' },
      body: { id: 'cf46a59c-0166-1000-b231-d79f453f63c7', state: 'STOPPED' },
      json: true };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.json(body);
    });



});


router.route('/start').get((req, res) => {

    var request = require("request");

    var options = { method: 'PUT',
      url: 'http://docker.for.mac.localhost:9090/nifi-api/flow/process-groups/cf46a59c-0166-1000-b231-d79f453f63c7',
      headers: 
       { 'cache-control': 'no-cache',
         'Content-Type': 'application/json' },
      body: { id: 'cf46a59c-0166-1000-b231-d79f453f63c7', state: 'RUNNING' },
      json: true };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.json(body);
    });



});



router.route('/status').get((req, res) => {

    var request = require("request");

    var options = { method: 'GET',
      url: 'http://docker.for.mac.localhost:9090/nifi-api/flow/status',
      headers: 
       { 'cache-control': 'no-cache',
         'Content-Type': 'application/json' }};
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.json(JSON.parse(body));
    });



});

module.exports = router;
