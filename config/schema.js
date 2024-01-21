const schema =` 

CREATE TABLE users( 
	userId varchar(255) ,
	firstName varchar(255),
	lastName varchar(255),
	age int,
	email varchar(255),
	password varchar(255),
	city varchar(255),
	role varchar(255),
  phone varchar(255),
  username varchar(255),
	constraint user_pk primary key (userId),
  constraint [Age cannot be less than 6.] check (age > 6 OR age = 6)
);

CREATE TABLE parents(
  parentId int IDENTITY(1,1),
  userId varchar(255) not null,
  constraint parents_pk primary key (parentId),
  constraint parent_uq unique (userId),
  constraint parents_fk foreign key (userId) 
  references users (userId)
);

CREATE TABLE instructors(
  instructorId int IDENTITY(1,1),
  userId varchar(255) not null,
  constraint instructor_pk primary key (instructorId),
  constraint instructor_uq unique (userId),
  constraint instructor_fk foreign key (userId) 
  references users (userId)
);


CREATE TABLE admins(
  adminId int IDENTITY(1,1),
  userId varchar(255) not null,
  constraint admin_pk primary key (adminId),
  constraint admin_uq unique (userId),
  constraint admin_fk foreign key (userId) 
  references users (userId)
);


CREATE TABLE students(
  studentId int IDENTITY(1,1),
  userId varchar(255) not null,
  lastCourses varchar(600),
  parentId int,
  constraint student_pk primary key (studentId),
  constraint student_uq unique (userId),
  constraint student_fk foreign key(parentId)
  references parents (parentId),
  constraint student_fk2 foreign key (userId) 
  references users (userId)
);

CREATE TABLE courses(
  courseId int IDENTITY(1,1),
  instructorId int,
  sessionsCount int,
  constraint courses_pk PRIMARY KEY (courseId),
  constraint courses_fk FOREIGN KEY (instructorId)
  references instructors (instructorId)
);

CREATE TABLE studentCourses(
  courseId int IDENTITY(1,1),
  studentId int,
  constraint studentCourses_fk FOREIGN KEY (courseId)
  references courses (courseId),
  constraint studentCourses_fk2 FOREIGN KEY (studentId)
  references students (studentId)
);

CREATE TABLE sections(
  sectionId int IDENTITY(1,1),
  courseId int,
  sectionDescription varchar(300),
  constraint section_pk PRIMARY KEY (sectionId),
  constraint sections_fk FOREIGN KEY (courseId)
  references courses (courseId),
);

CREATE TABLE lectures(
  lectureId int IDENTITY(1,1),
  sectionId int ,
  vedioUrl varchar(255),
  sectionDescription varchar(255),
  constraint lectures_pk PRIMARY KEY (lectureId),
  constraint lecture_fk FOREIGN KEY (sectionId)
  references sections (sectionId)
);

CREATE TABLE quizes(
  quizId int IDENTITY(1,1),
  sectionId int,
  constraint quizes_pk PRIMARY KEY (quizId),
  constraint quizes_fk FOREIGN KEY (sectionId)
  references sections (sectionId)
);

CREATE TABLE solutions(
  solutionId int IDENTITY(1,1),
  quizId int unique,
  constraint solutions_pk PRIMARY KEY (solutionId),
  constraint solutions_fk FOREIGN KEY (quizId)
  references quizes (quizId)
);
`

module.exports = schema;