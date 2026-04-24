import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { provideHttpClient } from "@angular/common/http"
import { TestBed } from "@angular/core/testing"
import { createCourse, MOCK_COURSES } from "../testing/testing-data"
import { endWith } from "rxjs"
import { Course } from "../model/course"
import { DurationFormatPipe } from "./duration-format.pipe"

describe('DurationFormatPipe', () => {
    let pipe: DurationFormatPipe


    beforeEach(()=>{
        pipe = new DurationFormatPipe()
    })

    it('should create the pipe', () => {
        expect(pipe).toBeTruthy()    
    })

    it('should format duration', () => {
        const result = pipe.transform('05:30')
        expect (result).toBe("05h 30m")
    })
    it('should handle null or undefined', () => {
        expect(pipe.transform(<any>null)).toBe("")
        expect(pipe.transform(<any>undefined)).toBe("")
    })
    it('should return the original value if invalid input', () => {
        const input = "90"
        expect(pipe.transform(input)).toBe(input)
    })
    it('should only format the first two parts', () => {
        expect(pipe.transform("01:20:45")).toBe("01h 20m")
    })
})        