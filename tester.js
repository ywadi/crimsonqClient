let CrimsonQ = require("./lib/crimsonq");
let Messages = require('./lib/recvdMsg');

async function main() {

    let CQ = new CrimsonQ({
        port: 9001, // Redis port
        host: "127.0.0.1", // Redis host
        password: "crimsonQ!",
    });
    await CQ.connect();

    let producer = await CQ.Producer();
    let consumer = await CQ.Consumer("g");
    await consumer.init(["/wadi/ywadi", "/nestrom/ceo"], 1);
    consumer.events.on("message", async function (msg) {
        try {
                await msg.done()
        } catch (e) {
            console.error(e);
        }
    })
    for (var x = 0; x < 10; x++) {
        await producer.pushToConsumer(consumer.consumerId, JSON.stringify({ messageData: `New Message added => ${x}` }))
    }
}

main()



/* 
({
  port: 9001, // Redis port
  host: "127.0.0.1", // Redis host
  password: "crimsonQ!",
}
*/