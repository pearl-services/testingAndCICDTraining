import {ComponentFixture, TestBed} from '@angular/core/testing';;
import {MOCK_COURSES} from '../testing/testing-data';
import {describe, expect, it, vi, beforeEach, afterEach} from "vitest"
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import { DebugElement} from '@angular/core';
import {Courses} from "./courses"
import {CoursesService} from '../services/courses.service';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {By} from '@angular/platform-browser';
import {TabsHarness} from "../tabs/tabs.harness";
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';

describe('Courses', () => {
  let component: Courses;
  let fixture: ComponentFixture<Courses>;
  let de: DebugElement;
  let httpMock: HttpTestingController;
  let tabs: TabsHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Courses],
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Courses);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    const loader = TestbedHarnessEnvironment.loader(fixture);
    tabs = await loader.getHarness(TabsHarness);

    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should load courses and filter by category', async () => {
    const req = httpMock.expectOne("/api/courses");
    req.flush({payload: MOCK_COURSES});
    await fixture.whenStable();
    fixture.detectChanges();
    const titles = de.queryAll(By.css(".course-card .card-header"));
    expect(titles).toHaveLength(1);
    const titleEl = titles[0].nativeElement;
    expect(titleEl.textContent).toBe("Beginner Course");

    expect(await tabs.getTabLabels()).toEqual(["Beginner", "Advanced"]);
    expect(await tabs.getActiveTabLabel()).toBe("Beginner");
  });

  it('should show advanced courses when tab clicked', async () => {
    const req = httpMock.expectOne("/api/courses");
    req.flush({payload: MOCK_COURSES});
    await fixture.whenStable();

    // alternative not using the harness
    //const btn = de.query(By.css(".tab-link:last-child"));
    // btn.nativeElement.click();
    // fixture.detectChanges();

    await tabs.clickTabByIndex(1);

    const titles = de.queryAll(By.css(".course-card .card-header"));
    expect(titles).toHaveLength(1);
    const titleEl = titles[0].nativeElement;
    expect(titleEl.textContent).toBe("Advanced Course");
  })

  afterEach(() => {
    httpMock.verify();
  })

});
