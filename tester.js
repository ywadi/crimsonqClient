let CrimsonQ = require("./lib/crimsonq");


async function main() {

    let cqClient = new CrimsonQ({url: 'crimsonq://:crimsonQ!@127.0.0.1:9001'})
    cqClient.init()
}

main()
