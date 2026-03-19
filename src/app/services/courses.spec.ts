
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

    const promise = service.findAllCourses();

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toBe('GET');
    req.flush({ payload: MOCK_COURSES });

    const result = await promise;

    expect(result).toEqual(MOCK_COURSES);
    expect(service.allCourses()).toEqual(MOCK_COURSES);
  });

  it('should get course by Id', async () => {
    const coursePromise = service.findCourseById(12);

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toBe('GET')
    req.flush(mockCourse);

    const course = await coursePromise;
    expect(course.titles.description).toBe('Beginner Course');
  });

  it('should find lessons by query', async () => {
    const mockLessons = { payload: [{ id: 1, description: 'Lesson 1' }] };

    const promise = service.findLessons(12, 'filter-text', 'desc', 2, 10);

    const req = httpTestingController.expectOne(req => req.url === '/api/lessons');

    expect(req.request.params.get('courseId')).toBe('12');
    expect(req.request.params.get('filter')).toBe('filter-text');
    expect(req.request.params.get('sortOrder')).toBe('desc');
    expect(req.request.params.get('pageNumber')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('10');

    req.flush(mockLessons);

    const result = await promise;
    expect(result).toEqual(mockLessons.payload);
  });



  it('should save course', async () => {
    const firstCourse = createCourse({ id: 1, titles: { description: 'Old Title' } });
    const secondCourse = createCourse({ id: 2, titles: { description: 'Stay Same' } });


    const loadCoursesPromise = service.findAllCourses();
    const loadCoursesReq = httpTestingController.expectOne('/api/courses');
    expect(loadCoursesReq.request.method).toBe('GET');
    loadCoursesReq.flush({ payload: [firstCourse, secondCourse] });
    await loadCoursesPromise;

    const changes: Partial<Course> = {
      titles: { description: 'New Title' }
    };

    const updatedCourse = {...firstCourse, ...changes};

    const savePromise = service.saveCourse(1, changes);
    const saveCourseReq = httpTestingController.expectOne('/api/courses/1');
    expect(saveCourseReq.request.method).toBe('PUT');
    saveCourseReq.flush(updatedCourse);
    await savePromise;

    const allCourses = service.allCourses();
    expect(allCourses[0].titles.description).toBe('New Title');
    expect(allCourses.find(c => c.id === 2)?.titles?.description).toBe('Stay Same');
  });


});
