
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

  it('should get course by Id', async () => {
    const coursePromise = service.findCourseById(1);

    const req = httpTestingController.expectOne('/api/courses/1');
    expect(req.request.method).toBe('GET')
    req.flush(MOCK_COURSES[0]);

    const course = await coursePromise;
    expect(course.id).toBe(1);
    expect(course.titles.description).toBe('Beginner Course');
  });


});




