const RecievedMessage = require("./recvdMsg")
var events = require('events');
class Consumer {
    constructor(cqClient, consumerId) {
        this.cqClient = cqClient;
        this.consumerId = consumerId;
        this.events = new events.EventEmitter();
    }
    /**
     * Initiate a consumer 
     * @param {String} consumerId 
     * @param {Array} topics List of topics 
     * @param {Number} concurrency Consumer pull concurrency , if sent to 0 or -1 concurrency will be unlimited 
     */
    async init(topics, concurrency) {
        try {
            let exists = await this.cqClient.command.consumer_exists(this.consumerId);
            if (exists.value == 'false') {
                let res = await this.cqClient.command.consumer_create(this.consumerId, topics.join(","), concurrency)

                if (res.error) {
                    console.error(res)
                    return res.error
                }
                else {
                    await this.Subscribe()
                    return;
                }
            }
            else {
                this.cqClient.command.consumer_topics_set(this.consumerId, topics.join(","))
                this.cqClient.command.consumer_concurrency_set(this.consumerId, concurrency)
                await this.Subscribe();
                console.info("Consumer exists and will update topics and concurrency as set now. Make sure no other client is using this consumer.")
            }
            return;

        } catch (e) {
            throw e;
        }
    }

    /**
     * Get Consumer topics
     */

    async getTopics() {
        try {
            return await this.cqClient.command.consumer_topics_get(this.consumerId)
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
            return await this.cqClient.command.consumer_topics_set(this.consumerId, topics)
        } catch (e) {
            throw e
        }
    }

    /**
     * Get consumer messages counts grouped by status
     */

    async messageCountByStatus() {
        try {
            return await this.cqClient.command.msg_counts(this.consumerId)
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
            if (concurrencyCheck) {
                try{
                    let resMsg = await this.cqClient.command.msg_pull(this.consumerId);
                    if (!resMsg.error) {
                        let parsedMsg = JSON.parse(resMsg.value)
                        let recMsg = new RecievedMessage(this, parsedMsg.key, parsedMsg)
                        this.events.emit("message", recMsg)
                        return recMsg
                    }
                    else {
                      throw resMsg.error
                    }

                }catch(e){
                    throw e
                }
            } else {
               return "Concurrency Limit Reached. "
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
            return await this.cqClient.command.msg_complete(this.consumerId, messageId)
        } catch (e) {
            throw e
        }
    };

    /**
     * 
     * @param {String} status status string  either failed or completed; 
     */

    async flushMessages(status) {
        try {
            status = status == 'completed' ? 'complete' : status;
            return await this.cqClient.command[`consumer_flush_${status}`](this.consumerId)
            throw new Error("Consumer Doesn't exists")

        } catch (e) {
            throw e
        }
    }
    /**
     * Retry failed messages
     * @param {String} messageId retry failed message/messages if not sent it will retry all messages 
     */

    async retryMessages(messageId) {
        try {
            if (messageId) {
                return await this.cqClient.command.msg_retry(this.consumerId, messageId);
            } else {
                return await this.cqClient.command.msg_retryall(this.consumerId);
            }

        } catch (e) {
            throw e
        }
    }
    /**
     * Change message status into failed 
     * @param {String} messageId 
     * @param {String} errorMessage Reason why this message set to failed
     */

    async failMessage(messageId, errorMessage) {
        try {
            return await this.cqClient.command.msg_fail(this.consumerId, messageId, errorMessage);
        } catch (e) {
            throw e
        }
    };
    /**
     * Change consumer concurrency
     * @param {Number} concurrency 
     */

    async updateConcurrency(concurrency) {
        try {
            return await this.cqClient.command.consumer_concurrency_set(this.consumerId, concurrency)

        } catch (e) {
            throw e
        }
    }
    /**
     * Check concurrency status
     * @returns Boolean
     */
    async concurrencyOk() {
        try {
            let result = await this.cqClient.command.consumer_concurrency_ok(this.consumerId)
            return result.value == 'true';
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

    async Subscribe() {
        await this.cqClient.redisSubscriber.subscribe(this.consumerId, (err, count) => {
            if (err) {
                console.error(err)
            }
        });
        this.cqClient.redisSubscriber.on("message", (async function (channel, subMsg) {
            if (subMsg.split(":")[0] == "pendingCount") {
                let msgCount = Number(subMsg.split(":")[1])
                if (msgCount > 0) {
                    for (let m = 0; m <= msgCount; m++) {
                        try {
                            await this.pull()
                        }
                        catch (err) {
                            console.error(err) 
                        }
                    }
                }
            }
            else {
                try {
                    await this.pull()
                }
                catch (err) {
                       console.error(err) 
                }
            }
        }).bind(this))
    }
};

module.exports =Consumer;