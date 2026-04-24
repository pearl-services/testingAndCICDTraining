import {describe, it, expect, vi, beforeEach} from 'vitest';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import {DebugElement} from '@angular/core'
import { By } from '@angular/platform-browser'
import {TabsComponent} from './tabs'
import {MOCK_TABS} from '../testing/testing-data'
import {TabData} from './tabs.model'

describe.only('TabsComponent', () => {

    let fixture: ComponentFixture<TabsComponent>
    let de: DebugElement;
    let el: HTMLElement;
    let component: TabsComponent

    const mockTabs: TabData[] = MOCK_TABS;

    beforeEach(async() => {
        await TestBed.configureTestingModule({
            imports: [TabsComponent]
        }).compileComponents()
        
        fixture = TestBed.createComponent(TabsComponent);
        fixture.componentRef.setInput("tabs", mockTabs)        
        component = fixture.componentInstance; 
        de = fixture.debugElement;       
        fixture.detectChanges();
    })

    it('should create the tabs component', () => {
        expect(fixture.componentInstance).toBeDefined()
    })

    it('should render the correct number of tab buttons', () => {
        const buttons = de.queryAll(By.css(".tab-link"))
        expect(buttons.length).toBe(2)
        expect(buttons[0].nativeElement.textContent.trim()).toEqual("Beginner")
        expect(buttons[1].nativeElement.textContent.trim()).toEqual("Advanced")
    })

    it('should apply the active class to the selected tab', () => {
        fixture.componentRef.setInput("activeTab", "advanced")
        fixture.detectChanges()
        const button = de.query(By.css(".tab-link:last-child"))
        expect(button.nativeElement.classList).toContain("active")
    })

    it('should emit activeTab when a tab is clicked', () => {
        const button = de.query(By.css(".tab-link:last-child"))
        button.nativeElement.click()
        fixture.detectChanges()
        expect(component.activeTab()).toBe("advanced")
    }) 
    
    it('should emit tabChange when a tab is clicked', () => {
        const emitSpy = vi.spyOn(component.tabChanged, "emit")
        const button = de.query(By.css(".tab-link:last-child"))
        button.nativeElement.click()
        fixture.detectChanges()
        expect(emitSpy).toHaveBeenCalledWith("advanced")
        expect(emitSpy).toHaveBeenCalledOnce()
    })
})
