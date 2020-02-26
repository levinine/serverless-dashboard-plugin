class Widget {
  constructor(props, region) {
    this.type = props.type || 'metric';
    this.width = props.width || 7;
    this.height = props.height || 4;
    this.properties = props.properties || null;
    this.view = props.properties.view || 'singleValue';
    this.stacked = props.properties.stacked || false;
    this.region = props.properties.region || region; // ?????
    this.stat = props.properties.stat || 'Sum';
    this.period = props.properties.period || 3600;
    this.setPeriodToTimeRange = props.properties.setPeriodToTimeRange || true;
  }

  createWidget(lambda) {
    const metrics = [];
    if(this.properties) {
      for(const metric of this.properties.metrics) 
        metrics.push(['AWS/Lambda', metric, 'FunctionName', lambda]) 
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
  };
}

module.exports = Widget;
