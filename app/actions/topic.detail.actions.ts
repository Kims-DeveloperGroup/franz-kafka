import {Dispatch, GetState} from '../reducers/types';
import {Admin} from "kafkajs";
import * as _ from 'lodash'
import {getConsumerGroupDescriptions} from "./kafkaNode.actions";

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
      res.forEach(part => partitions[part.partition] = part);
      return partitions;
    });


const getTopicMeta = (admin: Admin, topic: string) =>
  admin
    .fetchTopicMetadata({topics: [topic]})
    .then(res => {
    const partitions = {};
    res.topics[0] &&
      res.topics[0].partitions.forEach(
        part => (partitions[part.partitionId] = part));
        return partitions;
    });


export const getTopicDetails = (topic: string) =>
  (dispatch: Dispatch, getState: GetState) => {
    const groupNames = getState().consumerGroups.map(group => group.groupId);
    let admin = getState().kafka.admin();
    return Promise.all([getTopicMeta(admin, topic), getTopicOffset(admin, topic)])
      .then(result => {
        const partition = Object.values(result[0]).map(part => {
          part.offset = result[1][part.partitionId];
          return part;
        });
        getConsumerGroupDescriptions(groupNames, topic, (res) => dispatch(topicDetail(topic, partition, res)))
      })
  };

