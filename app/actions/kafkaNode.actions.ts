import kafka from 'kafka-node';
import * as _ from 'lodash';

export const getConsumerGroupDescriptions = (groudIds: string[], topic: string='', onComplete: (res:any) => void) => {
  console.log("groupIds:", groudIds)
  const client = new kafka.KafkaClient({kafkaHost: '10.179.6.108:9092,10.179.5.71:9092,10.179.5.203:9092'});
  const kafkaAdmin = new kafka.Admin(client);

  kafkaAdmin.describeGroups(groudIds, (err, descriptions) => {
    descriptions = Object.values(descriptions).map(gDescript => {
        gDescript.topic = _.uniq(
          gDescript.members
            .map(member => member.memberMetadata.subscription)
            .flat()
        );
        return gDescript;
      })
      .filter(group => (topic != null ? group.topic.includes(topic) : true));
    onComplete(descriptions);
  });
};
