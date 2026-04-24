import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import {DebugElement} from '@angular/core'
import { By } from '@angular/platform-browser'
import {CoursePage} from './course-page'
import { clickButton, getTableContent } from '../testing/testing-utils'
import { ActivatedRoute, provideRouter } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { provideHttpClient } from '@angular/common/http';
import { getMockLessonsPage, MOCK_COURSES, MOCK_LESSONS } from '../testing/testing-data';



const FIRST_PAGE = getMockLessonsPage(1, '', 'asc', 0 , 3)
const SECOND_PAGE = getMockLessonsPage(1, '', 'asc', 1 , 3)
const SEARCH_RESULTS = getMockLessonsPage(1, 'Lesson 20', 'asc', 0 , 3)

describe('CoursePage', () => {
    let mockCoursesService:any;
    let component: CoursePage
    let fixture: ComponentFixture<CoursePage>  
    let de: DebugElement
    let mockCourseService: any

    beforeEach(async() => {
        mockCoursesService = {
            findLessons: vi.fn()
        }

        await TestBed.configureTestingModule({
            imports: [CoursePage],
            providers: [
                {provide: CoursesService, useValue: mockCoursesService},
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            data: {
                                course: MOCK_COURSES[0]
                            }
                        }
                    }
                }
            ]

        }).compileComponents()
        fixture = TestBed.createComponent(CoursePage)
        component=fixture.componentInstance
        de = fixture.debugElement 
    })

    it('should load lessons on init', async() => {
        mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE)
        await fixture.whenStable()
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3)
        
        const lessons = getTableContent(de,"tbody tr td.description-cell")
        expect(lessons).toHaveLength(3)

        expect(lessons[0]).toBe("Lesson 1")
        expect(lessons[1]).toBe("Lesson 2")
        expect(lessons[2]).toBe("Lesson 3")
    })
    
    it('should show the loading spinner while fetching', () => {
        fixture.detectChanges()
        const spinner = de.query(By.css(".loading-spinner"))
        expect(spinner).toBeTruthy()
        expect(component.loading()).toBe(true)
    })

    it('should navigate to next page when next button is clicked', async() => {
        mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE)
        await fixture.whenStable()
        expect(mockCoursesService.findLessons).toHaveBeenCalledOnce()
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3)

        mockCoursesService.findLessons.mockReturnValueOnce(SECOND_PAGE)
        clickButton(de, ".page-controls button:last-child")
        await fixture.whenStable()

        const lessons = getTableContent(de,"tbody tr td.description-cell")
        expect(lessons).toHaveLength(3)

        expect(lessons[0]).toBe("Lesson 4")
        expect(lessons[1]).toBe("Lesson 5")
        expect(lessons[2]).toBe("Lesson 6")
    })

    it('should navigate to previous page when previous button is clicked', async() => {

        mockCoursesService.findLessons.mockReturnValueOnce(SECOND_PAGE)  
                                       
        component.pageIndex.set(1)    
        await fixture.whenStable()
        expect(mockCoursesService.findLessons).toHaveBeenCalledOnce()
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 1, 3)

        mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE)
        clickButton(de, ".page-controls button:first-child")
        
        await fixture.whenStable()
        fixture.detectChanges()

        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2)
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3)

        const lessons = getTableContent(de,"tbody tr td.description-cell")
        expect(lessons).toHaveLength(3)

        expect(lessons[0]).toBe("Lesson 1")
        expect(lessons[1]).toBe("Lesson 2")
        expect(lessons[2]).toBe("Lesson 3")
    })

    it('should toggle the sort direction', async() => {
        mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE)
        await fixture.whenStable()
        expect(component.sortDirection()).toBe("asc");
        
        mockCoursesService.findLessons.mockReturnValueOnce(MOCK_LESSONS.reverse().slice(0,3))
        clickButton(de, ".sortable")
        await fixture.whenStable()

        expect(component.sortDirection()).toBe('desc')
        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2)
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'desc', 0, 3)

        const lessons = getTableContent(de,"tbody tr td.description-cell")
        expect(lessons).toHaveLength(3)

        expect(lessons[0]).toBe("Lesson 20")
        expect(lessons[1]).toBe("Lesson 19")
        expect(lessons[2]).toBe("Lesson 18")
    })


    it('should update the page size', async () => {
        mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE)
        await fixture.whenStable()

        mockCoursesService.findLessons.mockReturnValueOnce(getMockLessonsPage(1, '', 'asc', 0, 10))

        const selectEl = de.query(By.css('.items-label select')).nativeElement
        selectEl.value = 10
        selectEl.dispatchEvent(new Event("change"))
        await fixture.whenStable()

        expect(component.pageSize()).toBe(10)
        expect( component.pageIndex()).toBe(0)

        const lessons = getTableContent(de,"tbody tr td.description-cell")
        expect(lessons).toHaveLength(10)
        expect(lessons[0]).toBe("Lesson 1")
        expect(lessons[9]).toBe("Lesson 10")
    })

    it('should debounce search input by 400ms', async() => {
        vi.useFakeTimers();
        
        mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);        
        fixture.detectChanges();

        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);
        mockCoursesService.findLessons.mockReturnValueOnce(SEARCH_RESULTS);

        component.onSearch("Lesson 20");

        vi.advanceTimersByTime(399);
        fixture.detectChanges();

        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1);
        fixture.detectChanges();

        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(
            1, 'Lesson 20', 'asc', 0, 3)
      
        await vi.runAllTimersAsync();
        
        expect(component.lessons()?.length).toBe(1);
        
        const lessons = getTableContent(de, "tbody tr td.description-cell");
        expect(lessons).toHaveLength(1);
        expect(lessons[0]).toBe("Lesson 20");
    }, 10000);

    afterEach(() => {
        vi.useRealTimers()
    })

})