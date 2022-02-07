let CrimsonQ = require("./lib/crimsonq");

async function main() {

    let cqClient = new CrimsonQ.CrimsonQClient({url: 'crimsonq://:crimsonQ!@127.0.0.1:9001'})
    await cqClient.init()
    let Producer = new CrimsonQ.Producer(cqClient)
    console.log(await Producer.pushToTopic("/nestrom/","123"))

    let Consumer = new CrimsonQ.Consumer(cqClient, 'Ola')
    console.log(await Consumer.setConsumerTopics( "/dev/"))
    console.log(await Consumer.getConsumerTopics( "/dev/"))
    // console.log(await Consumer.completeConsumerMessage('01FVA3CM50WDS50P90JG5T9CCF' ))
}

main()
