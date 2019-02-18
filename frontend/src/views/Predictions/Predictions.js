import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { Card, CardBody, CardColumns, Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  CardHeader, Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
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
          rest_hr: '',
          ori_rest_hr: '',
          ori_sleep_hours: '',
          verify: false,
          clusterFound: false,
          clusterNotFound: false,
          trainingModel: false,
          runningNote: false,
          downloadingData: false,
          modelTrained: false,
          inputParam: false,
          zp_url: ''

        };
      }

      handleSleepChange = (e) => {
        this.setState({ sleep_hours: e.target.value });
      }

      handleHRChange = (e) => {
        this.setState({ rest_hr: e.target.value });
      }


      trainModel = async e => {
        this.setState({clusterFound: false,
          trainingModel: true,
          runningNote: true})
        

          // First, we get the Zeppelin Address
          const initWhovilleProfile = await fetch('http://localhost:4000/api/cloudbreak/profile')
    const whovilleProfile = await initWhovilleProfile.json()
    
    var initCBToken = await fetch('http://localhost:4000/api/dashboard/gettoken', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: whovilleProfile[0].default_email.toString(),
        password: whovilleProfile[0].default_password.toString(),
        cb_url: whovilleProfile[0].cb_url.toString()
      })
    })
    var CBToken = await initCBToken.json()
    this.setState({cbToken: CBToken,
                  cbUrl: whovilleProfile[0].cb_url.toString()})
    var initClusterData = await fetch('http://localhost:4000/api/dashboard/getclusters', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: CBToken,
        cb_url: whovilleProfile[0].cb_url.toString()
      })
    })
    var fetchedClusterData = await initClusterData.json()

    this.setState({ zp_url: fetchedClusterData[1].cluster.ambariServerIp});

    // Then, we update the model paramters
    var callDelParam = await fetch('http://localhost:4000/api/zeppelin/parameters/delete', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    zp_url: this.state.zp_url
  })
})
var delParamResp =  await callDelParam.json()

var callUpdParam = await fetch('http://localhost:4000/api/zeppelin/parameters/update', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    zp_url: this.state.zp_url,
    rest_hr: this.state.rest_hr,
    sleep_hours: this.state.sleep_hours
  })
})
var updParamResp =  await callUpdParam.json()

 //Then, we get the note ID
 var callZepNotebook = await fetch('http://localhost:4000/api/zeppelin/get/noteid', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    zp_url: this.state.zp_url
  })
})
var zepNoteid =  await callZepNotebook.json()

          // Then we run the note
          var callZepRunNote = await fetch('http://localhost:4000/api/zeppelin/run/note', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              zp_url: this.state.zp_url,
              noteid: zepNoteid
            })
          })
          var noteResp =  await callZepRunNote.json()

          this.setState({runningNote: false,
            downloadingData: true})
 // Finally, we download the data back to our permanent cluster
 var callDataDownload = await fetch('http://localhost:4000/api/zeppelin/results/download', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    zp_url: this.state.zp_url
  })
})
var downResp =  await callDataDownload.json()


            this.setState({downloadingData: false,
              modelTrained: true})

            
      }

     

      verifyCluster = async e => {
        this.setState({verify: !this.state.verify})
        const initWhovilleProfile = await fetch('http://localhost:4000/api/cloudbreak/profile')
          const whovilleProfile = await initWhovilleProfile.json()
          
          var initCBToken = await fetch('http://localhost:4000/api/dashboard/gettoken', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: whovilleProfile[0].default_email.toString(),
              password: whovilleProfile[0].default_password.toString(),
              cb_url: whovilleProfile[0].cb_url.toString()
            })
          })
          var CBToken = await initCBToken.json()
          this.setState({cbToken: CBToken,
                        cbUrl: whovilleProfile[0].cb_url.toString()})
          var initClusterData = await fetch('http://localhost:4000/api/dashboard/getclusters', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: CBToken,
              cb_url: whovilleProfile[0].cb_url.toString()
            })
          })
          var fetchedClusterData = await initClusterData.json()
          if(fetchedClusterData[0]){
            this.setState({verify: !this.state.verify,
                          clusterFound: !this.state.clusterFound})
          } else {
            this.setState({verify: !this.state.verify,
              clusterNotFound: !this.state.clusterNotFound})
          }
          
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
        var retrievedIntensity = [];
        var retrievedSleep = [];
        for(var key in summaryHist) {
          retrievedLabels.push(summaryHist[key].prediction_date); 
          retrievedBMQ.push(summaryHist[key].predicted_bmq); 
          retrievedIntensity.push(summaryHist[key].estimated_intensity_index); 
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
                    label: 'Intensity Index',
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
                    data: retrievedIntensity,
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
                           ori_rest_hr: paramResp[0].rest_hr,
                           ori_sleep_hours: paramResp[0].sleep_hours,
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
      <Modal isOpen={this.state.verify} 
                       className={'modal-secondary ' + this.props.className}>
                  <ModalHeader>Verifying Cluster</ModalHeader>
                  <ModalBody>
                  <h3>Verifying ephemeral cluster availability... <i className='fa fa-spinner fa-spin'></i></h3>
                  </ModalBody>
                 
                </Modal>
                <Modal isOpen={this.state.clusterNotFound} toggle={() => { this.setState({ clusterNotFound: !this.state.clusterNotFound }); }}
                       className={'modal-danger ' + this.props.className}>
                  <ModalHeader toggle={() => { this.setState({ clusterNotFound: !this.state.clusterNotFound}); }}>Cluster Not Found</ModalHeader>
                  <ModalBody>
                  <h3>No cluster found to execute model training!</h3>
                  </ModalBody>
                  <ModalFooter>
                  <Button color='secondary' onClick={() => { this.setState({ clusterNotFound: !this.state.clusterNotFound}); }}><i className="icon-ban"></i>&nbsp; Cancel</Button>
                  <Button color='danger' href="#/library/2">Deploy Bundle <i className="fa fa-long-arrow-right"></i></Button>
                   </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.clusterFound} toggle={() => { this.setState({ clusterFound: !this.state.clusterFound }); }}
                       className={'modal-primary ' + this.props.className}>
                  <ModalHeader toggle={() => { this.setState({ clusterFound: !this.state.clusterFound}); }}>Parameters</ModalHeader>
                  <ModalBody>
                  <h3>Specify Model Parameters</h3>
                  &nbsp;
                  <Form>

                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>Sleep Hours</InputGroupText>
                          </InputGroupAddon>
                          <Input type="select" name="sleep" id="sleep" onChange={this.handleSleepChange.bind(this)}>
                          <option selected={this.state.sleep_hours.toString() === '6'}>6</option>
                          <option selected={this.state.sleep_hours.toString() === '7'}>7</option>
                            <option selected={this.state.sleep_hours.toString() === '8'}>8</option>
                            <option selected={this.state.sleep_hours.toString() === '9'}>9</option>
                            <option selected={this.state.sleep_hours.toString() === '10'}>10</option>
                          </Input>
                        </InputGroup>
                        &nbsp;
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>Rest HR</InputGroupText>
                          </InputGroupAddon>
                          <Input type="select" name="hr" id="hr" onChange={this.handleHRChange.bind(this)}>
                          <option selected={this.state.rest_hr.toString() === '45'}>45</option>
                          <option selected={this.state.rest_hr.toString() === '47'}>47</option>
                            <option selected={this.state.rest_hr.toString() === '50'}>50</option>
                            <option selected={this.state.rest_hr.toString() === '52'}>52</option>
                            <option selected={this.state.rest_hr.toString() === '55'}>55</option>
                          </Input>
                        </InputGroup>
  
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                  <Button color='secondary' onClick={() => { this.setState({ clusterFound: !this.state.clusterFound}); }}><i className="icon-ban"></i>&nbsp; Cancel</Button>
                  <Button color='primary' onClick={this.trainModel.bind(this)}>Refresh Model <i className="fa fa-long-arrow-right"></i></Button>
                   </ModalFooter>
                </Modal>




                <Modal isOpen={this.state.trainingModel} 
                       className={'modal-'+ (this.state.modelTrained ? 'primary ' : 'secondary ') + this.props.className}>
                  <ModalHeader>Refreshing Model</ModalHeader>
                  <ModalBody>
                  <h3>Running Zeppelin Note ... <i className={this.state.runningNote ? 'fa fa-spinner fa-spin' : 'fa fa-check'}></i> </h3>
                  {(this.state.downloadingData || this.state.modelTrained) ? <h3>Downloading Data ... <i className={this.state.downloadingData ? 'fa fa-spinner fa-spin' : 'fa fa-check'}></i> </h3> : ''}
                  </ModalBody>
                  <ModalFooter>
                  <Button color={this.state.modelTrained ? 'primary' : 'secondary'} disabled={!this.state.modelTrained} onClick={this.refreshPage.bind(this)}>See Predictions <i className="fa fa-long-arrow-right"></i></Button>
                   </ModalFooter>
                </Modal>

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
              <Button size="lg" color="primary" onClick={this.verifyCluster.bind(this)}>
                <i className='fa fa-heartbeat'></i>&nbsp;Refresh Model
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
                <h4>{'Predicted BMQ based on Fatigue and Intensity Indexes (Last Updated: '+this.state.last_updated+', Sleep Hours: '+this.state.ori_sleep_hours+', Rest HR: '+this.state.ori_rest_hr+')'}</h4>
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
                <h4>Training Plan</h4>
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
