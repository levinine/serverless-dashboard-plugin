# serverless-dashboard-plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Serverless plugin to generate AWS CloudWatch dashboard for deployed Lambdas and API Gateway.

**Requirements:**
* Serverless *v1.12.x* or higher
* AWS provider

## Setup

### Installation

Install via npm in the root of your Serverless service:

```sh
npm install --save-dev serverless-dashboard
```

Then inside your project's serverless.yml file add following entry to the plugins section: `serverless-dashboard`. If there is no plugin section you will need to add it to the file.

It should look something like this:

```yml
plugins:
  - serverless-dashboard
```

### Configuration

The plugin can be configured by adding a property called `serverlessDashboard` to the custom properties of the Serverless
service. Following widgets are currently supported:
- Lambda Widget
- API Gateway Widget

#### Lambda Widgets

Lambda widgets can be globally deactivated for all functions by adding an `enabled` flag to the configuration and setting it to `false`. By default they are enabled.

```yaml
serverlessDashboard:
  lambda:
    enabled: false
```

#### API Gateway Widget

One widget is created for API Gateway resource, even if there are many Lambdas triggered by HTTP events. This widget can be globally deactivated by adding an `enabled` flag to the configuration and setting it to `false`. By default they are enabled for applications which have HTTP triggered Lambdas.

```yaml
serverlessDashboard:
  apiGateway:
    enabled: false
```

#### Command line options
```
--dashboardLambda               Set to true or false, overrides enabled flag in serverless.yml
--dashboardApiGateway           Set to true or false, overrides enabled flag in serverless.yml
```
Options passed on the command line override YAML options.


## Usage and command line options
Once configured the plugin will run each time you deploy your serverless app and update CloudWatch dashboard to the current structure of the app. 

In your project root run: `serverless dashboard create` or `serverless dashboard remove` to create or remove the CloudWatch dashboard.


The message seen after deploy
![Image of create dashboard](https://user-images.githubusercontent.com/18051308/76213593-4b8e4a00-620b-11ea-9fb5-7151ff0ef361.png)

Created Dashboard
![Image of create dashboard](https://user-images.githubusercontent.com/18051308/75797496-8c064780-5d75-11ea-9d31-44a2a610f3a9.png)

On deleting the stack from the command line, the plugin will delete the dashboard.
![Image of removed dashboard](https://user-images.githubusercontent.com/18051308/75879020-e2799180-5e1a-11ea-8c03-dbcf38c32783.png)


## AWS Permissions

Listed below are AWS permissions needed for a sucessful deploy with serverless-dashboard-plugin 

- `cloudwatch:PutDashboard` to be able to create or modify dashboards
- `cloudwatch:DeleteDashboards` to be able to delete dashboards
- `apigateway:GET` to be able to check for available APIs

To view the dashboard afterwards following permissions are required

- `cloudwatch:GetDashboard`
- `cloudwatch:ListDashboards`

## AWS Dashboard limits

Reaching these limits is improbable.

Up to 100 metrics per dashboard widget. Up to 500 metrics per dashboard, across all widgets.

These quotas include all metrics retrieved for use in metric math functions, even if those metrics are not displayed on the graph.

These quotas cannot be changed.

See the full list of [CloudWatch Service Quotas](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_limits.html)

## AWS CloudWatch pricing

See the full list of [Amazon CloudWatch pricing](https://aws.amazon.com/cloudwatch/pricing/) 