
const kafka = require('kafka-node');
const Producer = kafka.Producer;
const client = new kafka.KafkaClient();
const producer = new Producer(client);
    
const payloads = [
    { topic: 'testTopic', messages: 'New sale happened', partition: 0 }
];
    
producer.send(payloads, function(error, data) {
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
});