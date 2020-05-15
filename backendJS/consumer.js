const kafka = require('kafka-node');
const client = new kafka.KafkaClient();

const Consumer = kafka.Consumer;
const consumer = new Consumer(
    client,
        [
            { topic: 'testTopic', partition: 0 }
        ],
        {
            autoCommit: false
        }
    );
    
consumer.on('message', function (message) {
    console.log(message);
});

