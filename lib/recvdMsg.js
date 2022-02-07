module.exports = class RecievedMessage {
    constructor(consumer, key) {
        this.consumer = consumer;
        this.key = key;
        this.consumer.events.emit("message", this)
        console.log(this.consumer.command)

    }

    async done() {
        await this.consumer.cqClient.command.msg_complete(this.consumer.consumerId, this.key)
    }

    async fail(errorMessage) {
        await this.consumer.cqClient.command.msg_fail(this.consumer.consumerId, this.key, errorMessage)
    }
}
