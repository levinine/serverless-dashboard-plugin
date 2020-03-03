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
    this.customSettings = this.service.custom.serverlessDashboard || {};
    
    if(!this.customSettings.lambda) {
      this.customSettings.lambda = { enabled: true}
    } 
    
    if(!this.customSettings.apiGateway) {
      this.customSettings.apiGateway = { enabled: true}
    }
    
    
    this.hooks = {
      'after:deploy:finalize': () =>
        this.main(
          this.functions,
          this.region,
          this.service.provider.stage,
          this.service.service,
          this.customSettings,
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

  async getWidgets(functions, apiName, region, customSettings) {
    const widget = new Widget(region);
    const apiGateway = new ApiGateway(apiName, region);
    let widgets = [];

    if(customSettings.lambda.enabled === true) {
      const functionNames = this.getFunctionNames(functions);
      for (const f of functionNames) {
        widgets.push(widget.createWidget(f));
      }  
    }``
     
    if(customSettings.apiGateway.enabled === true) {
      if(this.checkForAPI(functions)) {
        if (await apiGateway.getApi()) {
          widgets.push(widget.createApiWidget(apiName));
        } else {
          console.log('ApiGateway not found');
        } 
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

  main(functions, region, stage, appName, customSettings) {
    const apiName = `${stage}-${appName}`;

    this.getWidgets(functions, apiName, region, customSettings).then(
      widgets => {
        const dashboard = new Dashboard(appName, widgets, region);
        dashboard.createDashboard();
      }
    );
  }
}

module.exports = DashboardPlugin;
