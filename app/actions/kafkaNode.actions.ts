import kafka from 'kafka-node';
import * as _ from 'lodash';

export const getConsumerGroupDescriptions = (clusterUrl, groudIds: string[], topic: string='', onComplete: (res:any) => void) => {
  const client = new kafka.KafkaClient({kafkaHost: clusterUrl});
  const kafkaAdmin = new kafka.Admin(client);

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
