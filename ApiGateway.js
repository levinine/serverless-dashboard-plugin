const AWS = require('aws-sdk');

class ApiGateway {
  constructor(apiName, region) {
    this.apigateway = new AWS.APIGateway({ region });
    this.checkApi = this.checkApi.bind(this);
    this.apiName = apiName;
  }

  checkApi(api) {
    return api.name === this.apiName;
  }

  async getApi() {
    const result = await this.apigateway.getRestApis({}).promise();
    return result.items.find(this.checkApi);
  }
}

module.exports = ApiGateway;
