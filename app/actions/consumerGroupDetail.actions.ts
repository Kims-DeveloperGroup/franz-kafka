import {Dispatch, GetState} from '../reducers/types';
import {Admin, GroupOverview} from "kafkajs";

export const CONSUMER_GROUP_DETAIL = 'CONSUMER_GROUP_DETAIL';

export function consumerGroupDetail(groupDetail: GroupOverview) {
  return {
    type: CONSUMER_GROUP_DETAIL,
    groupDetail
  }
}

export function getConsumerGroupDetail(groupId: string, topic: string) {
  console.log("topic:", topic);
  return (dispatch: Dispatch, getState: GetState) => {
    const admin = getState().kafka.client.admin();

    return Promise.all([admin.describeGroups([groupId]), getConsumerGroupOffset(admin, topic, groupId)])
      .then(res => {
        const groupDescript = res[0].groups[0];
        groupDescript.offset = res[1];
        dispatch(consumerGroupDetail(groupDescript));
      })
  };
}

const getConsumerGroupOffset = (admin: Admin, topic: string, groupId: string) =>
  Promise.all([
    admin.fetchOffsets({groupId, topic})
      .then(res => {
        const partitions = {};
        res.forEach(offset => partitions[offset.partition] = offset)
        return partitions;
      }),
    getTopicOffset(admin, topic)
  ]).then(result => {
    const merged = Object.values(result[0]).map(part => {
      part.topicOffset = result[1][part.partition];
      return part;
    });
    return merged;
  });

const getTopicOffset = (admin: Admin, topic: string) =>
  admin
    .fetchTopicOffsets(topic)
    .then(res => {
      const partitions = {};
      res.forEach(part => partitions[part.partition]  = part);
      return partitions;
    });
