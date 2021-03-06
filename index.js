const Dashboard = require('./Dashboard');
const ApiGateway = require('./ApiGateway');
const Widget = require('./Widget');

class DashboardPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.commands = {
      dashboard: {
        commands: {
          create: {
            lifecycleEvents: ['init'],
            usage: 'This command takes the current structure of the application and creates/updates CloudWatch dashboard.'
          },
          remove: {
            lifecycleEvents: ['init'],
            usage: 'This command removes the dashboard from CloudWatch'
          }
        }
      }
    };

    this.hooks = {
      'after:deploy:finalize': () => this.initializeDashboardCreate(),
      'remove:remove': () => this.initializeDashboardRemove(),
      'dashboard:create:init': () => this.initializeDashboardCreate(),
      'dashboard:remove:init': () => this.initializeDashboardRemove()
    };
  }

  initializeDashboardCreate() {
    const configuration = this.mergeConfiguration(this.serverless.service.custom.serverlessDashboard, this.options);
    return this.createDashboard(
      this.serverless.service.functions,
      this.serverless.service.service,
      this.serverless.service.provider.region,
      this.serverless.service.provider.stage,
      configuration
    );
  }

  initializeDashboardRemove() {
    return this.removeDashboard(
      this.serverless.service.service,
      this.serverless.service.provider.region,
      this.serverless.service.provider.stage
    );
  }

  mergeConfiguration(yamlConfiguration, cliConfiguration) {
    const configuration = yamlConfiguration || {};
    configuration.lambda = configuration.lambda || { enabled: true };
    configuration.apiGateway = configuration.apiGateway || { enabled: true };

    if (cliConfiguration.dashboardLambda === 'false') {
      configuration.lambda.enabled = false;
    } else if (cliConfiguration.dashboardLambda === 'true') {
      configuration.lambda.enabled = true;
    }

    if (cliConfiguration.dashboardApiGateway === 'false') {
      configuration.apiGateway.enabled = false;
    } else if (cliConfiguration.dashboardApiGateway === 'true') {
      configuration.apiGateway.enabled = true;
    }
    return configuration;
  }

  checkForAPI(functions) {
    const values = Object.values(functions);
    let foundAPI = false;

    values.map(value => {
      value.events && value.events.map(event => {
        if (event.http != 'undefined') {
          foundAPI = true;
        }
      });
    });

    return foundAPI;
  }

  async getWidgets(functions, apiName, region, configuration) {
    const widget = new Widget(region);
    const apiGateway = new ApiGateway(apiName, region);
    let widgets = [];

    if (configuration.lambda.enabled === true) {
      const functionNames = this.getFunctionNames(functions);
      for (const functionName of functionNames) {
        widgets.push(widget.createLambdaWidget(functionName));
      }
    }

    if (configuration.apiGateway.enabled === true) {
      if (this.checkForAPI(functions)) {
        if (await apiGateway.getApi()) {
          widgets.push(widget.createApiGatewayWidget(apiName));
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

  createDashboard(functions, serviceName, region, stage, configuration) {
    const apiName = `${stage}-${serviceName}`;

    return this.getWidgets(functions, apiName, region, configuration).then(
      widgets => {
        const dashboard = new Dashboard(`${serviceName}-${stage}`, widgets, region);
        return dashboard.createDashboard();
      }
    );
  }

  removeDashboard(serviceName, region, stage) {
    const dashboard = new Dashboard(`${serviceName}-${stage}`, null, region);
    return dashboard.removeDashboard();
  }
}

module.exports = DashboardPlugin;
