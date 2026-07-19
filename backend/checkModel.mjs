import Course from './model/courseModel.js';
console.log('Course export type:', typeof Course);
console.log('Course keys:', Object.keys(Course || {}));
console.log('has find:', typeof (Course && Course.find));
