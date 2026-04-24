import {describe, it, expect, vi, beforeEach} from 'vitest';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import {DebugElement} from '@angular/core'
import {HelloWorld} from './hello-world'

describe('Hello World', () => {

    let fixture: ComponentFixture<HelloWorld>
    let de: DebugElement;
    let el: HTMLElement;
    let component: HelloWorld

    beforeEach(async() => {
        await TestBed.configureTestingModule({
            imports: [HelloWorld]
        }).compileComponents()

        fixture = TestBed.createComponent(HelloWorld);
        de = fixture.debugElement;
        el = de.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    })

    it('should create the component', () => {
        expect(fixture.componentInstance).toBeDefined()
    })
    it('should display the message', () => {
        const h1=el.querySelector("h1")
        expect(h1).toBeDefined()
        expect(h1?.textContent).toEqual(component.message)

    })
})