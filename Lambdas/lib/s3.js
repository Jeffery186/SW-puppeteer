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

	this.uploadFileToS3 = async function (filename) {
		try{
			var filedata = fs.readFileSync(filename);
			const params = {
				Bucket: process.env.S3_BUCKET,
				Key: filename,
				Body: filedata,
				ACL: 'public-read'
			};
     		try {
	    		const stored = await s3.upload(params).promise()
			} catch (err) {
			  	console.log(err)
			}
     	}catch(e){console.log(e)}
     	console.log("Stored "+filename)
	}

	this.uploadRawToS3 = async function (res, key) {
		const params = {
			Bucket: 's3-dns-info-fakenews',
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