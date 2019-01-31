var router = require('express').Router();
var Promise = require("bluebird");
var getSqlConnection = require('../../mysql-db');



router.route('/bmq').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select avg(bmq) as bmq, DATE_FORMAT(date(TIME_ENTERED), "%Y-%m-%d") as date from bmq_history ' +
         'group by DATE_FORMAT(date(TIME_ENTERED), "%Y-%m-%d")  ' +
         'order by DATE_FORMAT(date(TIME_ENTERED), "%Y-%m-%d")  asc ').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });


  router.route('/bmq/avg').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select avg(bmq) as bmq, type from BMQ_HISTORY group by type ').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });

  router.route('/sleep').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select avg(total_minutes_asleep/60) as sleep_time, DATE_FORMAT(date(DIARY_DAY), "%Y-%m-%d") as date from SLEEP_HISTORY ' +
         'group by DATE_FORMAT(date(DIARY_DAY), "%Y-%m-%d") ' +
         'order by DATE_FORMAT(date(DIARY_DAY), "%Y-%m-%d")  asc ').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });


  router.route('/prediction/results').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select DATE_FORMAT(prediction_date, "%Y-%m-%d") as prediction_date, estimated_intensity_index, estimated_fatigue_index, predicted_bmq from BMQ_PREDICTIONS').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });

  router.route('/prediction/training').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select DATE_FORMAT(training_date, "%Y-%m-%d") as training_date, distance, estimated_intensity_index from TRAINING_PLAN').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });

  router.route('/prediction/parameters').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select DATE_FORMAT(last_updated, "%Y-%m-%d") as last_updated, sleep_hours, rest_hr from PREDICTION_PARAMETERS').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });

  router.route('/hr').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select DATE_FORMAT(DIARY_DAY, "%Y-%m-%d") as date, '+
         'rest_hr,  '+
         '((AVG_REST_HR*REST_MINUTES)/(TOTAL_MINUTES_RECORDED) + (AVG_FAT_BURN_HR*FAT_BURN_MINUTES)/(TOTAL_MINUTES_RECORDED) +  '+
         '(AVG_CARDIO_HR*CARDIO_MINUTES)/(TOTAL_MINUTES_RECORDED) + (AVG_PEAK_HR*PEAK_MINUTES)/(TOTAL_MINUTES_RECORDED)) as avg_hr  '+
         'from HEALTH_HISTORY '+
         'group by DIARY_DAY '+
         'order by DIARY_DAY asc ').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });

  router.route('/nutrition').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select DATE_FORMAT(DIARY_DAY, "%Y-%m-%d") as date, sum(TOTAL_CALORIES_IN) as total, (sum(carb)*4/sum(TOTAL_CALORIES_IN))*100, (sum(prot)*4/sum(TOTAL_CALORIES_IN))*100, (sum(fat)*9/sum(TOTAL_CALORIES_IN))*100 from NUTRITION_HISTORY '+
         'group by DATE_FORMAT(DIARY_DAY, "%Y-%m-%d") '+
         'order by DATE_FORMAT(DIARY_DAY, "%Y-%m-%d")  asc').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });


  router.route('/nutrition/avg').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select avg(TOTAL_CALORIES_IN) as total, (sum(carb)*4/sum(TOTAL_CALORIES_IN))*100 as carb, (sum(prot)*4/sum(TOTAL_CALORIES_IN))*100 as prot, (sum(fat)*9/sum(TOTAL_CALORIES_IN))*100 as fat from NUTRITION_HISTORY').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });
  router.route('/activities').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select sum(duration/60) as duration, sum(distance) as distance, sum(elevation_gain) as elevation_gain, sum(avg_hr) as hr, DATE_FORMAT(date(start_time), "%Y-%m-%d") as date from ACTIVITY_HISTORY ' +
         'group by DATE_FORMAT(date(start_time), "%Y-%m-%d") ' +
         'order by DATE_FORMAT(date(start_time), "%Y-%m-%d")  asc ').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });

  router.route('/generate/parameters').post((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('truncate table PREDICTION_PARAMETERS').then(function(rows) {
          console.log("Table PREDICTION_PARAMETERS truncated!");
        }).catch(function(error) {
          console.log(error);
        });
    })

    Promise.using(getSqlConnection(), function(connection) {
      connection.query('insert into PREDICTION_PARAMETERS (last_updated, sleep_hours, rest_hr) values ($1, $2, $3)', [req.body.last_updated, req.body.sleep_hours, req.body.rest_hr]).then(function(rows) {
       console.log("Table PREDICTION_PARAMETERS truncated!");
     }).catch(function(error) {
       console.log(error);
     });
 })
 
    
  });


  router.route('/generate/indexes').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('CALL CreateIndexes()').then(function(rows) {
            res.json("Index tables created!");
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });


  router.route('/intensity').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select * from intensity_index').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });

  router.route('/summary').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select bmq_index.date, bmq_index, fatigue_index, intensity_index from '+
         'bmq_index, fatigue_index, intensity_index '+
         'where bmq_index.date = fatigue_index.date '+
         'and date_sub(bmq_index.date, INTERVAL 1 DAY) = intensity_index.date').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });
module.exports = router;
