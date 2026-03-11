
import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ApplicationRef, DebugElement} from '@angular/core';
import {MOCK_COURSES, MOCK_LESSONS} from '../testing/testing-data';
import {CoursesService} from '../services/courses.service';
import {CoursePage} from './course-page';
import {ActivatedRoute, Router} from '@angular/router';
import {By} from '@angular/platform-browser';
import {Lesson} from '../model/lesson';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

describe('CoursePage', () => {
  let component: CoursePage;
  let fixture: ComponentFixture<CoursePage>;
  let de: DebugElement;
  let mockCoursesService: any;

  beforeEach(async () => {
    mockCoursesService = {
      findLessons: vi.fn(
        async (
          courseId: number,
          filter = '',
          sortOrder = 'asc',
          pageNumber = 0,
          pageSize = 3
        ) => {

          let lessons = MOCK_LESSONS.filter(l => l.courseId === courseId);

          if (filter?.trim()) {
            const q = filter.toLowerCase();
            lessons = lessons.filter(l => l.description.toLowerCase().includes(q));
          }

          lessons = [...lessons].sort((a, b) => {
            return sortOrder === 'asc' ? a.seqNo - b.seqNo : b.seqNo - a.seqNo;
          });

          const start = pageNumber * pageSize;
          const end = start + pageSize;

          return lessons.slice(start, end);
        }
      )
    };

    await TestBed.configureTestingModule({
      imports: [CoursePage],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { course: MOCK_COURSES[0] } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursePage);
    de = fixture.debugElement;
    component = fixture.componentInstance;
  });

  function clickButton(de: DebugElement, selector:string) {
    const btn = de.query(By.css(selector));
    btn.nativeElement.click();

  }

  function getRowDescription(de: DebugElement, index: number) {
    const row = de.query(By.css(`tbody tr:nth-child(${index}) .description-cell`));
    return row?.nativeElement?.textContent ?? null;
  }

  it('should load lessons on init', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

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
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3);

    clickButton(de, ".page-controls button:last-child");

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.pageIndex()).toBe(1);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 1, 3);

    const rows = de.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3);

    // commented out - testing the mock
    //expect(getRowDescription(de, 1)).toBe("Lesson 4");
    //expect(getRowDescription(de, 2)).toBe("Lesson 5");
    //expect(getRowDescription(de, 3)).toBe("Lesson 6");
  });

  it('should navigate to previous page', async () => {

    component.pageIndex.set(1);
    clickButton(de, ".page-controls button:first-child");

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.pageIndex()).toBe(0);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3);

    const rows = de.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3);

    // commented out - testing the mock
    //expect(getRowDescription(de, 1)).toBe("Lesson 1");
    //expect(getRowDescription(de, 2)).toBe("Lesson 2");
    //expect(getRowDescription(de, 3)).toBe("Lesson 3");
  });

  it('should toggle sort direction', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.sortDirection()).toBe('asc');

    let sortBtn = de.query(By.css('.sort-btn'));
    expect(sortBtn.nativeElement.textContent).toContain('↑');

    clickButton(de, ".sortable");

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.sortDirection()).toBe('desc');
    sortBtn = de.query(By.css('.sort-btn'));
    expect(sortBtn.nativeElement.textContent).toContain('↓');

    const lesson = de.query(By.css("tr:first-child .description-cell"));

    expect(lesson.nativeElement.textContent).toBe("Lesson 20");
  });


  it('should update page size', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const selectEl = fixture.debugElement.query(By.css('.items-label select')).nativeElement;

    selectEl.value = '10';
    selectEl.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.pageSize()).toBe(10);
    expect(component.pageIndex()).toBe(0);

    // commented out testing the mock
    // expect(getRowDescription(de, 1)).toBe("Lesson 1");
    // expect(getRowDescription(de, 10)).toBe("Lesson 10");
  });


  it('should debounce search input by 400ms', async () => {
    vi.useFakeTimers();

    try {
      // initial component init + first resource load
      fixture.detectChanges();

      // check initial page load
      expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);
      expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1,'','asc',0, 3);

      component.onSearch('advanced');

      vi.advanceTimersByTime(399);
      fixture.detectChanges();

      expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1);
      fixture.detectChanges();

      expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
      expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, 'advanced', 'asc', 0, 3);
    }
    finally {
      vi.useRealTimers();
    }
  });



});
