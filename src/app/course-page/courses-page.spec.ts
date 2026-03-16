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
  let component: CoursePage;
  let fixture: ComponentFixture<CoursePage>;
  let de: DebugElement;
  let mockCoursesService:any;

  beforeEach(async () => {
    mockCoursesService = {
      findLessons: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CoursePage],
      providers: [
        {provide: CoursesService, useValue: mockCoursesService},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                course: MOCK_COURSES[0]
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursePage);
    de = fixture.debugElement;
    component = fixture.componentInstance;

  });

  it('should load lessons on init', async () => {


  });

});
