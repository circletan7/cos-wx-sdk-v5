'use strict';

var util = require('./util');
var event = require('./event');
var task = require('./task');
var base = require('./base');
var advance = require('./advance');

var defaultOptions = {
    SecretId: '',
    SecretKey: '',
    XCosSecurityToken: '', // 使用临时密钥需要注意自行刷新 Token
    ChunkRetryTimes: 2,
    FileParallelLimit: 3,
    ChunkParallelLimit: 3,
    ChunkSize: 1024 * 1024,
    SliceSize: 1024 * 1024,
    CopyChunkParallelLimit: 20,
    CopyChunkSize: 1024 * 1024 * 10,
    CopySliceSize: 1024 * 1024 * 10,
    MaxPartNumber: 10000,
    ProgressInterval: 1000,
    UploadQueueSize: 10000,
    Domain: '',
    ServiceDomain: '',
    Protocol: '',
    CompatibilityMode: false,
    ForcePathStyle: false,
    Timeout: 0, // 单位毫秒，0 代表不设置超时时间
    CorrectClockSkew: true,
    SystemClockOffset: 0, // 单位毫秒，ms
    UploadCheckContentMd5: false,
    UploadIdCacheLimit: 50,
    UseAccelerate: false,
};

// 对外暴露的类
var COS = function (options) {
    this.options = util.extend(util.clone(defaultOptions), options || {});
    this.options.FileParallelLimit = Math.max(1, this.options.FileParallelLimit);
    this.options.ChunkParallelLimit = Math.max(1, this.options.ChunkParallelLimit);
    this.options.ChunkRetryTimes = Math.max(0, this.options.ChunkRetryTimes);
    this.options.ChunkSize = Math.max(1024 * 1024, this.options.ChunkSize);
    this.options.CopyChunkParallelLimit = Math.max(1, this.options.CopyChunkParallelLimit);
    this.options.CopyChunkSize = Math.max(1024 * 1024, this.options.CopyChunkSize);
    this.options.CopySliceSize = Math.max(0, this.options.CopySliceSize);
    this.options.MaxPartNumber = Math.max(1024, Math.min(10000, this.options.MaxPartNumber));
    this.options.Timeout = Math.max(0, this.options.Timeout);
    if (this.options.AppId) {
        console.warn('warning: AppId has been deprecated, Please put it at the end of parameter Bucket(E.g: "test-1250000000").');
    }
    if (this.options.SecretId && this.options.SecretId.indexOf(' ') > -1) {
        console.error('error: SecretId格式错误，请检查');
        console.error('error: SecretId format is incorrect. Please check');
    }
    if (this.options.SecretKey && this.options.SecretKey.indexOf(' ') > -1) {
        console.error('error: SecretKey格式错误，请检查');
        console.error('error: SecretKey format is incorrect. Please check');
    }
    event.init(this);
    task.init(this);
};

base.init(COS, task);
advance.init(COS, task);

COS.getAuthorization = util.getAuth;
COS.version = '1.1.5';

module.exports = COS;
