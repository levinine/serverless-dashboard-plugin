const Dashboard = require('./Dashboard');
const Widget = require('./Widget');

class DashboardPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.service = serverless.service;
    this.functions = this.service.functions;
    this.region = serverless.service.provider.region;
    this.options = options;
    this.functions = this.service.functions;
    this.widgetProps = this.service.custom.dashboard || null;
    
    this.hooks = {
      'before:package:finalize': () =>
        main(this.functions, this.region, this.service.service, this.widgetProps)
    };
  }
}

const getWidgets = async (lambdaArray, widgetProps) => {
  const widget = new Widget(widgetProps);
  let widgets = [];
  for (const lambda of lambdaArray) widgets.push(widget.createWidget(lambda));
  return widgets;
};

const main = (functions, region, dashboardName, widgetProps) => {
  let functionNames = [];
  for (let f in functions) {
    functionNames.push(functions[f].name);
  }

  getWidgets(functionNames, widgetProps).then(widgets => {
    const dashboard = new Dashboard(dashboardName, widgets, region);
    dashboard.createDashboard();
  });
};

module.exports = DashboardPlugin;
