const AWS = require('aws-sdk');

class Dashboard {
  constructor(name, widgets, region) {
    this.name = name;
    this.widgets = widgets;
    this.region = region;
    this.cloudwatch = new AWS.CloudWatch({ region });
  }

  async createDashboard() {
    const dashboard = {
      start: '-PT6H',
      periodOverride: 'auto',
      widgets: this.widgets
    };

    const params = {
      DashboardBody: JSON.stringify(dashboard) /* required */,
      DashboardName: this.name /* required */
    };

    await this.cloudwatch.putDashboard(params).promise()
    .then(() => {
      console.log(
        `Successfully created dashboard ${params.DashboardName}.` +
          `Open it at https://${this.region}.console.aws.amazon.com/cloudwatch/home?region=${this.region}#dashboards:name=${params.DashboardName}`
      );
    })
    .catch(error => console.log(error));
  }

  removeDashboard() {
    const params = {
      DashboardNames: [ this.name ]
    }

    this.cloudwatch.deleteDashboards(params, function(err) {
      if(err) {
        console.log(err, err.stack);
      } else {
        console.log(`Sucessfully deleted dashboard ${params.DashboardNames[0]}`)
      }
    });
  }
}

module.exports = Dashboard;
