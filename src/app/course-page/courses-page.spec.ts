import {beforeEach, describe, expect, it, vi} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {getMockLessonsPage, MOCK_COURSES, MOCK_LESSONS} from '../testing/testing-data';
import {CoursesService} from '../services/courses.service';
import {CoursePage} from './course-page';
import {ActivatedRoute} from '@angular/router';
import {By} from '@angular/platform-browser';
import {clickButton, getTableContent} from "../testing/testing-utils";


const FIRST_PAGE = getMockLessonsPage(1, '', 'asc', 0, 3);
const SECOND_PAGE = getMockLessonsPage(1, '', 'asc', 1, 3);
const SEARCH_RESULTS = getMockLessonsPage(1, 'Lesson 20', 'asc',0, 3);

describe('CoursePage', () => {

  beforeEach(async () => {


  });

  it('should load lessons on init', async () => {


  });

});
