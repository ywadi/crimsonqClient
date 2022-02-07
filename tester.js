let CrimsonQ = require("./lib/crimsonq");

async function main() {

    let cqClient = new CrimsonQ.CrimsonQClient({url: 'crimsonq://:crimsonQ!@127.0.0.1:9001'})
    await cqClient.init()
    let Producer = new CrimsonQ.Producer(cqClient)
    console.log(await Producer.pushToConsumer("Ola","123"))

    let Consumer = new CrimsonQ.Consumer(cqClient)
    console.log(await Consumer.createConsumer('ywadi' , 'nestrom/dev,test/topic'))
}

main()
