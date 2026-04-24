
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import {DebugElement} from '@angular/core'
import { By } from '@angular/platform-browser'
import {Courses} from './courses'
import { provideRouter } from '@angular/router';

import { HttpTestingController, provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { provideHttpClient } from '@angular/common/http';
import { MOCK_COURSES } from '../testing/testing-data';

describe('CoursesCardList', () => {

    let component: Courses
    let fixture: ComponentFixture<Courses>  
    let de: DebugElement
    let httpMock: HttpTestingController

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Courses, HttpClientTestingModule],
            providers: [provideRouter([]), 
                        CoursesService, 
                        provideHttpClient, 
                        provideHttpClientTesting]
        }).compileComponents()


        fixture = TestBed.createComponent(Courses)
        component=fixture.componentInstance
        de = fixture.debugElement 
        httpMock = TestBed.inject(HttpTestingController)       
        fixture.detectChanges()        
    })

    it('should load courses and filter by category', async () => {
        const req = httpMock.expectOne("/api/courses")
        req.flush({payload: MOCK_COURSES})
        await fixture.whenStable()
        fixture.detectChanges()

        const titles = de.queryAll(By.css(".course-card .card-header"))
        expect(titles).toHaveLength(1)
        const titleEl = titles[0].nativeElement
        expect(titleEl.textContent).toBe("Beginner Course")
        
    })

    it('should show advanced courses when tab clicked', async() => {
         const req = httpMock.expectOne("/api/courses")
        req.flush({payload: MOCK_COURSES})
        await fixture.whenStable()
        fixture.detectChanges()

        const btn = de.query(By.css(".tab-link:last-child"))
        btn.nativeElement.click()
        fixture.detectChanges()

        const titles = de.queryAll(By.css(".course-card .card-header"))
        expect(titles).toHaveLength(1)
        const titleEl = titles[0].nativeElement
        expect(titleEl.textContent).toBe("Advanced Course")
    })

    afterEach(() => {
        httpMock.verify()
    })
})