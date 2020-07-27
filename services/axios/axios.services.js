/************************************************************************
 * IMPORTS
 ************************************************************************/
const axios = require("axios");
const querystring = require("querystring");
/************************************************************************
 * SERVICES
 ************************************************************************/
exports.getService = async (urlReq, dataSend = {}) => {
    const response = await axios
        .get(urlReq, dataSend)
        .catch(error => {
            // console.log(error);
            return error.response;
        });
    return response;
};
exports.postService = async (urlReq, dataSend = {}, options = {}) => {
    const response = await axios
        .post(urlReq, querystring.stringify(dataSend), options)
        .catch(error => {
            // console.log(error);
            return error.response;
        });
    return response;
};
exports.putService = async (urlReq, dataSend = {}) => {
    const response = await axios
        .put(urlReq, dataSend)
        .catch(error => {
            // console.log(error);
            return error.response;
        });
    return response;
};