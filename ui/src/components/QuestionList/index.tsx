/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { FC } from 'react';
import { ListGroup } from 'react-bootstrap';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { pathFactory } from '@/router/pathFactory';
import {
  Tag,
  Pagination,
  FormatTime,
  Empty,
  BaseUserCard,
  QueryGroup,
  QuestionListLoader,
  Counts,
  Icon,
} from '@/components';
import * as Type from '@/common/interface';
import { useSkeletonControl } from '@/hooks';

export const QUESTION_ORDER_KEYS: Type.QuestionOrderBy[] = [
  'newest',
  'active',
  'unanswered',
  'recommend',
  'frequent',
  'score',
];
interface Props {
  source: 'questions' | 'tag' | 'linked';
  order?: Type.QuestionOrderBy;
  data;
  orderList?: Type.QuestionOrderBy[];
  isLoading: boolean;
}

const QuestionList: FC<Props> = ({
  source,
  order,
  data,
  orderList,
  isLoading = false,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'question' });
  const [urlSearchParams] = useSearchParams();
  const { isSkeletonShow } = useSkeletonControl(isLoading);
  const curOrder =
    order || urlSearchParams.get('order') || QUESTION_ORDER_KEYS[0];
  const curPage = Number(urlSearchParams.get('page')) || 1;
  const pageSize = 20;
  const count = data?.count || 0;
  const orderKeys = orderList || QUESTION_ORDER_KEYS;

  return (
    <div>
      <div className="mb-3 d-flex flex-wrap justify-content-between">
        <h5 className="fs-5 text-nowrap mb-3 mb-md-0">
          {source === 'questions'
            ? t('all_questions')
            : t('x_questions', { count })}
        </h5>
        <QueryGroup
          data={orderKeys}
          currentSort={curOrder}
          pathname={source === 'questions' ? '/questions' : ''}
          i18nKeyPrefix="question"
          maxBtnCount={source === 'tag' ? 3 : 4}
        />
      </div>
      <ListGroup className="rounded-0">
        {isSkeletonShow ? (
          <QuestionListLoader />
        ) : (
          data?.list?.map((li) => {
            return (
              <ListGroup.Item
                key={li.id}
                className="bg-transparent py-3 px-2 border-start-0 border-end-0">
                <div className="d-flex flex-wrap text-secondary small mb-12">
                  <BaseUserCard
                    data={li.operator}
                    className="me-1"
                    avatarClass="me-2"
                  />
                  •
                  <FormatTime
                    time={
                      curOrder === 'active' ? li.operated_at : li.created_at
                    }
                    className="text-secondary ms-1 flex-shrink-0"
                    preFix={
                      curOrder === 'active' ? t(li.operation_type) : t('asked')
                    }
                  />
                </div>
                <h5 className="text-wrap text-break">
                  {li.pin === 2 && (
                    <Icon
                      name="pin-fill"
                      className="me-1"
                      title={t('pinned', { keyPrefix: 'btns' })}
                    />
                  )}
                  <NavLink
                    to={pathFactory.questionLanding(li.id, li.url_title)}
                    className="link-dark">
                    {li.title}
                    {li.status === 2 ? ` [${t('closed')}]` : ''}
                  </NavLink>
                </h5>
                <p className="mb-2 small text-body text-truncate-2">
                  {li.description}
                </p>

                <div className="question-tags mb-2">
                  {Array.isArray(li.tags)
                    ? li.tags.map((tag, index) => {
                        return (
                          <Tag
                            key={tag.slug_name}
                            className={`${li.tags.length - 1 === index ? '' : 'me-1'}`}
                            data={tag}
                          />
                        );
                      })
                    : null}
                </div>
                <div className="small text-secondary">
                  <Counts
                    data={{
                      votes: li.vote_count,
                      answers: li.answer_count,
                      views: li.view_count,
                    }}
                    isAccepted={li.accepted_answer_id >= 1}
                    className="mt-2 mt-md-0"
                  />
                </div>
              </ListGroup.Item>
            );
          })
        )}
      </ListGroup>
      {count <= 0 && !isLoading && <Empty />}
      <div className="mt-4 mb-2 d-flex justify-content-center">
        <Pagination
          currentPage={curPage}
          totalSize={count}
          pageSize={pageSize}
          pathname={source === 'questions' ? '/questions' : ''}
        />
      </div>
    </div>
  );
};
export default QuestionList;
