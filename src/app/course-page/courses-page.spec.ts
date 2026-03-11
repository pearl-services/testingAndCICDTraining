import {beforeEach, describe, expect, it, vi} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {getMockLessonsPage, MOCK_COURSES} from '../testing/testing-data';
import {CoursesService} from '../services/courses.service';
import {CoursePage} from './course-page';
import {ActivatedRoute} from '@angular/router';
import {By} from '@angular/platform-browser';
import {clickButton, getRowDescription} from "../testing/testing-utils";


const FIRST_PAGE = getMockLessonsPage(1, '', 'asc', 0, 3);
const SECOND_PAGE = getMockLessonsPage(1, '', 'asc', 1, 3);

describe('CoursePage', () => {
  let component: CoursePage;
  let fixture: ComponentFixture<CoursePage>;
  let de: DebugElement;
  let mockCoursesService: any;

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
          useValue: {snapshot: {data: {course: MOCK_COURSES[0]}}}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursePage);
    de = fixture.debugElement;
    component = fixture.componentInstance;
  });

  it('should load lessons on init', async () => {

    mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);

    await fixture.whenStable();

    expect(mockCoursesService.findLessons).toHaveBeenCalledWith(1, '', 'asc', 0, 3);
    const rows = de.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3);

    expect(getRowDescription(de, 1)).toBe("Lesson 1");
    expect(getRowDescription(de, 2)).toBe("Lesson 2");
    expect(getRowDescription(de, 3)).toBe("Lesson 3");
  });


  it('should show the loading spinner while fetching', async () => {
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.loading-spinner'));
    expect(spinner).toBeTruthy();
    expect(component.loading()).toBe(true);
  });


  it('should navigate to next page', async () => {

    mockCoursesService.findLessons
      .mockResolvedValueOnce(FIRST_PAGE)
      .mockResolvedValueOnce(SECOND_PAGE);

    await fixture.whenStable();
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3);

    let rows = de.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3);

    expect(getRowDescription(de, 1)).toBe("Lesson 1");
    expect(getRowDescription(de, 2)).toBe("Lesson 2");
    expect(getRowDescription(de, 3)).toBe("Lesson 3");

    clickButton(de, ".page-controls button:last-child");

    await fixture.whenStable();

    expect(component.pageIndex()).toBe(1);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 1, 3);

    rows = de.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3);

    expect(getRowDescription(de, 1, true)).toBe("Lesson 4");
    expect(getRowDescription(de, 2, true)).toBe("Lesson 5");
    //expect(getRowDescription(de, 3)).toBe("Lesson 6");
  });


  /*
  it('should navigate to previous page', async () => {

    mockCoursesService.findLessons
      .mockResolvedValueOnce(SECOND_PAGE)
      .mockResolvedValueOnce(FIRST_PAGE);

    // navigate to page 2
    component.pageIndex.set(1);

    await fixture.whenStable();

    let rows = de.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3);

    // assert we are on page 2
    expect(component.pageIndex()).toBe(1);
    expect(getRowDescription(de, 1)).toBe("Lesson 4");
    expect(getRowDescription(de, 2)).toBe("Lesson 5");
    expect(getRowDescription(de, 3)).toBe("Lesson 6");

    // navigate to previous page
    clickButton(de, ".page-controls button:first-child");

    await fixture.whenStable();

    expect(component.pageIndex()).toBe(0);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3);

    rows = de.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3);

    expect(getRowDescription(de, 1)).toBe("Lesson 1");
    expect(getRowDescription(de, 2)).toBe("Lesson 2");
    expect(getRowDescription(de, 3)).toBe("Lesson 3");
  });



it('should toggle sort direction', async () => {
  await fixture.whenStable();
  expect(component.sortDirection()).toBe('asc');

  let sortBtn = de.query(By.css('.sort-btn'));
  expect(sortBtn.nativeElement.textContent).toContain('↑');

  clickButton(de, ".sortable");

  await fixture.whenStable();

  expect(component.sortDirection()).toBe('desc');
  sortBtn = de.query(By.css('.sort-btn'));
  expect(sortBtn.nativeElement.textContent).toContain('↓');

  const lesson = de.query(By.css("tr:first-child .description-cell"));

  expect(lesson.nativeElement.textContent).toBe("Lesson 20");
});


it('should update page size', async () => {
  await fixture.whenStable();

  const selectEl = fixture.debugElement.query(By.css('.items-label select')).nativeElement;

  selectEl.value = '10';
  selectEl.dispatchEvent(new Event('change'));

  await fixture.whenStable();

  expect(component.pageSize()).toBe(10);
  expect(component.pageIndex()).toBe(0);

  expect(getRowDescription(de, 1)).toBe("Lesson 1");
  expect(getRowDescription(de, 10)).toBe("Lesson 10");
});


it('should debounce search input by 400ms', async () => {
  vi.useFakeTimers();

  try {
    // initial component init + first resource load
    fixture.detectChanges();

    // check initial page load
    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1,'','asc',0, 3);

    component.onSearch('Lesson 20');

    vi.advanceTimersByTime(399);
    fixture.detectChanges();

    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);
    fixture.detectChanges();

    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, 'Lesson 20', 'asc', 0, 3);

    await vi.runAllTimersAsync();

    const rows = de.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);

    expect(getRowDescription(de, 1)).toBe("Lesson 20");

  }
  finally {
    vi.useRealTimers();
  }
});

*/

});
