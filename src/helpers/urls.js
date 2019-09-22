const SERVER_URLS = {
  NORTH_AMERICA: 'b2vapi.bmwgroup.us',
  REST_OF_WORLD: 'b2vapi.bmwgroup.com',
  CHINA: 'b2vapi.bmwgroup.cn:8592',
};

export const getHost = region => {
  switch (region) {
    case 'us':
      return SERVER_URLS.NORTH_AMERICA;
    case 'eu':
      return SERVER_URLS.REST_OF_WORLD;
    case 'cn':
      return SERVER_URLS.CHINA;
    default:
      throw new Error('Unsupported region. Supported values are us|eu|cn');
  }
};

class BMWURLs {
  constructor(region) {
    this.region = region;
    this.host = getHost(region);
  }

  getHost() {
    return this.host;
  }

  getAuthURL() {
    return `https://${this.host}/gcdm/oauth/token`;
  }

  getBaseURL() {
    return `https://${this.host}/webapi/v1`;
  }

  getVehiclesURL() {
    return `${this.getBaseURL()}/user/vehicles`;
  }

  getVehicleVinURL(vin) {
    return `${this.getVehiclesURL()}/${vin}`;
  }

  getVehicleStatusURL(vin) {
    return `${this.getVehicleVinURL(vin)}/status`;
  }

  getRemoteServiceStatusURL(vin, serviceType) {
    return `${this.getVehicleVinURL(
      vin
    )}/serviceExecutionStatus?serviceType=${serviceType}`;
  }

  getRemoteServiceURL(vin) {
    return `${this.getVehicleVinURL(vin)}/executeService`;
  }

  getVehicleImage(vin, width, height, view) {
    return `${this.getVehicleVinURL(
      vin
    )}/image?width=${width}&height=${height}&view=${view}`;
  }
}

export default BMWURLs;
