/**
 * Copyright 2012-2013 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You
 * may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 */

module.exports = function() {
  this.Before("@directconnect", function (callback) {
    this.service = new this.AWS.DirectConnect();
    callback();
  });

  this.When(/^I create a Direct Connect connection with name prefix "([^"]*)"$/, function(prefix, callback) {
    var params = {
      bandwidth: '1Gbps', location: 'EqDC2',
      connectionName: this.uniqueName(prefix)
    };
    this.request(null, 'createConnection', params, callback);
  });

  this.Then(/^I should get a Direct Connect connection ID$/, function(callback) {
    this.connectionId = this.data.connectionId;
    this.connectionData = this.data;
    callback();
  });

  this.Then(/^I describe the connection$/, function(callback) {
    var params = {connectionId: this.connectionId};
    this.request(null, 'describeConnections', params, callback);
  });

  this.Then(/^the bandwidth should match the connection bandwidth$/, function(callback) {
    this.assert.equal(this.connectionData.bandwidth, this.data.connections[0].bandwidth);
    callback();
  });

  this.Then(/^I delete the Direct Connect connection$/, function(callback) {
    var params = {connectionId: this.connectionId};
    this.request(null, 'deleteConnection', params, callback);
  });

  this.Given(/^I create a Direct Connect connection with an invalid location$/, function(callback) {
    var params = {
      bandwidth: '1Gbps',
      location: 'INVALID_LOCATION',
      connectionName: this.uniqueName('aws-sdk-js')
    };
    this.request(null, 'createConnection', params, callback, false);
  });
};
