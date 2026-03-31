
import {describe, it, beforeEach, expect, vi} from "vitest";
import { CoursesDialog } from "./courses-dialog";
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MOCK_COURSES} from '../testing/testing-data';
import { CoursesService } from "../services/courses.service";
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {clickButton} from '../testing/testing-utils';
import {FieldState} from '@angular/forms/signals';

describe('CoursesDialog', () => {
  let component: CoursesDialog;
  let fixture: ComponentFixture<CoursesDialog>;
  let de: DebugElement;
  let mockCoursesService: any;
  let mockDialogRef: any;

  beforeEach(async () => {
    mockCoursesService = {
      saveCourse: vi.fn().mockResolvedValue({})
    }
    mockDialogRef = {
      close: vi.fn()
    }

    await TestBed.configureTestingModule({
      imports: [CoursesDialog],
      providers: [
        {provide:CoursesService, useValue: mockCoursesService},
        {provide: DialogRef, useValue: mockDialogRef},
        {provide: DIALOG_DATA, useValue: {course: MOCK_COURSES[0]}}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesDialog);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should initialize the form with course data', () => {
    expect(component.courseForm.description().value()).toBe("Beginner Course");
    expect(component.courseForm.category().value()).toBe("BEGINNER");
    expect(component.courseForm.releasedAt().value())
      .toBe(new Date().toLocaleDateString("en-CA"));
    expect(component.courseForm.longDescription().value()).toBe("Theory");
    expect(component.courseForm().valid()).toBe(true);
  })

  it('should call saveCourse and close dialog', async () => {
    component.courseForm.description().value.set("New Course Title");
    fixture.detectChanges();

    clickButton(de, ".btn-primary");
    await fixture.whenStable();

    expect(mockCoursesService.saveCourse).toHaveBeenLastCalledWith(
      1,
      expect.objectContaining({
        titles: expect.objectContaining({description: "New Course Title"})
      })
    )
    expect(mockDialogRef.close).toHaveBeenCalled();

  })

  it('should handle all form field errors', async () => {
    testFieldError(component.courseForm.description(), ".description", "Description is required");
    testFieldError(component.courseForm.category(), ".category", 'Category is required');
    testFieldError(component.courseForm.releasedAt(), ".released-at", 'Release Date is required');
    testFieldError(component.courseForm.longDescription(), ".long-description", 'Long Description is required');
  })

  function testFieldError(fieldState:FieldState<any>, selector:string, message:string) {
    fieldState.value.set('');
    fieldState.markAsTouched();
    fixture.detectChanges();

    const errorList = de.query(By.css(`${selector} .error-list`));
    expect(errorList).toBeTruthy();
    expect(errorList.nativeElement.textContent).toContain(message);

    const saveBtn = de.query(By.css(".btn-primary"))?.nativeElement
    expect(saveBtn?.disabled).toBe(true);
  }

});
