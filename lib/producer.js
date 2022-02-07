const CRIMSONQ = require("./crimsonq");

class Producer {
	constructor(crimsonQConnectionSettings) {
		this.cqClient = new CRIMSONQ(crimsonQConnectionSettings);
	}
	/**
	 * Send messages to the consumer queue 
	 * @param {string} consumerId 
	 * @param {string} message 
	 */
	async pushToConsumer(consumerId, message) {
		try{
			var exists = await this.cqClient.command.exists(consumerId)
			if(exists){
				await this.cqClient.command['']('msg.push.consumer', {consumerId, message})
			}
		}catch(e){
			console.log("here!!!!");
			throw e
		}
	}

	/**
	 * Send message to the topic queue
	 * @param {string} topic 
	 * @param {string} message 
	 */
	async pushToTopic(topic, message) {
		this.crimsonQConnection.msg.push.topic(topic, message)
	}

}

module.exports = Producer