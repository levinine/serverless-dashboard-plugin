class Widget {
  constructor (region) {
    this.type = 'metric';
    this.width = 8;
    this.height = 4;
    this.properties = null;
    this.view = 'singleValue';
    this.stacked = false;
    this.region = region;
    this.stat = 'Sum';
    this.period = 3600;
    this.setPeriodToTimeRange = true;
  }

  createWidget(lambda) {
    let metrics = [];
    if(this.properties) {
      for(const metric of this.properties.metrics) {
        metrics.push(['AWS/Lambda', metric, 'FunctionName', lambda])
      }
    } else {
      metrics = [
        ['AWS/Lambda', 'Invocations', 'FunctionName', lambda],
        ['.', 'Errors', '.', '.']
      ]
    }

    return {
      type: this.type,
      width: this.width,
      height: this.height,
      properties: {
        metrics: metrics,
        view: this.view,
        stacked: this.stacked,
        region: this.region,
        stat: this.stat,
        period: this.period,
        setPeriodToTimeRange: this.setPeriodToTimeRange,
        title: lambda
      }
    }
  }

  createApiWidget(apiName) {
    const metrics = [
      [ 'AWS/ApiGateway', 'Latency', 'ApiName', apiName, { 'stat': 'Average' } ],
      [ '.', 'Count', '.', '.' ],
      [ '.', '5XXError', '.', '.' ]
    ]

    return {
      type: this.type,
      width: this.width * 1.5,
      height: this.height,
      properties: {
        metrics: metrics,
        view: this.view,
        region: this.region,
        stat: this.stat,
        period: this.period,
        setPeriodToTimeRange: this.setPeriodToTimeRange,
        title: apiName
      }
    }
  }
}

module.exports = Widget;
