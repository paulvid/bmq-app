var router = require('express').Router();
var Promise = require("bluebird");
var getDb = require('../../pg-db').getDb;
var db = getDb();

var getSqlConnection = require('../../mysql-db');

router.route('/run/note').post((req2, res) => {

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

    var request = require("request");
      request.post({
        url: 'http://'+req2.body.zp_url+':9995/api/login',
        form: { userName: 'admin', password: 'Be@stM0de' }
    }, function(error, response, body){

        var array = response.rawHeaders[23].split(";")[0]
        
        request.post({
            url:'http://'+req2.body.zp_url+':9995/api/notebook/job/'+req2.body.noteid+';'+array
             },function(error, response, body){

            res.json(body);
        });
    });
    

    
});

router.route('/get/noteid').post((req2, res) => {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

    var request = require("request");
      request.post({
        url: 'http://'+req2.body.zp_url+':9995/api/login',
        form: { userName: 'admin', password: 'Be@stM0de' }
    }, function(error, response, body){

        var array = response.rawHeaders[23].split(";")[0]
        
        request.get({
            url:'http://'+req2.body.zp_url+':9995/api/notebook;'+array
             },function(error, response, body){
            // The full html of the authenticated page
            var jsonBody = JSON.parse(body);
            var noteid = '';
            for(var key in jsonBody.body) {
                if(jsonBody.body[key].name.toString() === "BMQ Prediction"){
                    noteid = jsonBody.body[key].id;
                } 

            }
   


            res.json(noteid);
        });
    });



    

    
});

router.route('/results/download').post((req2, res) => {
    Promise.using(getSqlConnection(), function(connection) {
        connection.query('truncate table PREDICTION_PARAMETERS').then(function(rows) {
            
       }).catch(function(error) {
         console.log(error);
       });
    })
    
    Promise.using(getSqlConnection(), function(connection) {
        connection.query('truncate table BMQ_PREDICTIONS').then(function(rows) {
           //
       }).catch(function(error) {
         console.log(error);
       });
    })


    var mysql = require('promise-mysql');
 
        var pool = mysql.createPool({
        host: req2.body.zp_url,
        user: 'bmq_user',
        port: '3306',
        password: 'Be@stM0de',
        database: 'beast_mode_db',
        connectionLimit: 10
        });
 
function getSqlConnectionRemote() {
  return pool.getConnection().disposer(function(connection) {
    pool.releaseConnection(connection);
  });
}



var arrayScript = [];
Promise.using(getSqlConnectionRemote(), function(connection) {
    connection.query('select DATE_FORMAT( date , \'%Y-%m-%d\')  AS date,  estimated_intensity_index, estimated_fatigue_index, predicted_bmq from BMQ_PREDICTIONS').then(function(rows) {

        for(var key in rows) {
            arrayScript.push('insert into BMQ_PREDICTIONS (prediction_date, estimated_intensity_index, estimated_fatigue_index, predicted_bmq) values (\''+rows[key].date+'\', '+rows[key].estimated_intensity_index+', '+rows[key].estimated_fatigue_index+', '+rows[key].predicted_bmq+')');

        }
       


        Promise.using(getSqlConnection(), function(connection) {
            for(var i in arrayScript) {
                
                connection.query(arrayScript[i]).then(function(rows) {
                
                }).catch(function(error) {
                  console.log(error);
                });
            }

            
       })


 


   }).catch(function(error) {
     console.log(error);
   });
})

var scriptParams = '';
Promise.using(getSqlConnectionRemote(), function(connection) {
    connection.query('select DATE_FORMAT( last_updated , \'%Y-%m-%d\')  AS last_updated,  sleep_hours, rest_hr from PREDICTION_PARAMETERS').then(function(rows) {

        for(var key in rows) {
            scriptParams = 'insert into PREDICTION_PARAMETERS (last_updated, sleep_hours, rest_hr) values (\''+rows[key].last_updated+'\', '+rows[key].sleep_hours+', '+rows[key].rest_hr+')';

        }
       


        Promise.using(getSqlConnection(), function(connection) {


                connection.query(scriptParams).then(function(rows) {
                
                }).catch(function(error) {
                  console.log(error);
                });
            

            
       })


 


   }).catch(function(error) {
     console.log(error);
   });
})

res.json("HORRAY")

});


router.route('/parameters/delete').post((req2, res) => {

    var mysql = require('promise-mysql');
 
        var pool = mysql.createPool({
        host: req2.body.zp_url,
        user: 'bmq_user',
        port: '3306',
        password: 'Be@stM0de',
        database: 'beast_mode_db',
        connectionLimit: 10
        });
 
function getSqlConnection() {
  return pool.getConnection().disposer(function(connection) {
    pool.releaseConnection(connection);
  });
}

Promise.using(getSqlConnection(), function(connection) {
    connection.query('truncate table PREDICTION_PARAMETERS').then(function(rows) {
        res.json("table PREDICTION_PARAMETERS truncated")
   }).catch(function(error) {
     console.log(error);
   });
})
    
});


router.route('/parameters/update').post((req2, res) => {

    var mysql = require('promise-mysql');
 
        var pool = mysql.createPool({
        host: req2.body.zp_url,
        user: 'bmq_user',
        port: '3306',
        password: 'Be@stM0de',
        database: 'beast_mode_db',
        connectionLimit: 10
        });
 
function getSqlConnection() {
  return pool.getConnection().disposer(function(connection) {
    pool.releaseConnection(connection);
  });
}



Promise.using(getSqlConnection(), function(connection) {
    connection.query('insert into PREDICTION_PARAMETERS (last_updated, sleep_hours, rest_hr) values (date(now()), '+req2.body.sleep_hours+', '+req2.body.rest_hr+')').then(function(rows) {
        res.json("table PREDICTION_PARAMETERS updated")
   }).catch(function(error) {
     console.log(error);
   });
})
    
});



module.exports = router;
