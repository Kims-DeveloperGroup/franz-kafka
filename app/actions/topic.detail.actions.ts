import {Dispatch, GetState} from '../reducers/types';
import {Admin} from "kafkajs";
import * as _ from 'lodash'

export const TOPIC_DETAIL = 'TOPIC_DETAIL';

export function topicDetail(topic, topicMetadata, topicConsumerGroups) {
  return {
    type: TOPIC_DETAIL,
    topic,
    topicMetadata,
    topicConsumerGroups
  }
}

const getTopicOffset = (admin: Admin, topic: string) =>
  admin
    .fetchTopicOffsets(topic)
    .then(res => {
      const partitions = {};
      res.forEach(part => partitions[part.partition]  = part);
      return partitions;
    });


const getTopicMeta = (admin: Admin, topic: string) =>
  admin
    .fetchTopicMetadata({topics: [topic]})
    .then(res => {
      const partitions = {};
      res.topics[0] && res.topics[0].partitions.forEach(part => partitions[part.partitionId] = part);
      return partitions;
    });

const getConsumerGroupDescription = (admin: Admin, groups : string[] = [], topic: string) =>
  admin
    .describeGroups(groups)
    .then(res => res.groups)
    .then(groups => groups.map(group => {
      group.topic = group.members.map(mem => mem.memberMetadata.toString().substring(8, mem.memberMetadata.toString().length - 4));
      group.topic = _.uniq(group.topic);
        return group;
      }).filter(group => group.topic.includes(topic)))

export const getTopicDetails = (topic: string) =>
  (dispatch: Dispatch, getState: GetState) => {
    const groupNames = getState().consumerGroups.map(group => group.groupId);
    let admin = getState().kafka.admin();
    return Promise.all([getTopicMeta(admin, topic), getTopicOffset(admin, topic), getConsumerGroupDescription(admin, groupNames, topic)])
      .then(result => {
        const partition = Object.values(result[0]).map(part => {
          part.offset = result[1][part.partitionId];
          return part;
        });
        dispatch(topicDetail(topic, partition, result[2]))
      })
  };

