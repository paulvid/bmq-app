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

  router.route('/activities').get((req, res) => {

    Promise.using(getSqlConnection(), function(connection) {
         connection.query('select avg(duration/60) as duration, avg(distance) as distance, avg(elevation_gain) as elevation_gain, avg(avg_hr) as hr, DATE_FORMAT(date(start_time), "%Y-%m-%d") as date from ACTIVITY_HISTORY ' +
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
         connection.query('select ((((select sum(avg_pace) from ACTIVITY_HISTORY)/avg(avg_pace))*0.7) + ((sum(distance) / (select max(distance) from ACTIVITY_HISTORY))*0.3)) as difficulty_index, DATE_FORMAT(date(start_time), "%Y-%m-%d") as date from ACTIVITY_HISTORY ' +
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
         connection.query('select ((((select sum(avg_pace) from ACTIVITY_HISTORY)/avg(avg_pace))*0.7) + ((sum(distance) / (select max(distance) from ACTIVITY_HISTORY))*0.3))  as difficulty_index, '+
         '(avg(bmq) / (select max(bmq) from BMQ_HISTORY))*100 as bmq_index, '+
         '(avg(TOTAL_MINUTES_ASLEEP) / (select max(TOTAL_MINUTES_ASLEEP) from SLEEP_HISTORY))*100 as sleep_index, '+
         'DATE_FORMAT(date(start_time), "%Y-%m-%d") as date  '+
         'from ACTIVITY_HISTORY, SLEEP_HISTORY, BMQ_HISTORY '+
         'where DATE_FORMAT(date(start_time), "%Y-%m-%d") = DATE_FORMAT(date(diary_day), "%Y-%m-%d") '+
         'and DATE_FORMAT(date(start_time), "%Y-%m-%d") = DATE_FORMAT(date(time_entered), "%Y-%m-%d")  '+
         'group by DATE_FORMAT(date(start_time), "%Y-%m-%d")  '+
         'order by DATE_FORMAT(date(start_time), "%Y-%m-%d") asc ').then(function(rows) {
            res.json(rows);
        }).catch(function(error) {
          console.log(error);
        });
    })
    
  });
module.exports = router;
