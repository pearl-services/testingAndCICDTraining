
import {describe, it, beforeEach, afterEach, expect} from 'vitest';
import {CoursesService} from './courses.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {Course} from '../model/course';
import {createCourse, MOCK_COURSES} from '../testing/testing-data';
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';

describe('CoursesService', () => {
  let service: CoursesService;
  let httpTestingController: HttpTestingController;

  const mockCourse: Course = MOCK_COURSES[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve all courses', async () => {

  });


});
