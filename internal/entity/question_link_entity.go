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

package entity

import (
	"time"
)

const (
	QuestionLinkStatusAvailable = 1
	QuestionLinkStatusDeleted   = 2
)

type QuestionLink struct {
	ID             string    `xorm:"not null pk autoincr BIGINT(20) id"`
	CreatedAt      time.Time `xorm:"not null default CURRENT_TIMESTAMP TIMESTAMP created_at"`
	UpdatedAt      time.Time `xorm:"updated_at TIMESTAMP"`
	FromQuestionID string    `xorm:"not null default 0 BIGINT(20) index from_question_id"`
	FromAnswerID   string    `xorm:"BIGINT(20) from_answer_id"`
	ToQuestionID   string    `xorm:"not null default 0 BIGINT(20) index to_question_id"`
	ToAnswerID     string    `xorm:"BIGINT(20) to_answer_id"`
	Status         int       `xorm:"not null default 1 INT(11) status"`
}

func (QuestionLink) TableName() string {
	return "question_link"
}
