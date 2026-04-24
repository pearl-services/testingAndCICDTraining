import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core'
import { By } from '@angular/platform-browser'
import { clickButton, getTableContent } from '../testing/testing-utils'
import { ActivatedRoute, provideRouter } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { provideHttpClient } from '@angular/common/http';
import { HighlightDirective } from './highlight.directive';

@Component({
    imports: [HighlightDirective],
    template: `
        <div id="default-highlight" appHighlight>Default Color</div>
        <div id="custom-highlight" appHighlight highlightColor="rgb(0,0,255)">Custom Color</div>
        <div id="no-highlight">No Directive</div>
        `
})

class TestHostComponent{}


describe('HighlightDirective', () => {

    let fixture:ComponentFixture<TestHostComponent>
    let de:DebugElement;
    let defaultHighlight: any
    let customHighlight: any
    let noHighlight: any

    beforeEach(async() => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent]
        }).compileComponents()
        fixture = TestBed.createComponent(TestHostComponent)
        de =fixture.debugElement
        fixture.detectChanges()

        defaultHighlight = de.query(By.css("#default-highlight")).nativeElement
        customHighlight = de.query(By.css("#custom-highlight")).nativeElement
        noHighlight = de.query(By.css("#no-highlight")).nativeElement
    })

    it('should have found all elements', () => {
        expect(defaultHighlight).toBeTruthy()
        expect(customHighlight).toBeTruthy()        
    })
    it('should highlight when mouse over, clear when mouse leave', () => {
        defaultHighlight.dispatchEvent(new Event("mouseenter"))
        fixture.detectChanges()
        expect(defaultHighlight.style.backgroundColor).toBe("rgb(0, 128, 0)")

        defaultHighlight.dispatchEvent(new Event("mouseleave"))
        fixture.detectChanges()
        expect(defaultHighlight.style.backgroundColor).toBe("")
    })

    it('should apply custom color', () => {
        customHighlight.dispatchEvent(new Event("mouseenter"))
        fixture.detectChanges()
        expect(customHighlight.style.backgroundColor).toBe("rgb(0, 0, 255)")
    })

    it('should not affect elements without the directive', () => {
        noHighlight.dispatchEvent(new Event("mouseenter"))
        fixture.detectChanges()
        expect(noHighlight.style.backgroundColor).toBe("")
    })
})