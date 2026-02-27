import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Course} from '../model/course';
import {MOCK_COURSES} from '../testing/testing-data';
import {describe, expect, it, vi, beforeEach} from "vitest"
import {provideRouter} from '@angular/router';
import {By} from '@angular/platform-browser';
import {Dialog} from '@angular/cdk/dialog';
import {CoursesCardList} from "./courses-card-list";
import {CoursesDialog} from '../courses-dialog/courses-dialog';

describe('CoursesCardList', () => {
  let component: CoursesCardList;
  let fixture: ComponentFixture<CoursesCardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesCardList],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesCardList);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('courses', MOCK_COURSES);
    fixture.detectChanges();
  });

  it('should display the course list', () => {

  });



});
