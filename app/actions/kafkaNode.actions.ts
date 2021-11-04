import kafka from 'kafka-node';
import * as _ from 'lodash';

export const getConsumerGroupDescriptions = (clusterUrl, groudIds: string[], topic: string='', onComplete: (res:any) => void) => {
  const [url, configString] = clusterUrl.split('?');

  let options = {
    kafkaHost: url,
    connectRetryOptions: {
      retries: 1
    },
    requestTimeout: 1000,
    connectTimeout: 1000
  };

  if (configString) {
    options.sasl = {};
    configString.split('&').forEach(s => {
      const [key, value] = s.split('=');
      const [prefix, postfix] = key.split('.');
      if (prefix === 'sasl') {
        options.sasl[postfix] = value;
      } else {
        options[key] = value;
      }
    });
  }
  const client = new kafka.KafkaClient(options);
  const kafkaAdmin = new kafka.Admin(client);
  onComplete([]);

  kafkaAdmin.describeGroups(groudIds, (err, descriptions) => {
    descriptions = Object.values(descriptions).map(gDescript => {
        gDescript.topic = _.uniq(
          gDescript.members
            .map(member => member.memberMetadata.subscription)
            .flat()
        );
        return gDescript;
      }).filter(group => (topic ? group.topic.includes(topic) : true));
    onComplete(descriptions);
  });
};
