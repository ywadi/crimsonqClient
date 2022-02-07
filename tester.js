let CrimsonQ = require("./lib/crimsonq");

async function main() {

    let cqClient = new CrimsonQ.CrimsonQClient({url: 'crimsonq://:crimsonQ!@127.0.0.1:9001'})
    await cqClient.init()
    let Producer = new CrimsonQ.Producer(cqClient)
    console.log(await Producer.pushToConsumer("Ola","123"))

    let Consumer = new CrimsonQ.Consumer(cqClient)
    await Consumer.init('Ola' , '/nestrom' , 10)
    // console.log(await Consumer.setConsumerTopics( "/dev/"))
    // console.log(await Consumer.getConsumerTopics( "/dev/"))
    console.log(await Consumer.pull())
    // console.log(await Consumer.retryMessages())
}

main()
