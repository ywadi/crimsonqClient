let CrimsonQ = require("../lib/crimsonq");
/**
 * Create crimsonQ connection
 * Create a new consumer / or update existing one
 * listen to consumer events 
 * create a new producer to send messages to the consumer 
 */

async function run() {
    // Connect to crimsonQ 
    let CQ = new CrimsonQ({
        port: 9001, // Redis port
        host: "127.0.0.1", // Redis host
        password: "crimsonQ!",
    });
    await CQ.connect();

    // Create w new Consumer 
    let consumer = await CQ.Consumer("MyConsumer");
    // init consumer with consumer topics , and concurrency for pulled messages from the queue;
    await consumer.init(["MyConsumer/topic1", "MyConsumer/topic2"], 1);

    // Get Consumer topics
    await consumer.getTopics();

    // Check crimsonq.md for more methods   

    // Listen to the consumer events messages 
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


    // Create a producer to send messages into consumer , or consumer topic!
    let producer = await CQ.Producer();
    // Push message into MyConsumer
    await producer.pushToConsumer("MyConsumer", { messageData: "My First Consumer message " });
    //Push message into a specific topic 
    await producer.pushToTopic("MyConsumer/topic1", { messageData: "My first topic message" });

    // Check consumer messages counts
    console.log(await consumer.messageCountByStatus());
}

run();

