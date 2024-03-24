const express = require("express");
const mysql = require("mysql2")
const amqp = require('amqplib');
const app = express();

const connection = mysql.createPool({
  connectionLimit: 100,
  host: "mysql-service",
  user: "root",
  password: "password",
  database: "devopsakademi",
});

connection.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection error: ", err);
  } else {
    console.log("Database connected");
  }
});

const queueName = 'messages';

async function RabbitMq() {
  try {
    const connection = await amqp.connect('amqp://172.18.0.7');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });

    channel.consume(queueName, async (message) => {
      if (message !== null) {
        try {
          const data = JSON.parse(message.content.toString());
          const { name, puan } = data;

          const result = await dbConnection.query(
            `INSERT INTO student (name, puan) VALUES ($1, $2)`, [name, puan]);

          if (result.rowCount === 1) {
            console.log('Data inserted succesfully.');
            channel.ack(message);
          } else {
            console.error('Database query error:', result.errorMessage);
              }
        } 
        catch (error) {
          console.error('Database query error:', error);
        }
      }
    });  } catch (error) {
    console.error('Error:', error);
  }
}

RabbitMq();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
})