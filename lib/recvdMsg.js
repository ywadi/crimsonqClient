module.exports = class RecievedMessage {
    constructor(consumer, key, message) {
        this.consumer = consumer;
        this.key = key;
        this.message = message;
    }

    /**
     * Complete Message
     */
    
    async done() {
        try {
          return  await this.consumer.cqClient.command.msg_complete(this.consumer.consumerId, this.key);
        } catch (e) {
            console.error(e)
        }
    }
    /**
     * Set failed message
     * @param {String} errorMessage  
     */
    async fail(errorMessage) {
        try {
           return  await this.consumer.cqClient.command.msg_fail(this.consumer.consumerId, this.key, errorMessage);
        } catch (e) {
            console.error(e)
        }
    }
}
