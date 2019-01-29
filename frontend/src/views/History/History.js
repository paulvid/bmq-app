import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { Card, CardBody, CardColumns, CardHeader, Row, Col, Button } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  legend: {
    display: false
},
  maintainAspectRatio: false
}

class Charts extends Component {
    constructor(props) {
        super(props);

        this.state = {
          loading: true,
          bmqLineChart: {},
          sleepLineChart: {},
          activityBarChart: {},
          difficultyChart: {},
          summaryChart: {},
          starting: false,
          started: false,
          stopping: false,
          stopped: false

        };
      }
      stopNifi = async e  => {
        this.setState({stopping: !this.state.stopping});
        var callNifiStop= await fetch('http://localhost:4000/api/nifi/stop')
        var nifiStop = await callNifiStop.json()


        this.setState({stopping: !this.state.stopping,
            stopped: !this.state.stopped,
            started: !this.state.started
                            });
      }

      startNifi = async e  => {
        this.setState({starting: !this.state.starting});
        var callNifiStop= await fetch('http://localhost:4000/api/nifi/start')
        var nifiStop = await callNifiStop.json()


        this.setState({starting: !this.state.starting,
            stopped: !this.state.stopped,
            started: !this.state.started
                            });
      }
    async componentDidMount(){
    
        // Checking nifi status
        var callNifiStatus= await fetch('http://localhost:4000/api/nifi/status')
        var nifiStatus = await callNifiStatus.json()
        if(nifiStatus['controllerStatus'].activeThreadCount.toString() === '0'){
            
            this.setState({stopped: !this.state.stopped});
        } else {
            this.setState({started: !this.state.started});
        }


        // Loading BMQ AVG

        var callSummary= await fetch('http://localhost:4000/api/statistics/summary')
        var summaryHist = await callSummary.json()
  
        // Creating Label and Data arrays
        var retrievedLabels = [];
        var retrievedBMQ = [];
        var retrievedDifficulty = [];
        var retrievedSleep = [];
        for(var key in summaryHist) {
          retrievedLabels.push(summaryHist[key].date); 
          retrievedBMQ.push(summaryHist[key].bmq_index); 
          retrievedDifficulty.push(summaryHist[key].difficulty_index); 
          retrievedSleep.push(summaryHist[key].sleep_index); 
        }
        
       
          this.setState({summaryChart :{
              labels: retrievedLabels,
              datasets: [
                {
                  label: 'BMQ Index',
                  fill: true,
                  lineTension: 0.3,
                  backgroundColor: 'rgba(255,69,7, 1)',
                  borderColor: 'rgba(255,69,7, 1)',
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'rgba(255,69,7, 1)',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'rgba(255,69,7, 1)',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: retrievedBMQ,
                },
                {
                    label: 'Sleep Index',
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: 'rgba(255,193,7, 1)',
                    borderColor: 'rgba(255,193,7, 1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(255,193,7, 1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(255,193,7, 1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: retrievedSleep,
                  },
                  {
                    label: 'Difficulty Index',
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: 'rgba(255,131,7, 1)',
                    borderColor: 'rgba(255,131,7, 1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(255,131,7, 1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(255,131,7, 1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: retrievedDifficulty,
                  },
              ],
            }})
  
  


      var callBMQ = await fetch('http://localhost:4000/api/statistics/bmq')
      var bmqHist = await callBMQ.json()

      // Creating Label and Data arrays
      var retrievedLabels = [];
      var retrievedData = [];
      for(var key in bmqHist) {
        retrievedLabels.push(bmqHist[key].date); 
        retrievedData.push(bmqHist[key].bmq); 
      }
      

        this.setState({bmqLineChart :{
            labels: retrievedLabels,
            datasets: [
              {
                label: 'BMQ',
                fill: true,
                lineTension: 0.3,
                backgroundColor: 'rgba(77, 189, 116, 0.4)',
                borderColor: 'rgba(77, 189, 116, 1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(77, 189, 116, 1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(77, 189, 116, 1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: retrievedData,
              },
            ],
          }})





      var callSleep = await fetch('http://localhost:4000/api/statistics/sleep')
      var sleepHist = await callSleep.json()

      // Creating Label and Data arrays
      var retrievedLabels = [];
      var retrievedData = [];
      for(var key in sleepHist) {
        retrievedLabels.push(sleepHist[key].date); 
        retrievedData.push(sleepHist[key].sleep_time); 
      }
      

        this.setState({sleepLineChart :{
            labels: retrievedLabels,
            datasets: [
              {
                label: 'Sleep (Hours)',
                fill: true,
                lineTension: 0.3,
                backgroundColor: 'rgba(32, 168, 216,0.4)',
                borderColor: 'rgba(32, 168, 216,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(32, 168, 216,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(32, 168, 216,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: retrievedData,
              },
            ],
          }})
       

          var callActivities = await fetch('http://localhost:4000/api/statistics/activities')
          var activityHist = await callActivities.json()
    
          // Creating Label and Data arrays
          var retrievedLabels = [];
          var retrievedDistance = [];
          var retrievedDuration = [];
          var retrievedElevationGain = [];
          var retrievedHR = [];
          for(var key in activityHist) {
            retrievedLabels.push(activityHist[key].date); 
            retrievedDistance.push(activityHist[key].distance); 
            retrievedDuration.push(activityHist[key].duration); 
            retrievedElevationGain.push(activityHist[key].elevation_gain); 
            retrievedHR.push(activityHist[key].hr); 
          }
          
    
            this.setState({activityBarChart :{
                labels: retrievedLabels,
                datasets: [
                  {
                    label: 'Distance (Miles)',
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: 'rgba(248, 108, 107,0.4)',
                    borderColor: 'rgba(248, 108, 107,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(248, 108, 107,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(248, 108, 107,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: retrievedDistance,
                  },
                  {
                    label: 'Duration (Hours)',
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: 'rgba(248, 108, 107,0.4)',
                    borderColor: 'rgba(248, 108, 107,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(248, 108, 107,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(248, 108, 107,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: retrievedDuration,
                  },
                ],
              }})

              var callDifficulty = await fetch('http://localhost:4000/api/statistics/difficulty')
              var difficultyHist = await callDifficulty.json()
        
              // Creating Label and Data arrays
              var retrievedLabels = [];
              var retrievedDifficulty = [];
              for(var key in difficultyHist) {
                retrievedLabels.push(difficultyHist[key].date); 
                retrievedDifficulty.push(difficultyHist[key].difficulty_index); 
              }
              
        
                this.setState({difficultyChart :{
                    labels: retrievedLabels,
                    datasets: [
                      {
                        label: 'Difficulty Index',
                        fill: true,
                        lineTension: 0.3,
                        backgroundColor: 'rgba(248, 108, 107,1)',
                        borderColor: 'rgba(248, 108, 107,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(248, 108, 107,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(248, 108, 107,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: retrievedDifficulty,
                      },
                    ],
                  },
                  loading: false})
        
      }

      refreshPage() {
        window.location.reload();
      }


  render() {

    const isLoading = this.state.loading;

    return (
      <div className="animated fadeIn">
      <Row>
          <Col>
          <h1>Health & Activities Summary</h1>
          </Col>
          <Col>
          &nbsp;
          </Col>
          <Col align="right" >
            <div >
              <Button size="lg" color="warning" onClick={this.refreshPage.bind(this)}>
                <i className={isLoading ? 'fa fa-refresh fa-spin' : 'fa fa-refresh'}></i>&nbsp;Refresh
                              </Button>
              &nbsp;
              {this.state.started ?  (
              <Button size="lg" color="danger" onClick={this.stopNifi.bind(this)} target="_blank">
                <i className={this.state.starting ? 'fa fa-circle-o-notch fa-spin' : 'fa fa-stop'}></i>&nbsp;Stop Ingest
                              </Button>) : ''}  
            {this.state.stopped ?   (
              <Button size="lg" color="success" onClick={this.startNifi.bind(this)} target="_blank">
                <i className={this.state.stopping ? 'fa fa-circle-o-notch fa-spin' : 'fa fa-play'}></i>&nbsp;Start Ingest
                              </Button>) : ''} 
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
          <h1><i className={isLoading ? 'fa fa-spinner fa-spin' : ''}></i></h1>
          </Col>
        </Row>
        
        {isLoading ? '' : (<><Row>
            <Col>
            <Card className="card-accent-warning">
            <CardHeader className="bg-white">
                <h4>BMQ, Sleep, and Difficulty Indexes</h4>
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Bar data={this.state.summaryChart} options={options} height='300px'  />
                </div>
              </CardBody>
            </Card>
            </Col>
            </Row>
            <Row>
            <Col xs={2} md={6}>
            
          <Card className="card-accent-success">
          <CardHeader className="bg-white">
              <h4>Average BMQ per day</h4>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Line data={this.state.bmqLineChart} options={options} height='300px'  />
              </div>
            </CardBody>
          </Card>
          </Col>
          <Col xs={2} md={6}>
          <Card className="card-accent-primary">
          <CardHeader className="bg-white">
              <h4>Average sleep in hours</h4>
            </CardHeader>
          <CardBody>
            <div className="chart-wrapper">
              <Line data={this.state.sleepLineChart} options={options} height='300px' />
            </div>
          </CardBody>
        </Card>
      
        </Col>
        </Row>    
        <Row>
        <Col xs={2} md={6}>
            <Card className="card-accent-danger">
            <CardHeader className="bg-white">
                <h4>Daily Activity Summary</h4>
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Line data={this.state.activityBarChart} options={options} height='300px'  />
                </div>
              </CardBody>
            </Card>
            </Col>
            <Col xs={2} md={6}>
            <Card className="card-accent-danger">
            <CardHeader className="bg-white">
                <h4>Difficulty Index</h4>
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Bar data={this.state.difficultyChart} options={options} height='300px'  />
                </div>
              </CardBody>
            </Card>
            </Col>
        
      </Row>
      </>)}
        
      </div>
    );
  }
}

export default Charts;
