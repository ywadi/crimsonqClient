
# CrimsonQ NodeJS Client Library 
[![buddy pipeline](https://app.buddy.works/ywadi85/crimsonq/pipelines/pipeline/373325/badge.svg?token=463c4f343893f85c5056a16ba6da1379079553b6b7a950b7ba9d643591fcb0d2 "buddy pipeline")](https://app.buddy.works/ywadi85/crimsonq/pipelines/pipeline/373325)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/ywadi/crimsonqClient?)
![GitHub](https://img.shields.io/github/license/ywadi/crimsonqClient?)

### A Multi Consumer per Message Queue with persistence and Queue Stages.
![crimsonq](https://github.com/ywadi/crimsonq/raw/main/assets/logo.png)

CrimsonQ is a high performance Multi Consumer per Message with persistence and Queue Stages written in pure go. The idea is to allow consumers to never miss out on messages from a traditional pub/sub and at the same time be able to manage messages like in a queue with stages (pending, active, delayed, failed, comapleted) 

You can get CrimsonQ from the github repo [here](https://github.com/ywadi/crimsonq) and then use this client in your nodejs application easily. 

### Installation 
Simply install it from npm using 

    $ npm install crimsonq --save

Now you can use the library to connect with crimsonq either as a producer or consumer. 

### Usage 
Once you have installed the module you can then require it to use it in your code, whether as a producer or consumer you need to require it as follows; let  `CrimsonQ = require("./lib/crimsonq");`
Once required you will need to setup the connection as follows; 

    //Initiate an Instance Consumer 
    let  CQ = new  CrimsonQ({
	    port:  9001, // Redis port
	    host:  "127.0.0.1", // Redis host
	    password:  "crimsonQ!",
    });
    //Connect and await for the connect 
    await CQ.connect();


#### As a Producer 
To use the client as a Producer all you need to do is create a new producer for the client instance as follows;

    let  producer = await  CQ.Producer();

Then you can use the producer to publish messages. There are 2 ways you can publish messages, either directly to a consumer on its id, or to multiple consumers through a MQTT like topic, [see MQTT topic matching for details.](https://subscription.packtpub.com/book/application_development/9781787287815/1/ch01lvl1sec18/understanding-wildcards)
Below are the commands that can be used against  the __*producer*__

__producer.pushToConsumer(consumerId, message)__

Send messages to a consumer's  queue directly into its queue and will be in the pending state awaiting to be pulled. 

**Kind**: instance method of [<code>Producer</code>](#Producer)  

| Param | Type | Description |
| --- | --- | --- |
| consumerId | <code>string</code> | The consumer Id that will recieve the message |
| message | <code>Object</code> | The message object that needs to be pushed to consumers |

__producer.pushToTopic(topic, message)__
Send message to the topic queue and this will provide a message copy for each consumer in its queue. 

**Kind**: instance method of [<code>Producer</code>](#Producer)  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic that will be used to send to consumers listening to the topic. The topic can have MQTT style wildcards. |
| message | <code>Object</code> | The message object that needs to be pushed to consumers |
<hr/>

#### As a Consumer 
The consumer will read messages out of its own queue, all the messages that have been sent to the consumer will be accessible through the consumer part of the library. To get started you will need to setup the consumer as follows; 

    let  consumer = CQ.Consumer("I_WANT_MESSAGES");
    await consumer.init(["/path1/sub2", "/path2/#"], 1);

You can setup the consumer by creating an instance  and giving it a unique ID, make sure that each consumer you have has a different ID, if you need 2 consumers to read the same messages, create the consumer twice with different IDs but same topics, then push a message to a topic that matches both consumers. A visual explanation can be seen below; 
![enter image description here](https://raw.githubusercontent.com/ywadi/crimsonq/main/assets/anim.gif)

Once you have gotten the consumer setup now its a matter of waiting for messages 

    consumer.events.on("message", async function (msg) {
            try {
		         //DO something with the msg data here, when done make sure to call done to tell
		         //the queue that you have consumed it properly.  
	             await msg.done()
            } catch (e) {
	            //If the above failes, you can call msg.fail and send the reason of failure back 
	            //to the queue. 
                msg.fail(e.message)
            }
        })
<hr/> 

### Auto-reconnect
This client is based on ioredis and has the same methodology, if a connection is interrupted it will reconnect and also be up and functional. The client will also start to pull the messages that the client missed when was online. 

### Examples
You can find examples in the repos example folder.
