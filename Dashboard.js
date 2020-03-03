const AWS = require('aws-sdk');

class Dashboard {
  constructor(name, widgets, region) {
    this.name = name;
    this.widgets = widgets;
    this.cloudwatch = new AWS.CloudWatch({ region: region });
  }
  
  createDashboard() {
    const dashboard = {
      start: '-PT6H',
      periodOverride: 'auto',
      widgets: this.widgets
    };

    const params = {
      DashboardBody: JSON.stringify(dashboard) /* required */,
      DashboardName: this.name /* required */
    };

    
    this.cloudwatch.putDashboard(params, function(err) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(`Sucessfully created dashboard ${params.DashboardName}`); 
      } 
    });
  }
}

module.exports = Dashboard;
