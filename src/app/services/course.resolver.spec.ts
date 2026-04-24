import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core'
import { By } from '@angular/platform-browser'
import { clickButton, getTableContent } from '../testing/testing-utils'
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { provideHttpClient } from '@angular/common/http';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CoursePage } from '../course-page/course-page';
import {courseResolver} from './course.resolver'
import { RouterTestingHarness } from '@angular/router/testing';
import { MOCK_COURSES } from '../testing/testing-data';

describe('CourseResolver', () => {

    let mockCoursesService: any;
    let harness: RouterTestingHarness;

    beforeEach(async () => {
        mockCoursesService = {
            findCourseById:vi.fn()            
        }  
        
        await TestBed.configureTestingModule({
            imports: [CoursePage],
            providers: [
                {provide: CoursesService, useValue: mockCoursesService},
                provideRouter([{
                    path: 'courses/:id',
                    component: CoursePage,
                    resolve: { course: courseResolver}
                }])
            ]
        }).compileComponents()
        
        harness = await RouterTestingHarness.create()
    })

    it('should load correct course by Id', async() => {

        mockCoursesService.findCourseById.mockResolvedValueOnce(MOCK_COURSES[0])
        const component = await harness.navigateByUrl('/courses/1', CoursePage)

        expect(TestBed.inject(Router).url).toBe("/courses/1")
        expect(mockCoursesService.findCourseById).toHaveBeenCalledOnce()
        expect(mockCoursesService.findCourseById).toHaveBeenLastCalledWith("1")

        expect(component.course()).toEqual(MOCK_COURSES[0])
        expect(harness.routeNativeElement?.textContent).toContain("Beginner Course")
    })
})