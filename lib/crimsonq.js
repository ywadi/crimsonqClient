let redis = require("redis");

class CrimsonQClient {
    constructor(settings) {
        this.settings = settings;
        this.settings.url = settings.url.replace("crimsonq:", "redis:")
        console.log(this.settings)

        this.client = redis.createClient(this.settings)
        this.client.on('error', (err) => console.log('Redis Client Error', err));
        this.client.connect(() => {
            console.log("Connected to CrimsonQ!")
        });

        this.command = {};

    }

    async init() {
        let res = await this.client.sendCommand(['command']);
        for (let c in res) {         
            let cqClient = this.client
                this.command[(res[c].replaceAll("[","").replaceAll("]","").split(" "))[0]] = async function(){
                    if(arguments.length == res[c].split(" ").length -1)
                    {
                        try{
                            let value = await cqClient.sendCommand([res[c].split(" ")[0], ...arguments])
                            return value
                        }
                        catch (e)
                        {
                            throw e;
                        }
                    }
                    else {
                        throw new Error(`Incorrect Command Arguments, Expecting the arguments, ${res[c].split(" ")}`)
                    }
                        
                }
        }
    }

}

module.exports = CrimsonQClient;
