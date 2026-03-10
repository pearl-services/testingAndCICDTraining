import { Course } from '../model/course';
import {  Lesson } from '../model/lesson';
import { TabData } from '../tabs/tabs.model';

export function createCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: 12,
    seqNo: 1,
    titles: {
      description: 'Angular Testing',
      longDescription: 'A deep dive into testing'
    },
    iconUrl: 'test.png',
    uploadedImageUrl: '',
    courseListIcon: '',
    category: 'BEGINNER',
    lessonsCount: 10,
    ...overrides
  };
}

export const MOCK_COURSES: Course[] = [
  createCourse({ id: 1, category: 'BEGINNER', titles: { description: 'Beginner Course', longDescription: 'Theory' } }),
  createCourse({ id: 2, category: 'ADVANCED', titles: { description: 'Advanced Course', longDescription: 'Practice' } })
];

export const MOCK_LESSONS: Lesson[] = [
  { id: 101, seqNo: 1, description: 'Lesson 1', duration: '5:00', courseId: 1 },
  { id: 102, seqNo: 2, description: 'Lesson 2', duration: '6:00', courseId: 1 },
  { id: 103, seqNo: 3, description: 'Lesson 3', duration: '7:00', courseId: 1 },
  { id: 104, seqNo: 4, description: 'Lesson 4', duration: '8:00', courseId: 1 },
  { id: 105, seqNo: 5, description: 'Lesson 5', duration: '9:00', courseId: 1 },
  { id: 106, seqNo: 6, description: 'Lesson 6', duration: '4:30', courseId: 1 },
  { id: 107, seqNo: 7, description: 'Lesson 7', duration: '5:30', courseId: 1 },
  { id: 108, seqNo: 8, description: 'Lesson 8', duration: '6:30', courseId: 1 },
  { id: 109, seqNo: 9, description: 'Lesson 9', duration: '7:30', courseId: 1 },
  { id: 110, seqNo: 10, description: 'Lesson 10', duration: '8:30', courseId: 1 },
  { id: 111, seqNo: 11, description: 'Lesson 11', duration: '9:30', courseId: 1 },
  { id: 112, seqNo: 12, description: 'Lesson 12', duration: '10:00', courseId: 1 },
  { id: 113, seqNo: 13, description: 'Lesson 13', duration: '4:45', courseId: 1 },
  { id: 114, seqNo: 14, description: 'Lesson 14', duration: '5:45', courseId: 1 },
  { id: 115, seqNo: 15, description: 'Lesson 15', duration: '6:45', courseId: 1 },
  { id: 116, seqNo: 16, description: 'Lesson 16', duration: '7:45', courseId: 1 },
  { id: 117, seqNo: 17, description: 'Lesson 17', duration: '8:45', courseId: 1 },
  { id: 118, seqNo: 18, description: 'Lesson 18', duration: '9:15', courseId: 1 },
  { id: 119, seqNo: 19, description: 'Lesson 19', duration: '6:20', courseId: 1 },
  { id: 120, seqNo: 20, description: 'Lesson 20', duration: '7:10', courseId: 1 }
];

export const MOCK_TABS: TabData[] = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Advanced', value: 'advanced' }
];
