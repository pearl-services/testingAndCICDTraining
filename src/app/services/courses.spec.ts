
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve all courses', async () => {

    const coursesPromise = service.reloadAllCourses();

    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toBe("GET");
    req.flush({payload: MOCK_COURSES});

    const result = await coursesPromise;

    expect(result).toBe(MOCK_COURSES);
    expect(service.allCourses()).toEqual(MOCK_COURSES);
  });


});




