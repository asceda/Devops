const amqp = require('amqplib');
const express = require("express");
const queueName = 'default-queue';
const body = require('body-parser');
const app = express();

async function sendMessage(message) {
  const connection = await amqp.connect('amqp://172.18.0.7');
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  channel.sendToQueue(queueName, Buffer.from(message));
  return channel;
}

app.post('/student/add', (req, res) => {
  const { name, puan } = req.body;
  const data = { name: name, puan: puan }
  const dataJson = JSON.stringify(data);
  sendMessage(dataJson)
  return res.status(200).json({
      message: "Insertion successful.",
      student: data
  });
});


app.listen(3001, () => {
  console.log('Server is running on port.');
});
