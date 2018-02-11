require('dotenv').load();

// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-2',
  accessKeyId: process.env.accessKeyId, 
  secretAccessKey: process.env.secretAccessKey});
// Create EC2 service object
var ec2 = new AWS.EC2();

var params = {
   ImageId: 'ami-f0f8d695', // amzn-ami-2011.09.1.x86_64-ebs
   InstanceType: 't2.micro',
   MinCount: 1,
   MaxCount: 1,
   KeyName: 'id_rsa'
};

//printStatuses();
//Create the instance
ec2.runInstances(params, function(err, data) {
   if (err) {
      console.log("Could not create instance", err);
      return;
   }
   var instanceId = data.Instances[0].InstanceId;
   console.log("Created instance", instanceId);
   var paramsForDI = 
		{
			InstanceIds: [instanceId]
		};
   // Add tags to the instance
   params = {Resources: [instanceId], Tags: [
      {
         Key: 'hw1b',
         Value: 'hw 1b'
      }
   ]};
   ec2.createTags(params, function(err) {
      console.log("Tagging instance", err ? "failure" : "success");
   });


setTimeout(function(){ 
   ec2.describeInstances(paramsForDI, function(error, data)
		{
			if(error)
			{
				console.log("AWS Describe Instances Error - " + error + "\n");
			}
			else
			{
				var awsPubDNS = data.Reservations[0].Instances[0].PublicDnsName;
				var awsPubIP  = data.Reservations[0].Instances[0].PublicIpAddress;
				console.log("AWS Instance Public DNS Name - " + awsPubDNS + "\n");
				console.log("AWS Instance Public IP Address - " + awsPubIP + "\n");
				
			}
		});
});
}, 30000);

