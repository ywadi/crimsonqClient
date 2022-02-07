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
            if (exists.value == 'true') {
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
    constructor(cqClient) {
        this.cqClient = cqClient;
        this.consumerId;
        this.exists = false;
    }
    /**
     * Create a consumer 
     * @param {String} consumerId 
     * @param {String} topics List of topics comma separated with no spaces 
     * @param {Number} concurrency Consumer pull concurrency , if sent to 0 or -1 concurrency will be unlimited 
     */


    async init(consumerId, topics, concurrency) {
        try {
            this.consumerId = consumerId;
            var exists = await this.cqClient.command.consumer_exists(this.consumerId);
            this.exists = exists.value === 'false' ? false : true;
            if (!this.exists) {
                return await this.cqClient.command.consumer_create(this.consumerId, topics, concurrency)
            }

            return 'Consumer already exits and ready to be used'
            
        } catch (e) {
            throw e
        }
    }

    /**
     * Get Consumer topics
     */

    async getTopics() {
        try {
            if (this.exists) {
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

    async setTopics(topics) {
        try {
            if (this.exists) {
                return await this.cqClient.command.consumer_topics_set(this.consumerId, topics)
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        }
    }

    /**
     * Get consumer messages counts grouped by status
     */

    async messageCountByStatus() {
        try {
            if (this.exists) {
                return await this.cqClient.command.msg_counts(this.consumerId)
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        }
    }
    /**
     * Pull Consumer Messages
     */

    async pull() {
        try {
            let concurrencyCheck = await this.concurrencyOk();
            if (this.exists && concurrencyCheck) {
                return await this.cqClient.command.msg_pull(this.consumerId)
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        }
    }

    /**
     * Complete a message from consumer
     * @param {String} messageId Message should be pulled first 
     */
    async completeMessage(messageId) {
        try {
            if (this.exists) {
                return await this.cqClient.command.msg_complete(this.consumerId, messageId)
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        }
    };

    /**
     * 
     * @param {String} status status string  either failed or completed; 
     */

    async flushMessages(status){
        try {
            if (this.exists) {
                status = status == 'completed' ? 'complete' : status; 
                return await this.cqClient.command[`consumer_flush_${status}`](this.consumerId)
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        } 
    }
    /**
     * Retry failed messages
     * @param {String} messageId retry failed message/messages if not sent it will retry all messages 
     */

    async retryMessages(messageId){
        try {
            if (this.exists) {
                if(messageId){
                    return await this.cqClient.command.msg_retry(this.consumerId , messageId);
                }else{
                    return await this.cqClient.command.msg_retryall(this.consumerId);
                }
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        } 
    }
    /**
     * Change message status into failed 
     * @param {String} messageId 
     * @param {String} errorMessage Reason why this message set to failed
     * @returns 
     */

    async failMessage(messageId , errorMessage){
        try {
            if (this.exists) {
                    return await this.cqClient.command.msg_fail(this.consumerId , messageId , errorMessage);
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        } 
    };
    /**
     * Change consumer concurrency
     * @param {Number} concurrency 
     */

    async updateConcurrency(concurrency){
        try {
            if (this.exists) {
                return await this.cqClient.command.consumer_concurrency_set(this.consumerId, concurrency)
            } else {
                throw new Error("Consumer Doesn't exists")
            }
        } catch (e) {
            throw e
        }
    }
/**
 * Check concurrency status
 * @returns Boolean
 */
    async concurrencyOk(){
        try {
            if (this.exists) {
                let result = await this.cqClient.command.consumer_concurrency_ok(this.consumerId)
                return result.value == 'true';
            } else {
                throw new Error("Consumer Doesn't exists")
            }
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

module.exports = {
    Producer,
    CrimsonQClient,
    Consumer
} 