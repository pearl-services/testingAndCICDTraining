import {beforeEach, describe, vi, it, expect} from 'vitest';
import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {CoursePage} from '../course-page/course-page';
import {provideRouter, Router} from '@angular/router';
import {courseResolver} from './course.resolver';
import {RouterTestingHarness} from '@angular/router/testing';
import {MOCK_COURSES} from '../testing/testing-data';

describe('CourseResolver', () => {
  let mockCoursesService: any;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
   mockCoursesService = {
      findCourseById: vi.fn()
    }

    await TestBed.configureTestingModule({
      imports: [CoursePage],
      providers: [
        {provide: CoursesService, useValue: mockCoursesService},
        provideRouter([{
          path: 'courses/:id',
          component: CoursePage,
          resolve: {
            course: courseResolver
          }
        }])
      ]
    }).compileComponents();

    harness = await RouterTestingHarness.create();

  })

  it("should load correct course by Id", async () => {

    mockCoursesService.findCourseById.mockResolvedValueOnce(MOCK_COURSES[0]);

    const component = await harness.navigateByUrl('/courses/1', CoursePage);

    // not needed
    // harness.fixture.detectChanges()
    // await harness.fixture.whenStable();

    // unnecessary - assert displayed correct component
    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(CoursePage);

    // assert final url
    expect(TestBed.inject(Router).url).toBe('/courses/1');

    // assert backend service was called with the right parameters
    expect(mockCoursesService.findCourseById).toHaveBeenCalledTimes(1);
    expect(mockCoursesService.findCourseById).toHaveBeenLastCalledWith("1");

    // assert data object was correctly populated
    expect(component.course()).toEqual(MOCK_COURSES[0]);

    // assert course data was rendered in the DOM
    expect(harness.routeNativeElement?.textContent).toContain('Beginner Course');

  })

})






