let redis = require("redis");

/**
 * The Class Object for the CrimsonQ Client
 */
class CrimsonQClient {
    /**
     * Construct a new CrimsonQClient
     * @param {object} settings The settings for the CrimsonQ connection as {url:"crimsonq://:crimsonQ!@127.0.0.1:9001"}
     */
    constructor(settings) {
        this.settings = settings;
        this.settings.url = settings.url.replace("crimsonq:", "redis:")

        this.client = redis.createClient(this.settings)
        this.client.on('error', (err) => console.log('Redis Client Error', err));
        this.client.connect(() => {
            console.log("Connected to CrimsonQ!")
        });
        this.command = {};
    }

    /**
     * Initiate the CrimsonQ client, gets the commands from the server and generates the commands as functions
     */
    async init() {
        let res = await this.client.sendCommand(['command']);
        for (let c in res) {
            let cqClient = this.client
            this.command[(res[c].replaceAll("[", "").replaceAll("]", "").split(" "))[0].replaceAll(".", "_")] = async function () {
                if (arguments.length == res[c].split(" ").length - 1) {
                    try {
                        let value = await cqClient.sendCommand([res[c].split(" ")[0], ...arguments])
                        return { value, error: null }
                    }
                    catch (e) {
                        console.error(e);
                        return { value: null, error: e }
                    }
                }
                else {
                    console.error(`Incorrect Command Arguments, Expecting the arguments, ${res[c].split(" ")}`)
                    return { value: null, error: `Incorrect Command Arguments, Expecting the arguments, ${res[c].split(" ")}` }
                }

            }
        }
    }
}

/**
 * The Producer Class Object creates a Producer class that exposes producer functions.
 */
class Producer {
    /**
     * 
     * @param {CrimsonQClient} cqClient The CrimsonQ client for Producer to use as a connection
     */
    constructor(cqClient) {
        this.cqClient = cqClient
    }
    /**
     * Send messages to the consumer queue 
     * @param {string} consumerId The consumer Id that will recieve the message 
     * @param {string} message The message as a string
     */
    async pushToConsumer(consumerId, message) {
        try {
            var exists = await this.cqClient.command.consumer_exists(consumerId);
            console.log(exists)
            if (!exists.error && exists.value === 'true') {
                await this.cqClient.command.msg_push_consumer(consumerId, message)
                return "Message sent successfully"
            }else {
                throw new Error("Consumer Id does not exist")
            }
        } catch (e) {
            throw e
        }
    }

    /**
     * Send message to the topic queue
     * @param {string} topic The topic that will be used to send to consumers listening to the topic. The topic can have MQTT style wildcards.
     * @param {string} message The message as a string to be sent to the consumers
     */
    async pushToTopic(topic, message) {
        try {
            await this.cqClient.command.msg_push_topic(topic, message)
            return "Message sent successfully"
        } catch (e) {
            throw e
        }
        //this.crimsonQConnection.msg_push_topic(topic, message)
    }

    /**
     * The good old Ping with a message, helps you debug your connection.
     * @returns Pong! CrimsonQ 
     */
    async ping() {
        return await this.cqClient.command.ping("CrimsonQ")
    }

}

class Consumer {
    constructor(cqClient) {
        this.cqClient = cqClient
    }
    /**
     * Create a consumer 
     * @param {String} consumerId 
     * @param {String} topics List Of topics comma separated with no spaces 
     */

   async createConsumer (consumerId , topics){
    try {
        var exists = await this.cqClient.command.consumer_exists(consumerId);
        console.log({exists});
        if (!exists.error && exists.value === 'false') {
            return  await this.cqClient.command.consumer_create(consumerId, topics)
        }else {
            throw new Error("Consumer Already existss")
        }
    } catch (e) {
        throw e
    }
   }
 }

module.exports = {
    Producer,
    CrimsonQClient,
    Consumer
} 