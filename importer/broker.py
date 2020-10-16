import functools
import json
import logging
import pika

LOGGER = logging.getLogger(__name__)
AMQP_URL = 'amqp://guest:guest@127.0.0.1:5672/%2F'
EXCHANGE = 'statement.exchange'
EXCHANGE_TYPE = 'direct'
EXCHANGE_DURABLE = True
IMPORT_QUEUE = 'statement.import'
EXPORT_QUEUE = 'statement.export'
IMPORT_ROUTING_KEY = 'routing.key.import'
EXPORT_ROUTING_KEY = 'routing.key.export'
APP_ID = 'vister-messaging'
PUBLISH_CONTENT_TYPE = 'application/json'

""" 
https://github.com/pika/pika/blob/master/examples/asynchronous_consumer_example.py 
https://github.com/pika/pika/blob/master/examples/asynchronous_publisher_example.py
"""


class Broker(object):

    def __init__(self, consume_message):

        # Setup
        self.should_reconnect = False
        self._connection = None
        self._channel = None
        self._closing = False

        # Publishing
        self._deliveries = []
        self._acked = None
        self._nacked = None
        self._published_count = 0

        # Consuming
        self._consume_message = consume_message
        self._consumer_tag = None
        self._consuming = False
        self.was_consuming = False

        # In production, experiment with higher prefetch values
        # for higher consumer throughput
        self._prefetch_count = 1

    def connect(self):
        LOGGER.info('Connecting to %s', AMQP_URL)
        return pika.SelectConnection(
            parameters=pika.URLParameters(AMQP_URL),
            on_open_callback=self.on_connection_open,
            on_open_error_callback=self.on_connection_open_error,
            on_close_callback=self.on_connection_closed)

    def run(self):
        self._connection = self.connect()
        self._connection.ioloop.start()

    def setup_exchange(self, exchange_name, exchange_type, exchange_durable):
        LOGGER.info('Declaring exchange: %s', exchange_name)
        cb = functools.partial(self.on_exchange_declareok, userdata=exchange_name)
        self._channel.exchange_declare(
            durable=exchange_durable,
            exchange=exchange_name,
            exchange_type=exchange_type,
            callback=cb)

    def on_exchange_declareok(self, _unused_frame, userdata):
        LOGGER.info('Declared exchange: %s', userdata)
        self.setup_queue(IMPORT_QUEUE, IMPORT_ROUTING_KEY, self.on_queue_declareok)
        self.setup_queue(EXPORT_QUEUE, EXPORT_ROUTING_KEY, None)

    def setup_queue(self, queue_name, routing_key, callback):
        LOGGER.info('Declaring queue %s', queue_name)
        cb = None
        if callback:
            cb = functools.partial(callback, queue_name=queue_name, routing_key=routing_key)
        self._channel.queue_declare(queue=queue_name, callback=cb)

    def on_queue_declareok(self, _unused_frame, queue_name, routing_key):
        LOGGER.info('Binding %s to %s with %s', EXCHANGE, queue_name, IMPORT_ROUTING_KEY)
        cb = functools.partial(self.on_bindok, userdata=queue_name)
        self._channel.queue_bind(queue_name, EXCHANGE, routing_key=routing_key, callback=cb)

    def on_bindok(self, _unused_frame, userdata):
        LOGGER.info('Queue bound: %s', userdata)
        self.set_qos()

    def set_qos(self):
        self._channel.basic_qos(
            prefetch_count=self._prefetch_count,
            callback=self.on_basic_qos_ok)

    def on_basic_qos_ok(self, _unused_frame):
        LOGGER.info('QOS set to: %d', self._prefetch_count)
        self.start_consuming()

    def start_consuming(self):
        LOGGER.info('Issuing consumer related RPC commands')
        self._channel.add_on_cancel_callback(self.on_consumer_cancelled)
        self._consumer_tag = self._channel.basic_consume(IMPORT_QUEUE, self.on_message)
        self.was_consuming = True
        self._consuming = True

    def on_message(self, _unused_channel, basic_deliver, properties, body):
        LOGGER.info('Received message #%s from %s, type: %s', basic_deliver.delivery_tag, properties.app_id,
                    properties.headers)
        self._consume_message(self, properties.headers, body)
        self.acknowledge_message(basic_deliver.delivery_tag)

    def acknowledge_message(self, delivery_tag):
        LOGGER.info('Acknowledging message %s', delivery_tag)
        self._channel.basic_ack(delivery_tag)

    def on_consumer_cancelled(self, method_frame):
        LOGGER.info('Consumer was cancelled remotely, shutting down: %r', method_frame)
        if self._channel:
            self._channel.close()

    def on_connection_open(self, _unused_connection):
        LOGGER.info('Connection opened')
        self.open_channel()

    def on_connection_open_error(self, _unused_connection, err):
        LOGGER.error('Connection open failed: %s', err)
        self.reconnect()

    def on_connection_closed(self, _unused_connection, reason):
        self._channel = None
        if self._closing:
            self._connection.ioloop.stop()
        else:
            LOGGER.warning('Connection closed, reconnect necessary: %s', reason)
            self.reconnect()

    def reconnect(self):
        self.should_reconnect = True
        self.stop()

    def open_channel(self):
        LOGGER.info('Creating a new channel')
        self._connection.channel(on_open_callback=self.on_channel_open)

    def on_channel_open(self, channel):
        LOGGER.info('Channel opened')
        self._channel = channel
        self._channel.add_on_close_callback(self.close_connection)
        self.setup_exchange(EXCHANGE, EXCHANGE_TYPE, EXCHANGE_DURABLE)

    def close_connection(self, channel, reason):
        self._consuming = False
        if self._connection.is_closing or self._connection.is_closed:
            LOGGER.info('Connection is closing or already closed')
        else:
            LOGGER.info('Closing connection')
            self._connection.close()

    def stop(self):
        if not self._closing:
            self._closing = True
            LOGGER.info('Stopping')
            if self._consuming:
                self.stop_consuming()
                self._connection.ioloop.start()
            else:
                self._connection.ioloop.stop()
            LOGGER.info('Stopped')

    def stop_consuming(self):
        if self._channel:
            LOGGER.info('Sending a Basic.Cancel RPC command to RabbitMQ')
            cb = functools.partial(self.on_cancelok, userdata=self._consumer_tag)
            self._channel.basic_cancel(self._consumer_tag, cb)

    def on_cancelok(self, _unused_frame, userdata):
        self._consuming = False
        LOGGER.info('RabbitMQ acknowledged the cancellation of the consumer: %s', userdata)
        self.close_channel()

    def close_channel(self):
        LOGGER.info('Closing the channel')
        self._channel.close()

    def enable_delivery_confirmations(self):
        LOGGER.info('Issuing Confirm.Select RPC command')
        self._channel.confirm_delivery(self.on_delivery_confirmation)

    def on_delivery_confirmation(self, method_frame):
        confirmation_type = method_frame.method.NAME.split('.')[1].lower()
        LOGGER.info('Received %s for delivery tag: %i', confirmation_type, method_frame.method.delivery_tag)
        if confirmation_type == 'ack':
            self._acked += 1
        elif confirmation_type == 'nack':
            self._nacked += 1
        self._deliveries.remove(method_frame.method.delivery_tag)
        LOGGER.info(
            'Published %i messages, %i have yet to be confirmed, '
            '%i were acked and %i were nacked', self._published_count,
            len(self._deliveries), self._acked, self._nacked)

    def publish_message(self, headers, body):
        LOGGER.info("Trying to publish: %s", self._channel.is_open)
        if self._channel is None or not self._channel.is_open:
            return

        LOGGER.info("Publishing")

        properties = pika.BasicProperties(
            app_id=APP_ID,
            content_type=PUBLISH_CONTENT_TYPE,
            headers=headers)

        self._channel.basic_publish(EXCHANGE, IMPORT_ROUTING_KEY,
                                    json.dumps(body, ensure_ascii=False),
                                    properties)
        self._published_count += 1
        self._deliveries.append(self._published_count)  # TODO
        LOGGER.info('Published message # %i', self._published_count)
