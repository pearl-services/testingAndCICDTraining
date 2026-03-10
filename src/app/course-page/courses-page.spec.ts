
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ApplicationRef, DebugElement} from '@angular/core';
import {MOCK_COURSES, MOCK_LESSONS} from '../testing/testing-data';
import {CoursesService} from '../services/courses.service';
import {CoursePage} from './course-page';
import {ActivatedRoute, Router} from '@angular/router';
import {By} from '@angular/platform-browser';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

describe('CoursePage', () => {
  let component: CoursePage;
  let fixture: ComponentFixture<CoursePage>;
  let de: DebugElement;
  let mockCoursesService: any;

  beforeEach(async () => {
    mockCoursesService = {
      findLessons: vi.fn().mockResolvedValue(MOCK_LESSONS)
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

  it('should load lessons on init', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(mockCoursesService.findLessons).toHaveBeenCalledWith(1, '', 'asc', 0, 3);
    const rows = de.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
  });

  it('should show the loading spinner while fetching', async () => {
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.loading-spinner'));
    expect(spinner).toBeTruthy();
    expect(component.loading()).toBe(true);
  });

  it('should navigate to next or previous page', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3);

    component.nextPage();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.pageIndex()).toBe(1);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 1, 3);

    component.prevPage();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.pageIndex()).toBe(0);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3);
  });

  it('should toggle sort direction', async () => {
    fixture.detectChanges();
    expect(component.sortDirection()).toBe('asc');
    let sortBtn = de.query(By.css('.sort-btn'));
    expect(sortBtn.nativeElement.textContent).toContain('↑');

    const sortHeader = de.query(By.css('.sortable'));
    sortHeader.nativeElement.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.sortDirection()).toBe('desc');
    expect(component.pageIndex()).toBe(0);

    sortBtn = de.query(By.css('.sort-btn'));
    expect(sortBtn.nativeElement.textContent).toContain('↓');
  });

  it('should update page size', async () => {
    component.pageIndex.set(1);
    component.pageSize.set(3);

    fixture.detectChanges();
    await fixture.whenStable();

    const selectEl = fixture.debugElement.query(By.css('.items-label select')).nativeElement;

    selectEl.value = '10';
    selectEl.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.pageSize()).toBe(10);
    expect(component.pageIndex()).toBe(0);
  });

  /*




  it('should debounce search input (400ms)', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    component.onSearch('advanced');

    await delay(450);
    await fixture.whenStable();

    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, 'advanced', 'asc', 0, 3);
  });
*/


});
