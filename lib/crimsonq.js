const Redis = require("ioredis");
const Producer = require("./producer")
const Consumer = require("./consumer")

/**
 * The Class Object for the CrimsonQ Client
 */
module.exports = class CrimsonQClient {
    /**
     * Construct a new CrimsonQClient
     * @param {object} settings The settings for the CrimsonQ connection as {url:"crimsonq://:crimsonQ!@127.0.0.1:9001"}
     */
    constructor(settings) {

        this.redisCommander = new Redis(settings)
        this.redisSubscriber = new Redis(settings)
        this.command = {};
    }

    /**
     * Initiate the CrimsonQ client, gets the commands from the server and generates the commands as functions
     */
    async connect() {
        let res = await this.redisCommander.call('command');
        for (let c in res) {
            let cqClient = this.redisCommander
            this.command[(res[c].replace(/\[/g, "").replace(/\]/g, "").split(" "))[0].replace(/\./g, "_")] = async function () {
                if (arguments.length == res[c].split(" ").length - 1) {
                    try {
                        let value = await cqClient.call(res[c].split(" ")[0], [...arguments])
                        return { value, error: null }
                    }
                    catch (e) {
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
    /**
     * Creates a new producer
     * @returns Producer 
     */
    Producer() {
        return new Producer(this)
    }
    /**
     * Creates a new consumer
     * @param {String} consumerId 
     * @returns Consumer
     */
    Consumer(consumerId) {
        return new Consumer(this, consumerId)
    }
}
