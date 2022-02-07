let CrimsonQ = require("./lib/crimsonq");

async function main() {

    let CQ = new CrimsonQ({
        port: 9001, // Redis port
        host: "127.0.0.1", // Redis host
        password: "crimsonQ!",
    })
    await CQ.connect()
    let producer = await CQ.Producer()
    let consumer = await CQ.Consumer("yousef").init(["/wadi/yousef", "/nestrom/ceo"], 2)

    consumer.events.on("message", function (msg) {
        //console.log(">>>",msg)
        msg.fail("A BIG ERROR")
    })

    // let CQ = await cqClient.init()
    // let Producer = new CQ.Producer(cqClient)

    // let Consumer = new CQ.Consumer(cqClient)
    // await Consumer.init('yousef', "/wadi/yousef", 2)
    // // console.log(await Consumer.setConsumerTopics( "/dev/"))
    // // console.log(await Consumer.getConsumerTopics( "/dev/"))
    // Producer.pushToConsumer("yousef",{today:Date.now()})
    // console.log(await Consumer.pull())
    // Consumer.Subscribe()
    // console.log(await Consumer.retryMessages())
}

main()



/* 
({
  port: 9001, // Redis port
  host: "127.0.0.1", // Redis host
  password: "crimsonQ!",
}
*/