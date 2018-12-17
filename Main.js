const expect = require('chai').expect;
const PubSub = require('/PubSub.js');

describe('PubSub', () => {

  describe('subscriptions', () => {
    const { subscribers } = new PubSub();
    it('should be initialized as an empty object', () => {
      expect(subscribers).to.be.an('object');
      expect(subscribers).to.be.empty;
    });
  });

  describe('history', () => {
    const { history } = new PubSub();
    it('should be initialized as an empty object', () => {
      expect(history).to.be.an('object');
      expect(history).to.be.empty;
    });
  });

  describe('subscribe', () => {
    const pubsub = new PubSub();
    const { subscribers } = pubsub;
    const listener1 = msg => console.log('listener1: ' + msg);
    const listener2 = msg => console.log('listener2: ' + msg);
    const topic = 'foo';
    pubsub.subscribe(topic, listener1);

    it('should add a new topic to subscribe to', () => {
      expect(subscribers).to.have.a.property(topic);
      expect(subscribers[topic]).to.be.an('array');
      expect(subscribers[topic]).to.have.lengthOf(1);
    });

    it('should add a listener that subscribes to a given topic', () => {
      subscribers[topic].forEach(subscriber => {
        expect(subscriber).to.be.an('object');
        expect(subscriber.listener).to.be.a('function');
      });
    });

    it('should have listeners default to subscribing to one message', () => {
      subscribers[topic].forEach(subscriber => {
        expect(subscriber.numMessages).to.be.a('number');
        expect(subscriber.numMessages).to.equal(1);
      })
    });

    it('should allow listeners to subscribe to a dynamic number of messages', () => {
      pubsub.subscribe(topic, listener2, 2);
      const subscriber = subscribers[topic][1];
      expect(subscriber.numMessages).to.equal(2);
    });

    it('should add a new topic to message history', () => {
      const { history } = pubsub
      expect(history).to.have.property(topic);
      expect(history[topic]).to.be.an('array');
      expect(history[topic]).to.be.empty;
    });
  });

  describe('publish', () => {
    const publishedMessages = [];
    const pubsub = new PubSub();
    const { history } = pubsub;
    const listener1 = msg => publishedMessages.push('listener1: ' + msg);
    const listener2 = msg => publishedMessages.push('listener2: ' + msg);
    const listener3 = msg => publishedMessages.push('listener3: ' + msg);
    pubsub.subscribe('foo', listener1);
    pubsub.subscribe('foo', listener2);
    pubsub.subscribe('bar', listener2);
    pubsub.publish('foo', 'hello');
    pubsub.publish('bar', 'world');

    it('should not publish a message if the topic does not exist', () => {
      expect(() => pubsub.publish('baz', 'howdy ho!')).to.throw();
    });

    it('should call back each listener that is subscribed to a topic with the published message', () => {
      expect(publishedMessages).to.deep.equal([
        'listener1: hello',
        'listener2: hello',
        'listener2: world'
      ]);
    });

    it('should record a history of messages delivered to a topic', () => {
      expect(history['foo']).to.deep.equal(['hello']);
      expect(history['bar']).to.deep.equal(['world']);
    });

  
  });


});
