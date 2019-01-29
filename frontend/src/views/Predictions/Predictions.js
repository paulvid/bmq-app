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

class Predictions extends Component {
    constructor(props) {
        super(props);

        this.state = {
          loading: true,
          predictionChart: {},
          trainingChart: {},
          last_updated: '',
          sleep_hours: '',
          rest_hr: ''

        };
      }
      stopNifi = async e  => {
        this.setState({stopping: !this.state.stopping});
       // var callNifiStop= await fetch('http://localhost:4000/api/nifi/stop')
       // var nifiStop = await callNifiStop.json()


        this.setState({stopping: !this.state.stopping,
            stopped: !this.state.stopped,
            started: !this.state.started
                            });
      }

      startNifi = async e  => {
        this.setState({starting: !this.state.starting});
       // var callNifiStop= await fetch('http://localhost:4000/api/nifi/start')
       // var nifiStop = await callNifiStop.json()


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

        var callSummary= await fetch('http://localhost:4000/api/statistics/prediction/results')
        var summaryHist = await callSummary.json()
  
        // Creating Label and Data arrays
        var retrievedLabels = [];
        var retrievedBMQ = [];
        var retrievedDifficulty = [];
        var retrievedSleep = [];
        for(var key in summaryHist) {
          retrievedLabels.push(summaryHist[key].prediction_date); 
          retrievedBMQ.push(summaryHist[key].predicted_bmq); 
          retrievedDifficulty.push(summaryHist[key].estimated_difficulty_index); 
          retrievedSleep.push(summaryHist[key].estimated_fatigue_index); 
        }
        
       
          this.setState({predictionChart :{
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
                    label: 'Fatigue Index',
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
            var callActivities = await fetch('http://localhost:4000/api/statistics/prediction/training')
            var activityHist = await callActivities.json()
      
            // Creating Label and Data arrays
            var retrievedLabels = [];
            var retrievedDistance = [];
            for(var key in activityHist) {
              retrievedLabels.push(activityHist[key].training_date); 
              retrievedDistance.push(activityHist[key].distance); 
            }
            
      
              this.setState({trainingChart :{
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
                    }
                  ],
                }})


            var paramCall= await fetch('http://localhost:4000/api/statistics/prediction/parameters')
            var paramResp = await paramCall.json()

            this.setState({last_updated: paramResp[0].last_updated,
                            sleep_hours: paramResp[0].sleep_hours,
                           rest_hr: paramResp[0].rest_hr,
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
          <h1>BMQ Predictions</h1>
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
              <Button size="lg" color="primary" onClick={this.startNifi.bind(this)} target="_blank">
                <i className='fa fa-heartbeat'></i>&nbsp;Launch Model
                              </Button>
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
                <h4>{'Predicted BMQ based on Fatigue and Difficulty Indexes (Last Updated: '+this.state.last_updated+', Sleep Hours: '+this.state.sleep_hours+', Rest HR: '+this.state.rest_hr+')'}</h4>
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Bar data={this.state.predictionChart} options={options} height='300px'  />
                </div>
              </CardBody>
            </Card>
            </Col>
            </Row>
            <Row>

            
            <Col>
            <Card className="card-accent-danger">
            <CardHeader className="bg-white">
                <h4>Activity Distance (Training Plan)</h4>
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Line data={this.state.trainingChart} options={options} height='300px'  />
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

export default Predictions;
