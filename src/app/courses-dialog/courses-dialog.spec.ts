import {describe, it, expect, vi, beforeEach} from 'vitest';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import { DebugElement} from '@angular/core'
import { By } from '@angular/platform-browser'
import { clickButton } from '../testing/testing-utils'
import { CoursesService } from '../services/courses.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MOCK_COURSES } from '../testing/testing-data';
import { CoursesDialog } from './courses-dialog';
import { FieldState } from '@angular/forms/signals';

describe('CourseDialog', ()=>{

    let mockCoursesService: any
    let mockDialogRef:any
    let component: CoursesDialog
    let fixture: ComponentFixture<CoursesDialog>  
    let de: DebugElement

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
                {provide: CoursesService, useValue: mockCoursesService},
                {provide: DialogRef, useValue: mockDialogRef},
                {provide: DIALOG_DATA, useValue: {course: MOCK_COURSES[0]}}
            ]
        }).compileComponents()
        fixture = TestBed.createComponent(CoursesDialog)
        component=fixture.componentInstance
        de = fixture.debugElement 
        fixture.detectChanges()
    })

    it('should correctly initialize the form with course data', () => {
        expect(component.courseForm.description().value()).toBe("Beginner Course")
        expect(component.courseForm.category().value()).toBe("BEGINNER")
        expect(component.courseForm.longDescription().value()).toBe("Theory")
        expect(component.courseForm.releasedAt().value()).toBe(new Date().toLocaleDateString("en-CA"))
        expect(component.courseForm().valid()).toBe(true)
    })

    it('should handle description error', async () => {
        component.courseForm.description().value.set('')
        component.courseForm.description().markAsTouched()
        fixture.detectChanges()
        
        const errorList = de.query(By.css(".description .error-list"))
        expect(errorList).toBeTruthy()
        expect(errorList.nativeElement.textContent).toContain("Description is required")
        
        const saveBtn = de.query(By.css(".btn-primary"))?.nativeElement
        expect(saveBtn?.disabled).toBe(true)
    })

    it('should handle all form field errors', async() => {
        testFieldError(component.courseForm.description(), ".description", "Description")
        testFieldError(component.courseForm.category(), ".category", "Category")
        testFieldError(component.courseForm.releasedAt(), ".released-at", "Release Date")
        testFieldError(component.courseForm.longDescription(), ".long-description","Long Description")
    })

    it('should call saveCourse and close dialog', async () => {
        component.courseForm.description().value.set("New Course Title")
        fixture.detectChanges()

        clickButton(de, '.btn-primary')
        await fixture.whenStable()

        expect(mockCoursesService.saveCourse).toHaveBeenCalledWith(
            1, 
            expect.objectContaining({titles: expect.objectContaining({description: "New Course Title"})})
        )

        expect(mockDialogRef.close).toHaveBeenCalled()
    })

    function testFieldError(fieldState: FieldState<any>, selector: string, message: string){
        fieldState.value.set('')
        fieldState.markAsTouched()
        fixture.detectChanges()
        
        const errorList = de.query(By.css(`${selector} .error-list`))
        expect(errorList).toBeTruthy()
        expect(errorList.nativeElement.textContent).toContain(`${message} is required`)
        
        const saveBtn = de.query(By.css(".btn-primary"))?.nativeElement
        expect(saveBtn?.disabled).toBe(true)
    }


})