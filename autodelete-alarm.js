'use strict';

const _          = require('lodash');
const co         = require('co');
const AWS        = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

let deleteAlarmsForEndpoints = co.wrap(function* (functionName) {
  console.log('`Function name is ${functionName}`' + '-----');

  let putReq = {
    AlarmNames: [
        `Function [${functionName}] : Errors >= 1`  // This is linked to addition of alarm also. Update function name there as well.
    ]
  };

  yield cloudwatch.deleteAlarms(putReq, function(err, data) {
    if (err) 
        console.log("Error in removing alarm", err, err.stack); // an error occurred
    else
    console.log('auto-deleted error ALARMS for Lambda function' + '-----' + { functionName });  // successful response
  }).promise();
});

module.exports.handler = co.wrap(function* (event, context, cb) {
  let functionName = event.detail.requestParameters.functionName;

  yield deleteAlarmsForEndpoints(functionName);

  cb(null, 'ok');
});