## Classes

<dl>
<dt><a href="#CrimsonQClient">CrimsonQClient</a></dt>
<dd><p>The Class Object for the CrimsonQ Client</p>
</dd>
<dt><a href="#Producer">Producer</a></dt>
<dd><p>The Producer Class Object creates a Producer class that exposes producer functions.</p>
</dd>
</dl>

<a name="CrimsonQClient"></a>

## CrimsonQClient
The Class Object for the CrimsonQ Client

**Kind**: global class  

* [CrimsonQClient](#CrimsonQClient)
    * [new CrimsonQClient(settings)](#new_CrimsonQClient_new)
    * [.init()](#CrimsonQClient+init)

<a name="new_CrimsonQClient_new"></a>

### new CrimsonQClient(settings)
Construct a new CrimsonQClient


| Param | Type | Description |
| --- | --- | --- |
| settings | <code>object</code> | The settings for the CrimsonQ connection as {url:"crimsonq://:crimsonQ!@127.0.0.1:9001"} |

<a name="CrimsonQClient+init"></a>

### crimsonQClient.init()
Initiate the CrimsonQ client, gets the commands from the server and generates the commands as functions

**Kind**: instance method of [<code>CrimsonQClient</code>](#CrimsonQClient)  
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

| Param | Type | Description |
| --- | --- | --- |
| cqClient | [<code>CrimsonQClient</code>](#CrimsonQClient) | The CrimsonQ client for Producer to use as a connection |

<a name="Producer+pushToConsumer"></a>

### producer.pushToConsumer(consumerId, message)
Send messages to the consumer queue

**Kind**: instance method of [<code>Producer</code>](#Producer)  

| Param | Type | Description |
| --- | --- | --- |
| consumerId | <code>string</code> | The consumer Id that will recieve the message |
| message | <code>string</code> | The message as a string |

<a name="Producer+pushToTopic"></a>

### producer.pushToTopic(topic, message)
Send message to the topic queue

**Kind**: instance method of [<code>Producer</code>](#Producer)  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic that will be used to send to consumers listening to the topic. The topic can have MQTT style wildcards. |
| message | <code>string</code> | The message as a string to be sent to the consumers |

<a name="Producer+ping"></a>

### producer.ping() ⇒
The good old Ping with a message, helps you debug your connection.

**Kind**: instance method of [<code>Producer</code>](#Producer)  
**Returns**: Pong! CrimsonQ  
