import {describe, it, expect, beforeEach} from 'vitest';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import {DebugElement} from '@angular/core'
import { By } from '@angular/platform-browser'
import {CoursesCardList} from './courses-card-list'
import { provideRouter } from '@angular/router';
import { MOCK_COURSES } from '../testing/testing-data';
import { CoursesDialog } from '../courses-dialog/courses-dialog';

describe('CoursesCardList', () => {

    // let component: CoursesCardList
    let fixture: ComponentFixture<CoursesCardList>  
    let de: DebugElement

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CoursesCardList, CoursesDialog],
            providers: [provideRouter([])]
        }).compileComponents()


        fixture = TestBed.createComponent(CoursesCardList)
        component=fixture.componentInstance
        de = fixture.debugElement

        fixture.componentRef.setInput('courses', MOCK_COURSES)
        fixture.detectChanges()
    })
    it('should display the course list', () =>{
        const cardTitles = de.queryAll(By.css(".course-card .card-header"))
        expect(cardTitles.length).toBe(2)
        const titleEl = cardTitles[0].nativeElement
        expect(titleEl.textContent).toBe("Beginner Course")
    })
    it('should display message when no course', () => {
        fixture.componentRef.setInput('courses', [])
        fixture.detectChanges()
        const msg = de.query(By.css(".no-courses"))
        expect(msg).toBeTruthy()
        expect(msg.nativeElement.textContent).toContain("No courses found")
    })

    it('should open dialog when clicking the edit button', () => {
        const btn = de.query(By.css(".course-card:first-child .edit-btn"))
        btn.nativeElement.click();
        fixture.detectChanges()
        const form = document.querySelectorAll(".course-form")
        expect(form, "The edit course form should be visible").toBeTruthy()
    })
   
})