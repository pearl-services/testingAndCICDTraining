import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing"
import { CoursesService } from "./courses.service"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { provideHttpClient } from "@angular/common/http"
import { TestBed } from "@angular/core/testing"
import { createCourse, MOCK_COURSES } from "../testing/testing-data"
import { endWith } from "rxjs"
import { Course } from "../model/course"

describe("CoursesService", () => {
    let service:CoursesService
    let httpTestingController: HttpTestingController

    beforeEach(()=>{
        TestBed.configureTestingModule({
            providers:[
                CoursesService,
                provideHttpClient,
                provideHttpClientTesting()
            ]
        })
        service=TestBed.inject(CoursesService)
        httpTestingController=TestBed.inject(HttpTestingController)
    })

    afterEach(() => {
        httpTestingController.verify()
    })

    it('should load all courses', async() =>{

        const coursePromise = service.reloadAllCourses();
        await Promise.resolve();
        const req = httpTestingController.expectOne("/api/courses")
        expect(req.request.method).toBe("GET")

        req.flush({payload: MOCK_COURSES})

        const result = await coursePromise

        expect(result).toBe(MOCK_COURSES)
        expect(service.allCourses()).toBe(MOCK_COURSES)    
        httpTestingController.match("/api/courses").forEach(req => {
            req.flush({ payload: MOCK_COURSES });
        });
    })

    it('should get the course by id', async() => {
        const coursePromise = service.findCourseById(1)

        const req = httpTestingController.expectOne('/api/courses/1')
        expect(req.request.method).toBe('GET')
        req.flush(MOCK_COURSES[0])

        const course = await coursePromise
        expect(course.id).toBe(1)
        expect((await coursePromise).titles.description).toBe('Beginner Course')
    })

    it('should find the lesson by query', async() => {
        const promise = service.findLessons(12, 'filter-text', 'desc', 2, 10)
        const req = httpTestingController.expectOne(req => req.url === '/api/lessons')

        const params = req.request.params

        expect(params.get('courseId')).toBe('12')
        expect(params.get('filter')).toBe('filter-text')
        expect(params.get('sortOrder')).toBe('desc')
        expect(params.get('pageNumber')).toBe('2')
        expect(params.get('pageSize')).toBe('10')
    })

    it('should save the edited course', async () => {
        const course1 = createCourse({id: 1, titles: {description: 'Initial Title'}})
        const course2 = createCourse({id: 2, titles: {description: 'Stay Same'}})

        const loadPromise = service.reloadAllCourses()
        const loadReq = httpTestingController.expectOne('/api/courses')
        loadReq.flush({payload:[course1, course2]})

        const changes:Partial<Course>= {titles: {description: "New Title"}}

        const savePromise = service.saveCourse(1, changes)
        const req = httpTestingController.expectOne('/api/courses/1')
        expect(req.request.method).toBe('PUT')
        expect(req.request.body).toBe(changes)
        req.flush({...course1, ...changes})
        await savePromise

        const allCourses = service.allCourses()
        expect(allCourses[0].titles.description).toBe("New Title")
        expect(allCourses[1].id).toBe(2)
        expect(allCourses[1].titles.description).toBe("Stay Same")
    })

    
})
