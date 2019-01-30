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
         connection.query('select DATE_FORMAT(prediction_date, "%Y-%m-%d") as prediction_date, estimated_difficulty_index, estimated_fatigue_index, predicted_bmq from BMQ_PREDICTIONS').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });

  router.route('/prediction/training').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select DATE_FORMAT(training_date, "%Y-%m-%d") as training_date, distance, estimated_difficulty_index from TRAINING_PLAN').then(function(rows) {
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
  router.route('/difficulty').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select ( (((select sum(avg_pace) from ACTIVITY_HISTORY)/avg(avg_pace))*0.6) + ((sum(distance) / (select max(distance) from ACTIVITY_HISTORY))*0.3) + ((sum(elevation_gain) / (select max(elevation_gain) from ACTIVITY_HISTORY))*0.1) ) as difficulty_index, DATE_FORMAT(date(start_time), "%Y-%m-%d") as date from ACTIVITY_HISTORY ' +
         'group by DATE_FORMAT(date(start_time), "%Y-%m-%d") ' +
         'order by DATE_FORMAT(date(start_time), "%Y-%m-%d")  asc ').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });

  router.route('/summary').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select ( (((select sum(avg_pace) from ACTIVITY_HISTORY)/avg(avg_pace))*0.6) + ((sum(distance) / (select max(distance) from ACTIVITY_HISTORY))*0.3) + ((sum(elevation_gain) / (select max(elevation_gain) from ACTIVITY_HISTORY))*0.1) ) as difficulty_index, '+ 
         '(avg(bmq) / (select max(bmq) from BMQ_HISTORY))*100 as bmq_index, '+
         '((avg(TOTAL_MINUTES_ASLEEP) / (select max(TOTAL_MINUTES_ASLEEP) from SLEEP_HISTORY))*.4 + (avg(REST_HR) / (select max(REST_HR) from HEALTH_HISTORY))*0.4)*100   as fatigue_index,  '+
         'DATE_FORMAT(date(time_entered), "%Y-%m-%d") as date  '+
         'from ACTIVITY_HISTORY, SLEEP_HISTORY, BMQ_HISTORY, HEALTH_HISTORY '+
         'where date(time_entered) = DATE_SUB(date(START_TIME), INTERVAL 1 DAY) '+
         'and date(time_entered) = SLEEP_HISTORY.diary_day '+
         'and date(time_entered) = HEALTH_HISTORY.diary_day '+
         'group by DATE_FORMAT(date(time_entered), "%Y-%m-%d")  '+
         'order by DATE_FORMAT(date(time_entered), "%Y-%m-%d") asc ').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });
module.exports = router;
