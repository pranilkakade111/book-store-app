const chai = require('chai');
const request = require('supertest');
const chaiHttp = require('chai-http');
const server = require('../server');
const bookData = require('./bookSample.json');

chai.should();
chai.use(chaiHttp);

let adminToken = '';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYW5pbGtha2FkZTExMUBnbWFpbC5jb20iLCJpZCI6IjYwYmY0N2FjZmJkZTM4MDMyOGI2YWRjNSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjIzODUyNTY1LCJleHAiOjE2MjU5MjYxNjV9.GznNtVa41JOLW_LN6FdiemXB3jW-VySLed-o';

describe('Test Cases For Book Store App', () => {
  before((done) => {
    chai
      .request(server)
      .post('/adminLogin')
      .send(bookData.books.adminLogin)
      .end((err, res) => {
        adminToken = res.body.adminToken;
        done();
      });
  });
  describe('POST /books', () => {
    it('givenBookDetails_When_Proper_Should_Be_Able_To_Create_Book', (done) => {
      chai
        .request(server)
        .post('/books')
        .set('token', `${adminToken}`)
        .send(bookData.books.createBook)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('givenBookDetails_When_Proper_ShouldNot_Be_Able_To_Create_Book', (done) => {
      chai
        .request(server)
        .post('/books')
        .set('token', `${adminToken}`)
        .send(bookData.books.createBookWithNoAuthor)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('givenBookDetails_When_Proper_Should_Be_Not_Able_To_Create_Book', (done) => {
      chai
        .request(server)
        .post('/books')
        .set('token', `${adminToken}`)
        .send(bookData.books.createBookWithNoImage)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('givenBookDetails_When_Proper_Should_Be_Not_Able_To_Create_Book', (done) => {
      chai
        .request(server)
        .post('/books')
        .set('token', `${adminToken}`)
        .send(bookData.books.createBookWithNoPrice)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('givenBookDetails_When_Proper_ShouldNot_Be_Able_To_Create_Book', (done) => {
      chai
        .request(server)
        .post('/books')
        .set('token', `${adminToken}`)
        .send(bookData.books.createBookWithNoQuantity)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('givenBookDetails_When_Proper_ShouldNot_Be_Able_To_Create_Book', (done) => {
      chai
        .request(server)
        .post('/books')
        .set('token', `${adminToken}`)
        .send(bookData.books.createBookWithNoTitle)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('givenBookDetails_When_Give_UserToken_Should_Not_Be_Able_To_Create_Book', (done) => {
      chai
        .request(server)
        .post('/books')
        .set('token', `${invalidToken}`)
        .send(bookData.books.createBook)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('/GET, /books', () => {
    it('Given_Books_When_ProperEndPoint_Should_Return', (done) => {
      chai
        .request(server)
        .get('/books')
        .set('token', `${adminToken}`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('Given_Books_When_ImProperEndPoint_Should_Return', (done) => {
      chai
        .request(server)
        .get('/book')
        .set('token', `${adminToken}`)
        .send()
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('DELETE, /books/:bookId', () => {
    it('givenBook_When_ProperBookId_Should Delete', (done) => {
      chai
        .request(server)
        .delete('/books/60c5e2ff078a392c349808dc')
        .set('token', `${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('givenBook_When_ImProperBookId_Should_Not_Delete', (done) => {
      chai
        .request(server)
        .delete('/books/60ca0a0fe5a220286cf6e3a')
        .set('token', `${adminToken}`)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
