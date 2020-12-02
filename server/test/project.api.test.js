require('module-alias/register');
const request = require('supertest');
const app = require('@root/app');
const seeder = require('@test/test-seed');

beforeAll(async done => {
  await seeder.up();
  done();
});

afterAll(async done => {
  await seeder.down();
  done();
});

const SUCCESS_CODE = 201;
const SUCCESS_MSG = 'ok';

describe('get all projects', () => {
  it('project get all 일반', done => {
    const expectedProjects = seeder.projects.map(project => {
      const tasks = seeder.tasks.filter(task => task.projectId === project.id);
      const { id, title } = project;
      return { id, title, taskCount: tasks.length };
    });
    //  [
    //   { id: 'b7f253e5-7b6b-4ee2-b94e-369ffcdffb5f', taskCount: 5, title: '프로젝트 1' },
    //   { id: 'f7605077-96ec-4365-88fc-a9c3af4a084e', taskCount: 0, title: '프로젝트 2' },
    //   { taskCount: 2, title: '오늘' },
    // ];

    try {
      request(app)
        .get('/api/project')
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(
            res.body.every(project =>
              expectedProjects.some(
                expectedProject =>
                  Object.entries(project).toString === Object.entries(expectedProject).toString,
              ),
            ),
          ).toBeTruthy();

          done();
        });
    } catch (err) {
      done(err);
    }
  });
});

describe('get project by id', () => {
  it('project get by id 일반', done => {
    const expectedChildTaskId = '8d62f93c-9233-46a9-a5cf-ec18ad5a36f4';

    try {
      request(app)
        .get('/api/project/b7f253e5-7b6b-4ee2-b94e-369ffcdffb5f')
        .end((err, res) => {
          if (err) {
            throw err;
          }
          const childTask = res.body.sections[0].tasks[0].tasks[0];
          expect(childTask.id).toEqual(expectedChildTaskId);
          done();
        });
    } catch (err) {
      done(err);
    }
  });
});

describe('create project', () => {
  it('create project 일반', done => {
    const requestBody = {
      title: '새 프로젝트',
      isList: true,
    };

    try {
      request(app)
        .post('/api/project/')
        .send(requestBody)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.status).toBe(SUCCESS_CODE);
          expect(res.body.message).toBe(SUCCESS_MSG);
          done();
        });
    } catch (err) {
      done(err);
    }
  });
});

describe('update project', () => {
  it('update project PUT', done => {
    const requestBody = {
      title: '변경된 프로젝트',
      isList: true,
      isFavorite: true,
    };

    try {
      request(app)
        .put('/api/project/b7f253e5-7b6b-4ee2-b94e-369ffcdffb5f')
        .send(requestBody)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.status).toBe(SUCCESS_CODE);
          expect(res.body.message).toBe(SUCCESS_MSG);
          done();
        });
    } catch (err) {
      done(err);
    }
  });

  it('update project PATCH', done => {
    const requestBody = {
      title: '변경된 프로젝트',
      isList: true,
      isFavorite: true,
    };

    try {
      request(app)
        .patch('/api/project/b7f253e5-7b6b-4ee2-b94e-369ffcdffb5f')
        .send(requestBody)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.status).toBe(SUCCESS_CODE);
          expect(res.body.message).toBe(SUCCESS_MSG);
          done();
        });
    } catch (err) {
      done(err);
    }
  });
});

describe('delete project', () => {
  it('delete project 일반', done => {
    try {
      request(app)
        .delete('/api/project/f7605077-96ec-4365-88fc-a9c3af4a084e')
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.status).toBe(SUCCESS_CODE);
          expect(res.body.message).toBe(SUCCESS_MSG);
          done();
        });
    } catch (err) {
      done(err);
    }
  });
});

describe('create section', () => {
  it('create project 일반', done => {
    const requestBody = {
      title: '새로운 섹션',
    };

    try {
      request(app)
        .post('/api/project/b7f253e5-7b6b-4ee2-b94e-369ffcdffb5f/section')
        .send(requestBody)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.status).toBe(SUCCESS_CODE);
          expect(res.body.message).toBe(SUCCESS_MSG);
          done();
        });
    } catch (err) {
      done(err);
    }
  });
});

describe('update section task positions', () => {
  it('update section task positions 일반', done => {
    const requestBody = {
      orderedTasks: [
        '7d62f93c-9233-46a9-a5cf-ec18ad5a36f4',
        'cd62f93c-9233-46a9-a5cf-ec18ad5a36f4',
        '13502adf-83dd-4e8e-9acf-5c5a0abd5b1b',
      ],
    };

    try {
      request(app)
        .post(
          '/api/project/b7f253e5-7b6b-4ee2-b94e-369ffcdffb5f/section/7abf0633-bce2-4972-9249-69f287db8a47/task',
        )
        .send(requestBody)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.status).toBe(SUCCESS_CODE);
          expect(res.body.message).toBe(SUCCESS_MSG);
          done();
        });
    } catch (err) {
      done(err);
    }
  });
});

describe('update section', () => {
  it('update section 일반', done => {
    const requestBody = {
      title: '바뀐 섹션',
    };

    try {
      request(app)
        .put(
          '/api/project/b7f253e5-7b6b-4ee2-b94e-369ffcdffb5f/section/7abf0633-bce2-4972-9249-69f287db8a47',
        )
        .send(requestBody)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.status).toBe(SUCCESS_CODE);
          expect(res.body.message).toBe(SUCCESS_MSG);
          done();
        });
    } catch (err) {
      done(err);
    }
  });
});

describe('delete section', () => {
  it('update section 일반', done => {
    try {
      request(app)
        .delete(
          '/api/project/b7f253e5-7b6b-4ee2-b94e-369ffcdffb5f/section/7abf0633-bce2-4972-9249-69f287db8a47',
        )
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.status).toBe(SUCCESS_CODE);
          expect(res.body.message).toBe(SUCCESS_MSG);
          done();
        });
    } catch (err) {
      done(err);
    }
  });
});
