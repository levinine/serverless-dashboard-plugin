const AWS = require('aws-sdk');

class ApiGateway {
  constructor(apiName, region) {
    this.apiName = apiName;
    this.region = region;
   
    this.checkApi = this.checkApi.bind(this)
  }

  checkApi(api) {
    return api.name === this.apiName;
  }

  async getApi() {
    const apigateway = new AWS.APIGateway({region:this.region});
    const result = await apigateway.getRestApis({}).promise();
    
    return result.items.find(this.checkApi);    
  }
}



module.exports = ApiGateway;
