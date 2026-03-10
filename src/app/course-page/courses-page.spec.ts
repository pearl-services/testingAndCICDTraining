
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

  /*

  it('should update sorting and reset page', async () => {
    fixture.detectChanges();
    component.pageIndex.set(5);

    component.toggleSort();

    await fixture.whenStable();

    expect(component.sortDirection()).toBe('desc');
    expect(component.pageIndex()).toBe(0);
  });

  it('should show the loading spinner while fetching', async () => {
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.loading-spinner'));
    expect(spinner).toBeTruthy();
    expect(component.loading()).toBe(true);
  });

  it('should toggle sort direction and update the UI arrows', async () => {
    fixture.detectChanges();
    let sortBtn = fixture.debugElement.query(By.css('.sort-btn'));
    expect(component.sortDirection()).toBe('asc');
    expect(sortBtn.nativeElement.textContent).toContain('↑');

    const sortHeader = fixture.debugElement.query(By.css('.sortable'));
    sortHeader.triggerEventHandler('click', null);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.sortDirection()).toBe('desc');
    expect(component.pageIndex()).toBe(0);

    sortBtn = fixture.debugElement.query(By.css('.sort-btn'));
    expect(sortBtn.nativeElement.textContent).toContain('↓');
  });

  it('should update pageSize and reset pageIndex when selection changes', () => {
    component.pageIndex.set(5);
    component.pageSize.set(3);

    const selectEl = fixture.debugElement.query(By.css('.items-label select')).nativeElement;

    selectEl.value = '10';
    selectEl.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(component.pageSize()).toBe(10);
    expect(component.pageIndex()).toBe(0);
  });

  it('should decrement pageIndex when NOT on the first page', () => {
    component.pageIndex.set(1);
    component.prevPage();
    expect(component.pageIndex()).toBe(0);
  });

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
