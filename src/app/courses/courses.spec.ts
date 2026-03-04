import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Course} from '../model/course';
import {MOCK_COURSES} from '../testing/testing-data';
import {describe, expect, it, vi, beforeEach, afterEach} from "vitest"
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {ApplicationRef, DebugElement} from '@angular/core';
import {Courses} from "./courses"
import {CoursesService} from '../services/courses.service';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {By} from '@angular/platform-browser';

describe('Courses', () => {
  let component: Courses;
  let fixture: ComponentFixture<Courses>;
  let de: DebugElement;
  let httpMock: HttpTestingController;

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
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should load courses and filter by category', () => {

  });

  it('should show advanced courses when tab clicked', () => {


  })

});
