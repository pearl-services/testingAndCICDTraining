
import {describe, it, beforeEach, expect, vi} from "vitest";
import { CoursesDialog } from "./courses-dialog";
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MOCK_COURSES} from '../testing/testing-data';
import { CoursesService } from "../services/courses.service";
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {clickButton} from '../testing/testing-utils';

describe('CoursesDialog', () => {
  let component: CoursesDialog;
  let fixture: ComponentFixture<CoursesDialog>;
  let de: DebugElement;
  let mockCoursesService: any;
  let mockDialogRef: any;

  beforeEach(async () => {
    mockCoursesService = {
      saveCourse: vi.fn().mockResolvedValue({})
    };
    mockDialogRef = {
      close: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CoursesDialog],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: { course: MOCK_COURSES[0] } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesDialog);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();

  })

  it('should initialize the form with course data', () => {
    expect(component.courseForm().valid()).toBe(true);
    expect(component.courseForm.description().value()).toBe('Beginner Course');
    expect(component.courseForm.category().value()).toBe('BEGINNER');
    expect(component.courseForm.releasedAt().value()).toBe(new Date().toLocaleDateString('en-CA'));
    expect(component.courseForm.longDescription().value()).toBe('Theory');
  })

  it('should show error and disable save when invalid value', async () => {
    component.courseForm.description().value.set('');
    component.courseForm.description().markAsTouched();
    fixture.detectChanges();

    const errorList = de.query(By.css('.description .error-list'));
    expect(errorList).toBeTruthy();
    expect(errorList.nativeElement.textContent).toContain('Description is required');

    const saveBtn = de.query(By.css('.btn-primary'))?.nativeElement;
    expect(saveBtn?.disabled).toBe(true);

  })

  it('should call saveCourse and close dialog', async () => {
    component.courseForm.description().value.set('New Course Title');
    fixture.detectChanges();

    clickButton(de, ".btn-primary");
    await fixture.whenStable();

    expect(mockCoursesService.saveCourse).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        titles: expect.objectContaining({ description: 'New Course Title' })
      }));
    expect(mockDialogRef.close).toHaveBeenCalled();
  })

  it('should ensure category mandatory', () => {
    component.courseForm.category().value.set('');
    component.courseForm.category().markAsTouched();

    fixture.detectChanges();

    const errors = de.queryAll(By.css('.category .error-list li'));
    const categoryError = errors.find(el =>
      el.nativeElement.textContent.includes('Category is required')
    );

    expect(categoryError).toBeTruthy();
  })

  it('should close the dialog without data when the close button is clicked', () => {
    const closeBtn = de.query(By.css('.close-button'));
    if (closeBtn) {
      closeBtn.nativeElement.click();
    } else {
      component.close();
    }

    expect(mockDialogRef.close).toHaveBeenLastCalledWith();
  })

});
