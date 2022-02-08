/**
 * The Producer Class Object creates a Producer class that exposes producer functions.
 */
 module.exports = class Producer {
    /**
     * Constructor
     * @param {CrimsonQClient} cqClient The CrimsonQ client for Producer to use as a connection
     */
    constructor(cqClient) {
        this.cqClient = cqClient;
    }
    /**
     * Send messages to the consumer queue 
     * @param {string} consumerId The consumer Id that will recieve the message 
     * @param {Object} message The message object that needs to be pushed to consumers
     */
    async pushToConsumer(consumerId, message) {
        try {
            message = JSON.stringify(message)
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
     * @param {Object} message The message object that needs to be pushed to consumers
     */
    async pushToTopic(topic, message) {
        try {
            message = JSON.stringify(message)
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
        return await this.cqClient.command.ping("Producer")
    }

}