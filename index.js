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

  async getWidgets(functionNames, apiName, region, widgetProps) {
    const widget = new Widget(widgetProps);
    const apiGateway = new ApiGateway(apiName, region);
    let widgets = [];

    for (const f of functionNames) widgets.push(widget.createWidget(f));

    if (await apiGateway.getApi())
      widgets.push(widget.createApiWidget(apiName));
    else console.log('ApiGateway not found');

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
    const functionNames = this.getFunctionNames(functions);
    const apiName = `${stage}-${appName}`;

    this.getWidgets(functionNames, apiName, region, widgetProps).then(
      widgets => {
        const dashboard = new Dashboard(appName, widgets, region);
        dashboard.createDashboard();
      }
    );
  }
}

module.exports = DashboardPlugin;
