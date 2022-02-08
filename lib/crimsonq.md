## Classes

<dl>
<dt><a href="#Consumer">Consumer</a></dt>
<dd><p>The Consumer Class Object creates a consumer class that exposes consumer functions.</p>
</dd>
<dt><a href="#Producer">Producer</a></dt>
<dd><p>The Producer Class Object creates a Producer class that exposes producer functions.</p>
</dd>
<dt><a href="#RecievedMessage">RecievedMessage</a></dt>
<dd><p>The messages Class Object creates a messages class that exposes messages functions.</p>
</dd>
</dl>

<a name="Consumer"></a>

## Consumer
The Consumer Class Object creates a consumer class that exposes consumer functions.

**Kind**: global class  

* [Consumer](#Consumer)
    * [.init(consumerId, topics, concurrency)](#Consumer+init)
    * [.getTopics()](#Consumer+getTopics)
    * [.setTopics(topics)](#Consumer+setTopics)
    * [.messageCountByStatus()](#Consumer+messageCountByStatus)
    * [.pull()](#Consumer+pull)
    * [.completeMessage(messageId)](#Consumer+completeMessage)
    * [.flushMessages(status)](#Consumer+flushMessages)
    * [.retryMessages(messageId)](#Consumer+retryMessages)
    * [.failMessage(messageId, errorMessage)](#Consumer+failMessage)
    * [.updateConcurrency(concurrency)](#Consumer+updateConcurrency)
    * [.concurrencyOk()](#Consumer+concurrencyOk) ⇒
    * [.ping()](#Consumer+ping) ⇒

<a name="Consumer+init"></a>

### consumer.init(consumerId, topics, concurrency)
Initiate a consumer

**Kind**: instance method of [<code>Consumer</code>](#Consumer)  

| Param | Type | Description |
| --- | --- | --- |
| consumerId | <code>String</code> |  |
| topics | <code>Array</code> | List of topics |
| concurrency | <code>Number</code> | Consumer pull concurrency , if sent to 0 or -1 concurrency will be unlimited |

<a name="Consumer+getTopics"></a>

### consumer.getTopics()
Get Consumer topics

**Kind**: instance method of [<code>Consumer</code>](#Consumer)  
<a name="Consumer+setTopics"></a>

### consumer.setTopics(topics)
Update or set consumer topics

**Kind**: instance method of [<code>Consumer</code>](#Consumer)  

| Param | Type | Description |
| --- | --- | --- |
| topics | <code>String</code> | List of all consumer topics comma separated with no spaces |

<a name="Consumer+messageCountByStatus"></a>

### consumer.messageCountByStatus()
Get consumer messages counts grouped by status

**Kind**: instance method of [<code>Consumer</code>](#Consumer)  
<a name="Consumer+pull"></a>

### consumer.pull()
Pull Consumer Messages

**Kind**: instance method of [<code>Consumer</code>](#Consumer)  
<a name="Consumer+completeMessage"></a>

### consumer.completeMessage(messageId)
Complete a message from consumer

**Kind**: instance method of [<code>Consumer</code>](#Consumer)  

| Param | Type | Description |
| --- | --- | --- |
| messageId | <code>String</code> | Message should be pulled first |

<a name="Consumer+flushMessages"></a>

### consumer.flushMessages(status)
**Kind**: instance method of [<code>Consumer</code>](#Consumer)  

| Param | Type | Description |
| --- | --- | --- |
| status | <code>String</code> | status string  either failed or completed; |

<a name="Consumer+retryMessages"></a>

### consumer.retryMessages(messageId)
Retry failed messages

**Kind**: instance method of [<code>Consumer</code>](#Consumer)  

| Param | Type | Description |
| --- | --- | --- |
| messageId | <code>String</code> | retry failed message/messages if not sent it will retry all messages |

<a name="Consumer+failMessage"></a>

### consumer.failMessage(messageId, errorMessage)
Change message status into failed

**Kind**: instance method of [<code>Consumer</code>](#Consumer)  

| Param | Type | Description |
| --- | --- | --- |
| messageId | <code>String</code> |  |
| errorMessage | <code>String</code> | Reason why this message set to failed |

<a name="Consumer+updateConcurrency"></a>

### consumer.updateConcurrency(concurrency)
Change consumer concurrency

**Kind**: instance method of [<code>Consumer</code>](#Consumer)  

| Param | Type |
| --- | --- |
| concurrency | <code>Number</code> | 

<a name="Consumer+concurrencyOk"></a>

### consumer.concurrencyOk() ⇒
Check concurrency status

**Kind**: instance method of [<code>Consumer</code>](#Consumer)  
**Returns**: Boolean  
<a name="Consumer+ping"></a>

### consumer.ping() ⇒
The good old Ping with a message, helps you debug your connection.

**Kind**: instance method of [<code>Consumer</code>](#Consumer)  
**Returns**: Pong! CrimsonQ  
<a name="Producer"></a>

## Producer
The Producer Class Object creates a Producer class that exposes producer functions.

**Kind**: global class  

* [Producer](#Producer)
    * [new Producer(cqClient)](#new_Producer_new)
    * [.pushToConsumer(consumerId, message)](#Producer+pushToConsumer)
    * [.pushToTopic(topic, message)](#Producer+pushToTopic)
    * [.ping()](#Producer+ping) ⇒

<a name="new_Producer_new"></a>

### new Producer(cqClient)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| cqClient | <code>CrimsonQClient</code> | The CrimsonQ client for Producer to use as a connection |

<a name="Producer+pushToConsumer"></a>

### producer.pushToConsumer(consumerId, message)
Send messages to the consumer queue

**Kind**: instance method of [<code>Producer</code>](#Producer)  

| Param | Type | Description |
| --- | --- | --- |
| consumerId | <code>string</code> | The consumer Id that will recieve the message |
| message | <code>Object</code> | The message object that needs to be pushed to consumers |

<a name="Producer+pushToTopic"></a>

### producer.pushToTopic(topic, message)
Send message to the topic queue

**Kind**: instance method of [<code>Producer</code>](#Producer)  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic that will be used to send to consumers listening to the topic. The topic can have MQTT style wildcards. |
| message | <code>Object</code> | The message object that needs to be pushed to consumers |

<a name="Producer+ping"></a>

### producer.ping() ⇒
The good old Ping with a message, helps you debug your connection.

**Kind**: instance method of [<code>Producer</code>](#Producer)  
**Returns**: Pong! CrimsonQ  
<a name="RecievedMessage"></a>

## RecievedMessage
The messages Class Object creates a messages class that exposes messages functions.

**Kind**: global class  

* [RecievedMessage](#RecievedMessage)
    * [.done()](#RecievedMessage+done)
    * [.fail(errorMessage)](#RecievedMessage+fail)

<a name="RecievedMessage+done"></a>

### recievedMessage.done()
Complete Message

**Kind**: instance method of [<code>RecievedMessage</code>](#RecievedMessage)  
<a name="RecievedMessage+fail"></a>

### recievedMessage.fail(errorMessage)
Set failed message

**Kind**: instance method of [<code>RecievedMessage</code>](#RecievedMessage)  

| Param | Type |
| --- | --- |
| errorMessage | <code>String</code> | 

