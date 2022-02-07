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
                let result = await this.cqClient.command.msg_push_consumer(consumerId, message)
                return result
            } else {
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
            let result = await this.cqClient.command.msg_push_topic(topic, message)
            return result
        } catch (e) {
            throw e
        }
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
    constructor(cqClient , consumerId) {
        this.cqClient = cqClient;
        this.consumerId = consumerId;
    }
    /**
     * Create a consumer 
     * @param {String} consumerId 
     * @param {String} topics List of topics comma separated with no spaces 
     * @param {Number} concurrency Consumer pull concurrency , if sent to 0 or -1 concurrency will be unlimited 
     */

    async createConsumer(topics, concurrency) {
        try {
            var exists = await this.cqClient.command.consumer_exists(this.consumerId);
            if (!exists.error && exists.value === 'false') {
                return await this.cqClient.command.consumer_create(this.consumerId, topics, concurrency)
            } else {
                throw new Error("Consumer Already existss")
            }
        } catch (e) {
            throw e
        }
    }

    /**
     * Get Consumer topics
     */

    async getConsumerTopics() {
        try {
            var exists = await this.cqClient.command.consumer_exists(this.consumerId);
            if (!exists.error && exists.value === 'true') {
                return await this.cqClient.command.consumer_topics_get(this.consumerId)
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        }
    }
    /**
     * Update or set consumer topics
     * @param {String} topics List of all consumer topics comma separated with no spaces
     */

    async setConsumerTopics(topics) {
        try {
            var exists = await this.cqClient.command.consumer_exists(this.consumerId);
            if (!exists.error && exists.value === 'true') {
                return await this.cqClient.command.consumer_topics_set(this.consumerId, topics)
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        }
    }
    /**
     * Get Consumer Messages
     */
    async getConsumerMessages() {
        try {
            var exists = await this.cqClient.command.consumer_exists(this.consumerId);
            if (!exists.error && exists.value === 'true') {
                return await this.cqClient.command.msg_pull(this.consumerId)
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        }
    };
    /**
     * Get consumer messages counts grouped by status
     */

    async countConsumerMessages() {
        try {
            var exists = await this.cqClient.command.consumer_exists(this.consumerId);
            if (!exists.error && exists.value === 'true') {
                return await this.cqClient.command.msg_counts(this.consumerId)
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        }
    }
    /**
     * Complete a message from consumer
     * @param {String} messageId 
     */
    async completeConsumerMessage(messageId) {
        try {
            var exists = await this.cqClient.command.consumer_exists(this.consumerId);
            if (!exists.error && exists.value === 'true') {
                return await this.cqClient.command.msg_complete(this.consumerId, messageId)
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        }
    };

    /**
      * The good old Ping with a message, helps you debug your connection.
      * @returns Pong! CrimsonQ 
      */
    async ping() {
        return await this.cqClient.command.ping("CrimsonQ")
    }
}

module.exports = {
    Producer,
    CrimsonQClient,
    Consumer
} 