const { APIGatewayClient, GetRestApiCommand } = require('@aws-sdk/client-api-gateway');

class ApiGateway {
  constructor(apiName, region) {
    this.apigateway = new APIGatewayClient({ region });
    this.checkApi = this.checkApi.bind(this);
    this.apiName = apiName;
  }

  checkApi(api) {
    return api.name === this.apiName;
  }

  async getApi() {
       const command = new GetRestApiCommand({});
       try {
         const result = await this.apigateway.send(command);
         return result.items.find(this.checkApi);
       } catch (error) {
         return error
       }
  }
}

module.exports = ApiGateway;
