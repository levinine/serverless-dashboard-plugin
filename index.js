const Dashboard = require('./Dashboard');
const ApiGateway = require('./ApiGateway');
const Widget = require('./Widget');

class DashboardPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.service = serverless.service;
    this.functions = this.service.functions;
    this.region = serverless.service.provider.region;
    this.functions = this.service.functions;
    this.widgetProps = this.service.custom.dashboard || null;
    
    this.hooks = {
      'after:deploy:finalize': () =>
        this.main(
          this.functions,
          this.region,
          this.service.provider.stage,
          this.service.service,
          this.widgetProps
        )
    };
  }

  checkForAPI(functions) {
    const values = Object.values(functions);
    let foundAPI = false;
    
    values.map(value => {
      value.events.map(event => {
        if(event.http != 'undefined') {
          foundAPI = true;
        }
      })
    });
    
    return foundAPI;
  }

  async getWidgets(functions, apiName, region, widgetProps) {
    const widget = new Widget(widgetProps);
    const apiGateway = new ApiGateway(apiName, region);
    let widgets = [];

    const functionNames = this.getFunctionNames(functions);
    for (const f of functionNames) {
      widgets.push(widget.createWidget(f));
    } 

    if(this.checkForAPI(functions)) {
      if (await apiGateway.getApi()) {
        widgets.push(widget.createApiWidget(apiName));
      } else {
        console.log('ApiGateway not found');
      } 
    }

    return widgets;
  }

  getFunctionNames(functions) {
    let functionNames = [];
    for (let f in functions) {
      functionNames.push(functions[f].name);
    }
    return functionNames;
  }

  main(functions, region, stage, appName, widgetProps) {
    const apiName = `${stage}-${appName}`;

    this.getWidgets(functions, apiName, region, widgetProps).then(
      widgets => {
        const dashboard = new Dashboard(appName, widgets, region);
        dashboard.createDashboard();
      }
    );
  }
}

module.exports = DashboardPlugin;
