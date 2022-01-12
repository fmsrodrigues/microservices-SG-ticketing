import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // you can create an External Name Service to you another url, like http://ingress-srv/
    // otherwise you will need to use the syntax http://*NAMEOFSERVICE*.*NAMESPACE*.svc.cluster.local/
    // http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  }

  return axios.create({ baseURL: '/' });
}