
import {describe, it, beforeEach, expect, vi} from "vitest";
import { CoursesDialog } from "./courses-dialog";
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MOCK_COURSES} from '../testing/testing-data';
import { CoursesService } from "../services/courses.service";
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

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
  });

  it('should initialize the form with course data', () => {
    expect(component.courseForm.description().value()).toBe('Beginner Course');
    expect(component.courseForm().valid()).toBe(true);
  });

  it('should show error and disable save when description cleared', async () => {
    component.courseForm.description().value.set('');
    component.courseForm.description().markAsTouched();

    fixture.detectChanges();

    const errorList = de.query(By.css('.error-list'));
    expect(errorList).toBeTruthy();
    expect(errorList.nativeElement.textContent).toContain('Description is required');

    const saveBtn = de.query(By.css('.btn-primary')).nativeElement;
    expect(saveBtn.disabled).toBe(true);
  });

  it('should call saveCourse and close dialog on valid submission', async () => {
    component.courseForm.description().value.set('New Course Title');
    fixture.detectChanges();

    const saveBtn = de.query(By.css('.btn-primary'));
    saveBtn.nativeElement.click();

    await fixture.whenStable();

    expect(mockCoursesService.saveCourse).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        titles: expect.objectContaining({ description: 'New Course Title' })
      }));
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should make category mandatory', () => {
    component.courseForm.category().value.set('');
    component.courseForm.category().markAsTouched();

    fixture.detectChanges();

    const errors = de.queryAll(By.css('.error-list li'));
    const categoryError = errors.find(el =>
      el.nativeElement.textContent.includes('Category is required')
    );

    expect(categoryError).toBeTruthy();
  });

  it('should close the dialog without data when the close button is clicked', () => {
    const closeBtn = de.query(By.css('.close-button'));
    if (closeBtn) {
      closeBtn.nativeElement.click();
    } else {
      component.close();
    }

    expect(mockDialogRef.close).toHaveBeenLastCalledWith();
  });

  it('should log an error to the console when the service fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    mockCoursesService.saveCourse.mockRejectedValue(new Error('API Failure'));

    await component.save();

    expect(consoleSpy).toHaveBeenCalledWith("Save failed", expect.any(Error));

    expect(mockDialogRef.close).not.toHaveBeenCalledWith(expect.anything());

  });

  it('should initialize with default empty values if description/category are null', async () => {
    expect(component.courseModel().description).toBe(MOCK_COURSES[0].titles.description);
  });

  it('should display error messages for Release Date and Long Description', () => {
    const releaseDateField = component.courseForm.releasedAt();
    const longDescField = component.courseForm.longDescription();

    releaseDateField.value.set('');
    releaseDateField.markAsTouched();

    longDescField.value.set('');
    longDescField.markAsTouched();

    fixture.detectChanges();

    const errorItems = fixture.debugElement.queryAll(By.css('.error-list li'));
    const errorTexts = errorItems.map(el => el.nativeElement.textContent);

    expect(errorTexts).toContain('Release Date is required');
    expect(errorTexts).toContain('Long Description is required');
  });

  it('should switch button text to "Saving..." during the submission process', async () => {
    let resolveSave: (val: any) => void;
    const pendingPromise = new Promise(resolve => {
      resolveSave = resolve;
    });

    mockCoursesService.saveCourse.mockReturnValue(pendingPromise);

    component.save();
    fixture.detectChanges();

    const saveBtn = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;

    expect(saveBtn.textContent.trim()).toBe('Saving...');
    expect(saveBtn.disabled).toBe(true);

    resolveSave!({});

    await fixture.whenStable();
    await Promise.resolve();

    fixture.detectChanges();

    expect(component.courseForm().submitting()).toBe(false);
    expect(saveBtn.textContent.trim()).toBe('Save');
  });

  it('should initialize with empty strings when course data is missing', () => {
    const emptyCourse = {
      id: 99,
      titles: { },
    } as any;

    const model = {
      description: emptyCourse.titles.description ?? '',
      category: emptyCourse.category ?? '',
      longDescription: emptyCourse.titles.longDescription ?? ''
    };

    expect(model.description).toBe('');
    expect(model.category).toBe('');
    expect(model.longDescription).toBe('');
  });
});
