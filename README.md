# serverless-dashboard-plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Create CloudWatch Dashboard when deploying your Serverless application.                            
Serverless plugin to generate AWS CloudWatch dashboard for deployed Lambdas and API Gateways

**Requirements:**
* Serverless *v1.12.x* or higher
* AWS provider

## Setup


### Installation

Install via npm in the root of your Serverless service:

```sh
npm install --save-dev serverless-dashboard-plugin
```

Install from local directory in the root of your Serverless service:

```sh
npm install -D path-to-plugin-directory
```

Then inside your project's serverless.yml file add following entry to the plugins section: `serverless-dashboard-plugin` If there is no plugin section you will need to add it to the file.

It should look something like this:

```yml
plugins:
  - serverless-dashboard-plugin
```

### Configuration

The plugin can be configured by adding a property called `serverlessDashboard` to the custom properties of the Serverless
service. Following widgets are currently supported:
- Lambda Widget
- API Gateway Widget

#### Lambda Widgets

Lambda widgets can be globally deactivated for all functions by adding an `enabled` flag to the configuration and setting it to false. By default they are enabled.

```yaml
serverlessDashboard:
  lambda:
    enabled: false
```

#### API Gateway Widgets

API Gateway widgets can be globally deactivated by adding an `enabled` flag to the configuration and setting it to false. By default they are enabled.

```yaml
serverlessDashboard:
  apiGateway:
    enabled: false
```



## Usage
Once configured the plugin will run each time you deploy your serverless app and update CloudWatch dashboard to the current structure of the app. 

The message seen after deploy
![Image of create dashboard](https://i.ibb.co/YQbWYpG/Screenshot-from-2020-03-03-14-32-02.png)


Created Dashboard
![Image of create dashboard](https://i.ibb.co/9NZMTcV/Screenshot-from-2020-03-03-14-09-33.png)


## AWS Dashboard limits

Up to 100 metrics per dashboard widget. Up to 500 metrics per dashboard, across all widgets.

These quotas include all metrics retrieved for use in metric math functions, even if those metrics are not displayed on the graph.

These quotas cannot be changed.
