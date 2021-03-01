var AWS = require('aws-sdk');
const fs = require('fs');
var	path = require('path');
require("./utilities.js")();

module.exports = function () {

	const s3 = new AWS.S3({
		accessKeyId: process.env.ACCESS_KEY_ID,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
  		Bucket: process.env.S3_BUCKET
	});

	this.siteParsed = async function (key){
		const params = {
			Bucket: process.env.S3_BUCKET,
			Key: key,
		};
		const exists = await s3.headObject(params).promise().then(
			() => { 
				console.log(key+" found in S3");
				return true;
			},
    		err => {
      			if (err.code === 'NotFound') {
      				console.error(key+" Not found in S3");
        			return false;
      			}
      			throw err;
    		}
  		);
  		return exists
	}

	this.uploadRawToS3 = async function (res, key) {
		const params = {
			Bucket: process.env.S3_BUCKET,
			Key: key,
			Body: JSON.stringify(res, null, 2)
		};
		try {
		    const stored = await s3.upload(params).promise()
		} catch (err) {
		  	console.log(err)
		}
	}
}